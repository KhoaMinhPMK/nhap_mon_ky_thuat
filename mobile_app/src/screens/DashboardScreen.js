import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { getStats } from '../api/client';
import { LineChart } from 'react-native-chart-kit';
import { triggerHaptic } from '../utils/haptics';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
    const [stats, setStats] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadStats = async () => {
        const data = await getStats();
        setStats(data);
    };

    const onRefresh = async () => {
        triggerHaptic('medium');
        setRefreshing(true);
        await loadStats();
        setRefreshing(false);
        triggerHaptic('success');
    };

    useEffect(() => {
        loadStats();
    }, []);

    // Mock Data for Chart (since API doesn't provide hourly yet)
    const chartData = {
        labels: ["08:00", "09:00", "10:00", "11:00", "12:00"],
        datasets: [
            {
                data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                ]
            }
        ]
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />}
            >
                {/* Header */}
                <View style={styles.headerBlock}>
                    <Text style={styles.headerTitle}>COMMAND CENTER</Text>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>SYSTEM ONLINE</Text>
                    </View>
                </View>

                <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>DATE:</Text>
                    <Text style={styles.metaValue}>{stats?.date || 'SYNCING...'}</Text>
                </View>

                {/* Main Metric */}
                <View style={styles.mainMetricBox}>
                    <Text style={styles.mainMetricLabel}>TOTAL UNITS PROCESSED</Text>
                    <Text style={styles.mainMetricValue}>{stats?.total || 0}</Text>
                    <View style={styles.cornerTL} />
                    <View style={styles.cornerTR} />
                    <View style={styles.cornerBL} />
                    <View style={styles.cornerBR} />
                </View>

                {/* Performance Chart */}
                <Text style={styles.sectionHeader}>// PERFORMANCE TREND (UNITS/HR)</Text>
                <View style={styles.chartContainer}>
                    <LineChart
                        data={chartData}
                        width={width - 40}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: "#1F2937",
                            backgroundGradientFrom: "#1F2937",
                            backgroundGradientTo: "#1F2937",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green
                            labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "4",
                                strokeWidth: "2",
                                stroke: "#10B981"
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 4
                        }}
                    />
                </View>

                {/* Breakdown Grid */}
                <Text style={styles.sectionHeader}>// CLASSIFICATION BREAKDOWN</Text>
                <View style={styles.gridContainer}>
                    {stats?.breakdown?.map((item, index) => (
                        <View key={index} style={styles.gridItem}>
                            <View style={[styles.colorStrip, { backgroundColor: getColorForClass(item.class_name) }]} />
                            <View style={styles.gridContent}>
                                <Text style={styles.gridLabel}>{item.class_name}</Text>
                                <Text style={styles.gridValue}>{item.count}</Text>
                                <View style={styles.progressBarBg}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            {
                                                width: `${(item.count / (stats.total || 1)) * 100}%`,
                                                backgroundColor: getColorForClass(item.class_name)
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const getColorForClass = (className) => {
    if (className.includes('1')) return '#10B981'; // Success Green
    if (className.includes('2')) return '#F59E0B'; // Warning Amber
    return '#EF4444'; // Alert Red
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827', // Matte Gunmetal
    },
    scrollContent: {
        padding: 20,
        paddingTop: 40,
        paddingBottom: 100, // Space for tab bar
    },
    headerBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#374151',
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#F9FAFB',
        letterSpacing: 1,
        fontFamily: 'Courier',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#10B981',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    statusText: {
        color: '#10B981',
        fontSize: 10,
        fontWeight: 'bold',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    metaLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        marginRight: 5,
        fontFamily: 'Courier',
    },
    metaValue: {
        color: '#F9FAFB',
        fontSize: 12,
        fontFamily: 'Courier',
        fontWeight: 'bold',
    },
    mainMetricBox: {
        backgroundColor: '#1F2937',
        padding: 30,
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#374151',
        position: 'relative',
    },
    mainMetricLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        letterSpacing: 2,
        marginBottom: 10,
        fontFamily: 'Courier',
    },
    mainMetricValue: {
        color: '#F9FAFB',
        fontSize: 56,
        fontWeight: 'bold',
        fontFamily: 'Courier',
    },
    // Tactical Corners
    cornerTL: { position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#3B82F6' },
    cornerTR: { position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#3B82F6' },
    cornerBL: { position: 'absolute', bottom: -1, left: -1, width: 10, height: 10, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#3B82F6' },
    cornerBR: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#3B82F6' },

    sectionHeader: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15,
        fontFamily: 'Courier',
    },
    chartContainer: {
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#1F2937',
    },
    gridContainer: {
        gap: 15,
    },
    gridItem: {
        flexDirection: 'row',
        backgroundColor: '#1F2937',
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#374151',
    },
    colorStrip: {
        width: 6,
    },
    gridContent: {
        flex: 1,
        padding: 15,
    },
    gridLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Courier',
    },
    gridValue: {
        color: '#F9FAFB',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Courier',
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#374151',
        width: '100%',
    },
    progressBarFill: {
        height: '100%',
    },
});

export default DashboardScreen;
