import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { ErrorSuggestionProvider } from './contexts/ErrorSuggestionContext';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen'; // 1. 導入 ChatScreen
import SuggestionScreen from './SuggestionScreen';
import RatingScreen from './RatingScreen';
import AccountScreen from './AccountScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="SuggestionScreen" component={SuggestionScreen} />
          <Stack.Screen name="RatingScreen" component={RatingScreen} />
          <Stack.Screen name="Account" component={AccountScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;