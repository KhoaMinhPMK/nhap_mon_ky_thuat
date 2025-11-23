import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import DashboardScreen from './src/screens/DashboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import LoginScreen from './src/screens/LoginScreen';
import ConnectScreen from './src/screens/ConnectScreen';
import NetworkStatus from './src/components/NetworkStatus';
import { triggerHaptic } from './src/utils/haptics';

const MainApp = () => {
  const { user, deviceId } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabPress = (tab) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  // 1. Check Login
  if (!user) {
    return <LoginScreen />;
  }

  // 2. Check Connection
  if (!deviceId) {
    return <ConnectScreen />;
  }

  // 3. Main App Content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardScreen />;
      case 'history': return <HistoryScreen />;
      case 'chatbot': return <ChatbotScreen onBack={() => handleTabPress('dashboard')} />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <NetworkStatus />

      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Floating Tab Bar - Hidden when in Chatbot */}
      {activeTab !== 'chatbot' && (
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TabButton
              title="STATUS"
              active={activeTab === 'dashboard'}
              onPress={() => handleTabPress('dashboard')}
            />
            <TabButton
              title="LOGS"
              active={activeTab === 'history'}
              onPress={() => handleTabPress('history')}
            />
            <TabButton
              title="AI ASSIST"
              active={activeTab === 'chatbot'}
              onPress={() => handleTabPress('chatbot')}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity style={[styles.tabItem, active && styles.activeTabItem]} onPress={onPress}>
    <Text style={[styles.tabText, active && styles.activeTabText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 4,
  },
  activeTabItem: {
    backgroundColor: '#374151',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'Courier',
  },
  activeTabText: {
    color: '#F9FAFB',
  },
});
