import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Map from './Map'
import News from './News'

const Tab = createBottomTabNavigator();

const HomeTab = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
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
                name='Gpt Article'
                component={News}
                initialParams={{title: "GPT article"}}
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