import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { getLogs } from '../api/client';
import ImageView from "react-native-image-viewing";
import { triggerHaptic } from '../utils/haptics';

const HistoryScreen = () => {
    const [logs, setLogs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Image Viewer State
    const [visible, setIsVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);

    const loadLogs = async () => {
        const data = await getLogs();
        setLogs(data);

        // Prepare images for viewer
        const validImages = data
            .filter(item => item.image_url)
            .map(item => ({ uri: item.image_url }));
        setImages(validImages);
    };

    const onRefresh = async () => {
        triggerHaptic('medium');
        setRefreshing(true);
        await loadLogs();
        setRefreshing(false);
        triggerHaptic('success');
    };

    useEffect(() => {
        loadLogs();
    }, []);

    const openImage = (url) => {
        triggerHaptic('light');
        const index = images.findIndex(img => img.uri === url);
        if (index >= 0) {
            setCurrentImageIndex(index);
            setIsVisible(true);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.logRow}>
            {/* Image Thumbnail */}
            <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => item.image_url && openImage(item.image_url)}
            >
                {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>N/A</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Data Columns */}
            <View style={styles.dataContainer}>
                <View style={styles.rowHeader}>
                    <Text style={[styles.classBadge, { color: getColorForClass(item.class_name) }]}>
                        [{item.class_name.toUpperCase()}]
                    </Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>

                <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>CONF:</Text>
                        <Text style={styles.metricValue}>{(item.confidence * 100).toFixed(1)}%</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>ID:</Text>
                        <Text style={styles.metricValue}>{item.device_id}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>DATA LOGS</Text>
                <View style={styles.headerBorder} />
            </View>
            <FlatList
                data={logs}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />}
            />

            <ImageView
                images={images}
                imageIndex={currentImageIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
        </View>
    );
};

const getColorForClass = (className) => {
    if (className.includes('1')) return '#10B981';
    if (className.includes('2')) return '#F59E0B';
    return '#EF4444';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    header: {
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#1F2937',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F9FAFB',
        fontFamily: 'Courier',
        letterSpacing: 1,
    },
    headerBorder: {
        height: 2,
        width: 40,
        backgroundColor: '#3B82F6',
        marginTop: 5,
    },
    listContent: {
        padding: 0,
        paddingBottom: 100,
    },
    logRow: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        backgroundColor: '#111827',
    },
    imageContainer: {
        width: 60,
        height: 60,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#4B5563',
        backgroundColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2937',
    },
    placeholderText: {
        color: '#6B7280',
        fontSize: 10,
    },
    dataContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    rowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    classBadge: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Courier',
    },
    timestamp: {
        color: '#6B7280',
        fontSize: 12,
        fontFamily: 'Courier',
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 20,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metricLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        marginRight: 5,
        fontFamily: 'Courier',
    },
    metricValue: {
        color: '#F9FAFB',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Courier',
    },
});

export default HistoryScreen;
