import { createStackNavigator } from "@react-navigation/stack";
import PokemonDetailsScreen from "../screens/PokemonDetailsScreen";
import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import ItemsScreen from "../screens/ItemsScreen";

const HomeStack = createStackNavigator();
const FavoritesStack = createStackNavigator();
const ItemsStack = createStackNavigator();

export const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="PokemonDetails"
        component={PokemonDetailsScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
};

export const FavoritesStackScreen = () => {
  return (
    <FavoritesStack.Navigator>
      <FavoritesStack.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <FavoritesStack.Screen
        name="PokemonDetails"
        component={PokemonDetailsScreen}
        options={{ headerShown: false }}
      />
    </FavoritesStack.Navigator>
  );
};

export const ItemsStackScreen = () => {
  return (
    <ItemsStack.Navigator>
      <ItemsStack.Screen
        name="ItemsScreen"
        component={ItemsScreen}
        options={{ headerShown: false }}
      />
    </ItemsStack.Navigator>
  );
};
    