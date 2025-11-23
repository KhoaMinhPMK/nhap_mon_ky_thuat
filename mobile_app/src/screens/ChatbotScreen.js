import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Markdown from 'react-native-markdown-display';
import { getStats } from '../api/client';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const ChatbotScreen = ({ onBack }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "SYSTEM READY. WAITING FOR COMMAND.", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef(null);

    // Context Data
    const [systemStats, setSystemStats] = useState(null);

    useEffect(() => {
        // Fetch stats on mount to provide context
        const fetchContext = async () => {
            const data = await getStats();
            setSystemStats(data);
        };
        fetchContext();
    }, []);

    const sendMessage = async () => {
        if (inputText.trim() === '') return;

        const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Construct System Context
            let contextString = "Current System Status: ";
            if (systemStats) {
                contextString += `Date: ${systemStats.date}, Total Processed: ${systemStats.total}. `;
                if (systemStats.breakdown) {
                    contextString += "Breakdown: " + systemStats.breakdown.map(b => `${b.class_name}: ${b.count}`).join(', ') + ".";
                }
            } else {
                contextString += "Data unavailable.";
            }

            const apiMessages = [
                { role: "system", content: `You are a tactical warehouse AI. Speak concisely, professionally, and use technical terminology. Use Markdown for formatting (bold, lists, tables). Do not use emojis. Focus on efficiency. \n\nCONTEXT: ${contextString}` },
                ...messages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
                { role: "user", content: inputText }
            ];

            const response = await axios.post(GROQ_API_URL, {
                model: "openai/gpt-oss-120b",
                messages: apiMessages,
                temperature: 0.5,
                max_tokens: 1024
            }, {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const botReply = response.data.choices[0].message.content;
            const botMessage = { id: Date.now() + 1, text: botReply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Groq API Error:", error);
            const errorMessage = { id: Date.now() + 1, text: "ERROR: CONNECTION LOST.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const renderItem = ({ item }) => (
        <View style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userBubble : styles.botBubble
        ]}>
            {item.sender === 'bot' ? (
                <View>
                    <Text style={styles.prefix}>AI:</Text>
                    <Markdown style={markdownStyles}>
                        {item.text}
                    </Markdown>
                </View>
            ) : (
                <Text style={styles.userText}>{item.text}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backText}>{'< EXIT'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI TERMINAL</Text>
                <View style={{ width: 50 }} />
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
                        <Text style={styles.loadingText}>PROCESSING...</Text>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <Text style={styles.prompt}>{'>'}</Text>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="ENTER COMMAND..."
                        placeholderTextColor="#4B5563"
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={styles.sendButtonText}>SEND</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const markdownStyles = StyleSheet.create({
    body: { color: '#D1D5DB', fontFamily: 'Courier', fontSize: 14 },
    heading1: { color: '#F9FAFB', fontWeight: 'bold' },
    strong: { color: '#F9FAFB', fontWeight: 'bold' },
    code_inline: { backgroundColor: '#374151', color: '#F9FAFB' },
    fence: { backgroundColor: '#1F2937', color: '#F9FAFB' },
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
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#1F2937',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    backButton: {
        padding: 5,
    },
    backText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontFamily: 'Courier',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F9FAFB',
        letterSpacing: 2,
        fontFamily: 'Courier',
    },
    chatContent: {
        padding: 20,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '90%',
        padding: 12,
        borderRadius: 4,
        marginBottom: 10,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#111827',
        borderWidth: 1,
        borderColor: '#374151',
        width: '100%', // Full width for tables/markdown
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
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginLeft: 20,
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
        padding: 15,
        backgroundColor: '#1F2937',
        borderTopWidth: 1,
        borderTopColor: '#374151',
    },
    prompt: {
        color: '#10B981',
        fontSize: 18,
        marginRight: 10,
        fontFamily: 'Courier',
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        color: '#F9FAFB',
        fontFamily: 'Courier',
        fontSize: 14,
        height: 40,
    },
    sendButton: {
        backgroundColor: '#374151',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#4B5563',
    },
    sendButtonText: {
        color: '#F9FAFB',
        fontWeight: 'bold',
        fontSize: 10,
        fontFamily: 'Courier',
    },
});

export default ChatbotScreen;
