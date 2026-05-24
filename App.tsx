import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#D4AF37',
          headerTitleStyle: { fontWeight: 'bold', color: '#D4AF37' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Controle seus Gastos' }} 
        />
        <Stack.Screen 
          name="AddExpense" 
          component={AddExpenseScreen} 
          options={{ title: 'Novo Gasto' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}