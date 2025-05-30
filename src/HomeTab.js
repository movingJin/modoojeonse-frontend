import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Map from './maps/Map'
import News from './News'
import ChatBot from './ChatBot';

const isWeb = Platform.OS === 'web';
const Tab = isWeb ? createMaterialTopTabNavigator() : createBottomTabNavigator();

const HomeTab = () => {
    return (
        <Tab.Navigator screenOptions={{ 
            headerShown: false,
            ...(isWeb && { swipeEnabled: false }), // Only apply on web
        }}>
            <Tab.Screen
                name='Map'
                component={Map}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Icon name="map" color={color} size={size} />
                      )
                }}
                />
            <Tab.Screen
                name='News'
                component={News}
                initialParams={{title: "Real Estate News"}}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Icon name="newspaper" color={color} size={size} />
                      )
                }}
                />
            <Tab.Screen
                name='ChatBot'
                component={ChatBot}
                initialParams={{title: "ChatBot"}}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Icon name="article" color={color} size={size} />
                      )
                }}
                />
            {/* <Tab.Screen name='Settings' component={Settings} /> */}
        </Tab.Navigator>
    );
};

export default HomeTab;