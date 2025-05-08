import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeScreen from '../screens/HomeScreen'
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator()

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
      name='Home'
      component={HomeScreen}
      options={{
          title: "Início",
          drawerIcon: (color, size) => (
            <Ionicons name="home" color={"#4264a8"} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({})