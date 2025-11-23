import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ConnectScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const { connectToDevice, logout } = useAuth();

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        if (connectToDevice(data)) {
            Alert.alert('LINK ESTABLISHED', `Connected to device: ${data}`);
        } else {
            Alert.alert('ERROR', 'Invalid Device ID');
            setScanned(false);
        }
    };

    const handleManualConnect = () => {
        if (connectToDevice(manualCode)) {
            // Success
        } else {
            Alert.alert('ERROR', 'Invalid Device ID');
        }
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text style={styles.text}>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text style={styles.text}>No access to camera</Text></View>;
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0B1021', '#1B2735', '#090c14']}
                style={styles.background}
            />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>ESTABLISH LINK</Text>
                <TouchableOpacity onPress={logout}>
                    <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.cameraContainer}>
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "pdf417"],
                    }}
                    style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.overlay}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.scanText}>ALIGN QR CODE</Text>
                </View>
            </View>

            <View style={styles.manualContainer}>
                <Text style={styles.label}>MANUAL OVERRIDE</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={manualCode}
                        onChangeText={setManualCode}
                        placeholder="DEVICE ID"
                        placeholderTextColor="#4B5563"
                    />
                    <TouchableOpacity style={styles.connectButton} onPress={handleManualConnect}>
                        <Text style={styles.connectButtonText}>CONNECT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1021',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 50,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#F9FAFB',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Courier',
        letterSpacing: 2,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Courier',
    },
    cameraContainer: {
        height: width, // Square
        width: width,
        overflow: 'hidden',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#374151',
        position: 'relative',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#10B981',
        backgroundColor: 'transparent',
    },
    scanText: {
        color: '#10B981',
        marginTop: 10,
        fontFamily: 'Courier',
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 4,
    },
    manualContainer: {
        padding: 20,
        marginTop: 20,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 12,
        marginBottom: 10,
        fontFamily: 'Courier',
        letterSpacing: 1,
    },
    inputRow: {
        flexDirection: 'row',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        borderWidth: 1,
        borderColor: '#374151',
        color: '#F9FAFB',
        padding: 15,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        fontFamily: 'Courier',
        fontSize: 16,
    },
    connectButton: {
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    connectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Courier',
    },
});

export default ConnectScreen;
