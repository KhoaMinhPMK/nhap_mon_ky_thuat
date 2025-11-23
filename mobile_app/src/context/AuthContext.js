import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    const login = (username, password) => {
        if (username === 'admin' && password === '1234') {
            setUser({ username: 'admin' });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setDeviceId(null);
    };

    const connectToDevice = (id) => {
        // In a real app, verify ID with API here
        if (id && id.length > 0) {
            setDeviceId(id);
            return true;
        }
        return false;
    };

    const disconnect = () => {
        setDeviceId(null);
    };

    return (
        <AuthContext.Provider value={{ user, deviceId, login, logout, connectToDevice, disconnect }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
