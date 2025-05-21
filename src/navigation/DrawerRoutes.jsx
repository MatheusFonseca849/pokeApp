import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons } from "@expo/vector-icons";
import { FavoritesStackScreen, HomeStackScreen, ItemsStackScreen, TeamsStackScreen } from './StackRoutes';

const Drawer = createDrawerNavigator()

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
      name='Home'
      component={HomeStackScreen}
      options={{
          title: "Início",
          drawerIcon: (color, size) => (
            <Ionicons name="home" color={"#4264a8"} size={size} />
          ),
        }}
      />
      <Drawer.Screen
      name='Favorites'
      component={FavoritesStackScreen}
      options={{
          headerTitle: "Favoritos",
          drawerIcon: (color, size) => (
            <Ionicons name="heart" color={"#4264a8"} size={size} />
          ),
        }}
      />
      <Drawer.Screen
      name='Items'
      component={ItemsStackScreen}
      options={{
          headerTitle: "Itens",
          drawerIcon: (color, size) => (
            <Ionicons name="heart" color={"#4264a8"} size={size} />
          ),
        }}
      />
      <Drawer.Screen
      name='Teams'
      component={TeamsStackScreen}
      options={{
          headerTitle: "Times",
          drawerIcon: (color, size) => (
            <Ionicons name="heart" color={"#4264a8"} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  )
}
