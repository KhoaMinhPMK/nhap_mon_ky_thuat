import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkStatus = () => {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    if (isConnected) return null; // Hide if connected

    return (
        <View style={styles.container}>
            <Text style={styles.text}>⚠ NETWORK DISCONNECTED - OFFLINE MODE</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EF4444',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: 'Courier',
        letterSpacing: 1,
    },
});

export default NetworkStatus;
