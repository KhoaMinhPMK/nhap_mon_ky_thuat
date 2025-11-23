import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleLogin = () => {
        if (login(username, password)) {
            // Success handled by context state change
        } else {
            Alert.alert('ACCESS DENIED', 'Invalid credentials.');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0B1021', '#1B2735', '#090c14']}
                style={styles.background}
            />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>SECURE</Text>
                        <Text style={styles.logoText}>ACCESS</Text>
                    </View>
                    <View style={styles.line} />
                    <Text style={styles.subtitle}>SYSTEM AUTHENTICATION</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>USERNAME</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="ENTER ID"
                        placeholderTextColor="#4B5563"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>PASSWORD</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="ENTER PASSCODE"
                        placeholderTextColor="#4B5563"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <LinearGradient
                            colors={['#1F2937', '#111827']}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>AUTHENTICATE</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoBox: {
        borderWidth: 2,
        borderColor: '#3B82F6',
        padding: 15,
        marginBottom: 15,
    },
    logoText: {
        color: '#F9FAFB',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 4,
        fontFamily: 'Courier',
        textAlign: 'center',
    },
    line: {
        width: 100,
        height: 2,
        backgroundColor: '#3B82F6',
        marginBottom: 10,
    },
    subtitle: {
        color: '#9CA3AF',
        fontSize: 12,
        letterSpacing: 2,
        fontFamily: 'Courier',
    },
    form: {
        width: '100%',
    },
    label: {
        color: '#3B82F6',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'Courier',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        borderWidth: 1,
        borderColor: '#374151',
        color: '#F9FAFB',
        padding: 15,
        borderRadius: 4,
        marginBottom: 20,
        fontFamily: 'Courier',
        fontSize: 16,
    },
    button: {
        marginTop: 10,
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    buttonGradient: {
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#3B82F6',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 2,
        fontFamily: 'Courier',
    },
});

export default LoginScreen;
