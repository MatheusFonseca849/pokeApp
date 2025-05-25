import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import FavoritesScreen from "../screens/FavoritesScreen";
import FavoriteItemsScreen from "../screens/FavoriteItemsScreen";
import { useContext } from "react";
import { ThemeContext } from "../providers/ThemeContext";

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: theme.colors.surface },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'FavoritePokemon') {
            iconName = 'heart';
          } else if (route.name === 'FavoriteItems') {
            iconName = 'briefcase';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4264a8',
        tabBarInactiveTintColor: 'gray',
      })}
    >
          <Tab.Screen 
        name="FavoritePokemon" 
        component={FavoritesScreen}
        options={{ 
          title: "Favorite Pokémon",
          headerShown: false 
        }}
      />
      <Tab.Screen 
        name="FavoriteItems" 
        component={FavoriteItemsScreen}
        options={{ 
          title: "Favorite Items",
          headerShown: false 
        }}
      />  
        </Tab.Navigator>
    )
}

export default TabRoutes
