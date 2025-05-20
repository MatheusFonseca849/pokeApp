import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import FavoritesScreen from "../screens/FavoritesScreen";
import FavoriteItemsScreen from "../screens/FavoriteItemsScreen";

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
    return (
        <Tab.Navigator
      screenOptions={({ route }) => ({
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
