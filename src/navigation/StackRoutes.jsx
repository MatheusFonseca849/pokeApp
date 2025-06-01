import { createStackNavigator } from "@react-navigation/stack";
import PokemonDetailsScreen from "../screens/PokemonDetailsScreen";
import HomeScreen from "../screens/HomeScreen";
import FavoritesTabs from "../navigation/TabRoutes";
import ItemsScreen from "../screens/ItemsScreen";
import ItemDetailsScreen from "../screens/ItemDetailsScreen";
import TeamsScreen from "../screens/TeamsScreen";
import TeamDetailsScreen from "../screens/TeamDetailsScreen";

const HomeStack = createStackNavigator();
const FavoritesStack = createStackNavigator();
const ItemsStack = createStackNavigator();
const TeamsStack = createStackNavigator();

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
        component={FavoritesTabs}  // Replace FavoritesScreen with FavoritesTabs
        options={{ headerShown: false }}
      />
      <FavoritesStack.Screen
        name="PokemonDetails"
        component={PokemonDetailsScreen}
        options={{ headerShown: false }}
      />
      <FavoritesStack.Screen
        name="ItemDetails"
        component={ItemDetailsScreen}  // Add this to navigate to item details
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
      <ItemsStack.Screen
        name="ItemDetails"
        component={ItemDetailsScreen}
        options={{ headerShown: false }}
      />
    </ItemsStack.Navigator>
  );
};

export const TeamsStackScreen = () => {
  return (
    <TeamsStack.Navigator>
      <TeamsStack.Screen
        name="TeamsScreen"
        component={TeamsScreen}
        options={{ headerShown: false }}
      />
      <TeamsStack.Screen
        name="TeamDetails"
        component={TeamDetailsScreen}
        options={{ headerShown: false }}
      />
      <TeamsStack.Screen
        name="PokemonDetails"
        component={PokemonDetailsScreen}
        options={{ headerShown: false }}
      />
    </TeamsStack.Navigator>
  );
};
    