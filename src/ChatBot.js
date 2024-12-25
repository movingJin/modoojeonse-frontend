import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, Text, TouchableOpacity, Platform } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import io from 'socket.io-client';
import Config from "react-native-config";

const URL = Platform.OS === "web" ? process.env.CHATBOT_SERVER_URL: Config.CHATBOT_SERVER_URL;

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = io(URL); // Replace with your WebSocket server URL
  
  useEffect(() => {
    // Listen for server responses
    socket.on('server_response', (data) => {
      addMessage({ text: data.message, sender: 'server' });
    });

    return () => {
      socket.disconnect(); // Cleanup connection when component unmounts
    };
  }, []);

  const addMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const sendMessage = () => {
    if (message.trim().length > 0) {
      addMessage({ text: message, sender: 'user' });
      socket.emit('chat', message);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.message, isUser ? styles.userMessage : styles.serverMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlashList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={100}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow:1,
    padding:16,
    height: (Platform.OS === 'web')? 800: undefined,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  serverMessage: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ChatBot;
