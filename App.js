import "react-native-gesture-handler";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import DrawerRoutes from "./src/navigation/DrawerRoutes";
import PokemonProvider from "./src/providers/PokemonContext";
import { theme } from "./src/themes/themes";
import FilterProvider from "./src/providers/FilterContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FilterProvider>
        <PokemonProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <DrawerRoutes />
            </NavigationContainer>
          </PaperProvider>
        </PokemonProvider>
      </FilterProvider>
    </GestureHandlerRootView>
  );
}
