import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import Markdown from 'react-native-markdown-display';
import { getChatbotContext, getInventory, getAlerts, getAnalytics } from '../api/client';
import { useAuth } from '../context/AuthContext';

const GROQ_API_KEY = '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ==================== SYSTEM PROMPT ====================
const SYSTEM_PROMPT = `Bạn là AI quản lý kho thông minh cho hệ thống phân loại dưa hấu tự động PDscript.

## VAI TRÒ:
- Trợ lý phân tích dữ liệu kho hàng
- Cung cấp thông tin tồn kho, cảnh báo, thống kê
- Trả lời bằng tiếng Việt, ngắn gọn, chuyên nghiệp
- Dùng Markdown để format (bold, danh sách, bảng)

## QUY TẮC:
1. Không dùng emoji
2. Trả lời dựa trên DATA được cung cấp
3. Nếu thiếu dữ liệu, nói rõ "Không có dữ liệu"
4. Đưa ra gợi ý hành động khi phù hợp
5. Format số liệu rõ ràng

## THUẬT NGỮ:
- Premium Bin: Thùng chứa dưa loại 1 (thượng hạng)
- Second-grade Bin: Thùng chứa dưa loại 2
- Fill %: Phần trăm đầy của thùng
- Detection: Phát hiện/phân loại một quả dưa

## CONTEXT DATA:
`;

// ...existing code...
const MessageBubble = ({ item }) => {
    const [isReasoningExpanded, setIsReasoningExpanded] = useState(false);

    if (item.sender === 'user') {
        return (
            <View style={[styles.messageBubble, styles.userBubble]}>
                <Text style={styles.userText}>{item.text}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.messageBubble, styles.botBubble]}>
            <Text style={styles.prefix}>AI:</Text>
            
            {item.reasoning && (
                <View style={styles.reasoningContainer}>
                    <TouchableOpacity 
                        style={styles.reasoningHeader} 
                        onPress={() => setIsReasoningExpanded(!isReasoningExpanded)}
                    >
                        <Text style={styles.reasoningLabel}>
                            {isReasoningExpanded ? '▼ Hide Thinking Process' : '▶ View Thinking Process'}
                        </Text>
                    </TouchableOpacity>
                    
                    {isReasoningExpanded && (
                        <View style={styles.reasoningContent}>
                            <Text style={styles.reasoningText}>{item.reasoning}</Text>
                        </View>
                    )}
                </View>
            )}

            <Markdown style={markdownStyles}>
                {item.text}
            </Markdown>
        </View>
    );
};

