import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screen/Home';
import ArticleDetailPage from './src/screen/ArticleDetailPage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Ẩn header của màn hình
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ArticleDetailPage" component={ArticleDetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
