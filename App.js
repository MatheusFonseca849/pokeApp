import "react-native-gesture-handler";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import DrawerRoutes from "./src/navigation/DrawerRoutes";
import PokemonProvider from "./src/providers/PokemonContext";
import FilterProvider from "./src/providers/FilterContext";
import { FavoritesProvider } from "./src/providers/FavoritesContext";
import { ThemeProvider } from "./src/providers/ThemeContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
      {(theme) => (
          <PaperProvider theme={theme}>
            <FilterProvider>
              <FavoritesProvider>
                <PokemonProvider>
                  <NavigationContainer>
                    <DrawerRoutes />
                  </NavigationContainer>
                </PokemonProvider>
              </FavoritesProvider>
            </FilterProvider>
          </PaperProvider>
        )}  
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