const ChatbotScreen = ({ onBack }) => {
// ...existing code...
    const { deviceId } = useAuth();
    
    const [messages, setMessages] = useState([
        { id: 1, text: "HỆ THỐNG SẴN SÀNG. Tôi có thể giúp bạn:\n\n- Xem **trạng thái tồn kho**\n- Xem **lịch sử cảnh báo**\n- Phân tích **thống kê** theo ngày/tuần/tháng\n\nBạn cần thông tin gì?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const flatListRef = useRef(null);

    // Context Data
    const [contextData, setContextData] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(null);

    // ==================== FETCH CONTEXT ====================
    const fetchContext = async (silent = false) => {
        if (!silent) setIsRefreshing(true);
        try {
            const data = await getChatbotContext(deviceId || 'device_001');
            setContextData(data);
            setLastRefresh(new Date());
            console.log('Context loaded:', data);
        } catch (error) {
            console.error('Error fetching context:', error);
        }
        if (!silent) setIsRefreshing(false);
    };

    useEffect(() => {
        fetchContext();
        // Auto refresh every 30 seconds
        const interval = setInterval(() => fetchContext(true), 30000);
        return () => clearInterval(interval);
    }, [deviceId]);

    // ==================== BUILD CONTEXT STRING ====================
    const buildContextString = () => {
        if (!contextData || !contextData.success) {
            return "Không có dữ liệu. Vui lòng thử lại sau.";
        }

        let ctx = "";

        // 1. Inventory
        if (contextData.inventory) {
            const inv = contextData.inventory;
            ctx += `\n### TỒN KHO (${new Date().toLocaleDateString('vi-VN')})\n`;
            ctx += `- Tổng: ${inv.total_items}/${inv.total_capacity} (${inv.overall_fill_percentage}%)\n`;
            if (inv.bins) {
                inv.bins.forEach(bin => {
                    ctx += `- ${bin.bin_name}: ${bin.current_count}/${bin.max_capacity} (${bin.fill_percentage}%) ${bin.is_full ? '[ĐẦY]' : ''}\n`;
                });
            }
        }

        // 2. Alerts
        if (contextData.alerts) {
            const alerts = contextData.alerts;
            ctx += `\n### CẢNH BÁO\n`;
            ctx += `- Chưa đọc: ${alerts.unread_count}\n`;
            ctx += `- Critical: ${alerts.severity_breakdown?.critical || 0}, Warning: ${alerts.severity_breakdown?.warning || 0}\n`;
            if (alerts.alerts && alerts.alerts.length > 0) {
                ctx += `- Gần đây:\n`;
                alerts.alerts.slice(0, 5).forEach(a => {
                    ctx += `  * [${a.severity.toUpperCase()}] ${a.message} (${a.created_at})\n`;
                });
            }
        }

        // 3. Analytics Today
        if (contextData.analytics?.today) {
            const today = contextData.analytics.today;
            ctx += `\n### THỐNG KÊ HÔM NAY\n`;
            ctx += `- Đã xử lý: ${today.summary?.total_processed || 0}\n`;
            ctx += `- Trung bình/ngày: ${today.summary?.average_per_day || 0}\n`;
            ctx += `- Giờ cao điểm: ${today.summary?.peak_hour || 'N/A'} (${today.summary?.peak_hour_count || 0} units)\n`;
            if (today.breakdown_by_class) {
                ctx += `- Phân loại:\n`;
                today.breakdown_by_class.forEach(b => {
                    ctx += `  * ${b.class_name}: ${b.count} (${b.percentage}%)\n`;
                });
            }
        }

        // 4. Analytics Week
        if (contextData.analytics?.week) {
            const week = contextData.analytics.week;
            ctx += `\n### THỐNG KÊ 7 NGÀY\n`;
            ctx += `- Tổng: ${week.summary?.total_processed || 0}\n`;
            ctx += `- So với tuần trước: ${week.summary?.growth_vs_previous || 0}%\n`;
        }

        return ctx;
    };

    // ==================== SEND MESSAGE ====================
    const sendMessage = async () => {
        if (inputText.trim() === '') return;

        const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputText;
        setInputText('');
        setIsLoading(true);

        try {
            // Refresh context before sending
            await fetchContext(true);
            
            const contextString = buildContextString();

            const apiMessages = [
                { 
                    role: "system", 
                    content: SYSTEM_PROMPT + contextString 
                },
                ...messages.slice(-10).map(msg => ({ 
                    role: msg.sender === 'user' ? 'user' : 'assistant', 
                    content: msg.text 
                })),
                { role: "user", content: currentInput }
            ];

            const response = await axios.post(GROQ_API_URL, {
                model: "openai/gpt-oss-120b",
                messages: apiMessages,
                temperature: 0.6,
                max_completion_tokens: 1024,
                include_reasoning: true,
                reasoning_effort: "medium"
            }, {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const messageData = response.data.choices[0].message;
            const botReply = messageData.content;
            const reasoning = messageData.reasoning;

            const botMessage = { 
                id: Date.now() + 1, 
                text: botReply, 
                sender: 'bot',
                reasoning: reasoning 
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Groq API Error:", error.response?.data || error.message);
            const errorMessage = { 
                id: Date.now() + 1, 
                text: "LỖI: Không thể kết nối đến AI. Vui lòng thử lại.", 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // ==================== QUICK ACTIONS ====================
    const quickActions = [
        { label: "Tồn kho", query: "Cho tôi xem trạng thái tồn kho hiện tại" },
        { label: "Cảnh báo", query: "Có cảnh báo nào chưa đọc không?" },
        { label: "Hôm nay", query: "Thống kê hôm nay như thế nào?" },
        { label: "Tuần này", query: "So sánh với tuần trước" },
    ];

    const handleQuickAction = (query) => {
        setInputText(query);
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const renderItem = ({ item }) => <MessageBubble item={item} />;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backText}>{'< EXIT'}</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>AI WAREHOUSE</Text>
                    {isRefreshing && <Text style={styles.syncText}>SYNCING...</Text>}
                </View>
                <TouchableOpacity onPress={() => fetchContext()} style={styles.refreshButton}>
                    <Text style={styles.refreshText}>REFRESH</Text>
                </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {quickActions.map((action, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.quickAction}
                            onPress={() => handleQuickAction(action.query)}
                        >
                            <Text style={styles.quickActionText}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.chatContent}
                />

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#3B82F6" />
                        <Text style={styles.loadingText}>ANALYZING DATA...</Text>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <Text style={styles.prompt}>{'>'}</Text>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Hỏi về tồn kho, cảnh báo, thống kê..."
                        placeholderTextColor="#4B5563"
                        onSubmitEditing={sendMessage}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendButtonText}>GỬI</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const markdownStyles = StyleSheet.create({
    body: { color: '#D1D5DB', fontFamily: 'Courier', fontSize: 14 },
    heading1: { color: '#F9FAFB', fontWeight: 'bold', fontSize: 18 },
    heading2: { color: '#F9FAFB', fontWeight: 'bold', fontSize: 16 },
    heading3: { color: '#10B981', fontWeight: 'bold', fontSize: 14 },
    strong: { color: '#F9FAFB', fontWeight: 'bold' },
    bullet_list: { marginLeft: 10 },
    ordered_list: { marginLeft: 10 },
    list_item: { marginBottom: 5 },
    code_inline: { backgroundColor: '#374151', color: '#F9FAFB', paddingHorizontal: 4 },
    fence: { backgroundColor: '#1F2937', color: '#F9FAFB', padding: 10, borderRadius: 4 },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 15,
        paddingBottom: 12,
        backgroundColor: '#1F2937',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    headerCenter: {
        alignItems: 'center',
    },
    backButton: {
        padding: 5,
    },
    backText: {
        color: '#9CA3AF',
        fontSize: 11,
        fontFamily: 'Courier',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#F9FAFB',
        letterSpacing: 2,
        fontFamily: 'Courier',
    },
    syncText: {
        fontSize: 9,
        color: '#3B82F6',
        fontFamily: 'Courier',
        marginTop: 2,
    },
    refreshButton: {
        padding: 5,
    },
    refreshText: {
        color: '#3B82F6',
        fontSize: 10,
        fontFamily: 'Courier',
        fontWeight: 'bold',
    },
    quickActionsContainer: {
        backgroundColor: '#1F2937',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    quickAction: {
        backgroundColor: '#374151',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#4B5563',
    },
    quickActionText: {
        color: '#D1D5DB',
        fontSize: 12,
        fontFamily: 'Courier',
    },
    chatContent: {
        padding: 15,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '95%',
        padding: 12,
        borderRadius: 4,
        marginBottom: 10,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#3B82F6',
        maxWidth: '80%',
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#111827',
        borderWidth: 1,
        borderColor: '#374151',
        width: '100%',
    },
    userText: {
        color: '#F9FAFB',
        fontFamily: 'Courier',
        fontSize: 14,
    },
    prefix: {
        color: '#10B981',
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Courier',
        fontSize: 12,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginLeft: 15,
    },
    loadingText: {
        color: '#3B82F6',
        fontSize: 10,
        marginLeft: 10,
        fontFamily: 'Courier',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#1F2937',
        borderTopWidth: 1,
        borderTopColor: '#374151',
    },
    prompt: {
        color: '#10B981',
        fontSize: 16,
        marginRight: 8,
        fontFamily: 'Courier',
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        color: '#F9FAFB',
        fontFamily: 'Courier',
        fontSize: 13,
        minHeight: 36,
        maxHeight: 80,
    },
    sendButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 4,
        marginLeft: 8,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
        fontFamily: 'Courier',
    },
    reasoningContainer: {
        marginBottom: 10,
        backgroundColor: '#1F2937',
        borderRadius: 4,
        borderLeftWidth: 2,
        borderLeftColor: '#6B7280',
        overflow: 'hidden',
    },
    reasoningHeader: {
        padding: 8,
        backgroundColor: '#374151',
    },
    reasoningLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        fontFamily: 'Courier',
        fontWeight: 'bold',
    },
    reasoningContent: {
        padding: 8,
    },
    reasoningText: {
        color: '#9CA3AF',
        fontSize: 11,
        fontFamily: 'Courier',
        fontStyle: 'italic',
    },
});

export default ChatbotScreen;
