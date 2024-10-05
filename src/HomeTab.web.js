import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Map from './Map.web'
import News from './News'

const Tab = createMaterialTopTabNavigator();

const HomeTabWeb = () => {
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
        </Tab.Navigator>
    );
};

export default HomeTabWeb;