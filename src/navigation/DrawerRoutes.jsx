import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons } from "@expo/vector-icons";
import { FavoritesStackScreen, HomeStackScreen, ItemsStackScreen, TeamsStackScreen } from './StackRoutes';
import { useContext } from 'react';
import { ThemeContext } from '../providers/ThemeContext';
import { IconButton } from 'react-native-paper';

const Drawer = createDrawerNavigator()

export default function DrawerRoutes() {
  const { theme } = useContext(ThemeContext);
  return (
    <Drawer.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.onSurface,
      drawerStyle: {
        backgroundColor: theme.colors.background,
      },
      drawerActiveTintColor: theme.colors.primary,
      drawerInactiveTintColor: theme.colors.onSurface,
    }}
    >
      <Drawer.Screen
    name="Home"
    component={HomeStackScreen}
    options={({ navigation }) => {
      const { toggleTheme, isDarkMode } = useContext(ThemeContext);

      return {
        title: "Início",
        drawerIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
        headerRight: () => (
          <IconButton
            icon={isDarkMode ? "white-balance-sunny" : "moon-waxing-crescent"}
            size={24}
            onPress={toggleTheme}
            accessibilityLabel="Toggle dark/light mode"
          />
        ),
      };
    }}
  />
      <Drawer.Screen
      name='Favorites'
      component={FavoritesStackScreen}
      options={({ navigation }) => {
        const { toggleTheme, isDarkMode } = useContext(ThemeContext);

        return {
          headerTitle: "Favoritos",
          drawerIcon: (color, size) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
          headerRight: () => (
            <IconButton
              icon={isDarkMode ? "white-balance-sunny" : "moon-waxing-crescent"}
              size={24}
              onPress={toggleTheme}
              accessibilityLabel="Toggle dark/light mode"
            />
          ),
        };
      }}
      />
      <Drawer.Screen
      name='Items'
      component={ItemsStackScreen}
      options={({ navigation }) => {
        const { toggleTheme, isDarkMode } = useContext(ThemeContext);

        return {
          headerTitle: "Itens",
          drawerIcon: (color, size) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
          headerRight: () => (
            <IconButton
              icon={isDarkMode ? "white-balance-sunny" : "moon-waxing-crescent"}
              size={24}
              onPress={toggleTheme}
              accessibilityLabel="Toggle dark/light mode"
            />
          ),
        };
      }}
      />
      <Drawer.Screen
      name='Teams'
      component={TeamsStackScreen}
      options={({ navigation }) => {
        const { toggleTheme, isDarkMode } = useContext(ThemeContext);

        return {
          headerTitle: "Times",
          drawerIcon: (color, size) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
          headerRight: () => (
            <IconButton
              icon={isDarkMode ? "white-balance-sunny" : "moon-waxing-crescent"}
              size={24}
              onPress={toggleTheme}
              accessibilityLabel="Toggle dark/light mode"
            />
          ),
        };
      }}
      />
    </Drawer.Navigator>
  )
}
