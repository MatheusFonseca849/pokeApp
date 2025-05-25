import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useContext, useEffect } from "react";
import { PokemonContext } from "../providers/PokemonContext";
import { FlatList } from "react-native-gesture-handler";
import PokeCard from "../components/PokeCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../providers/ThemeContext";

const FavoritesScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { favoriteArray, loadFavoritePokemon, favoritePokemon, loading } =
    useContext(PokemonContext);

  useEffect(() => {
    loadFavoritePokemon();
  }, [favoriteArray]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom', 'left', 'right']}>
      <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}>

        {loading ? (
          <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ color: theme.colors.onBackground }}>Carregando favoritos</Text>
          </View>
        ) : favoritePokemon.length > 0 ? (
          <FlatList
            data={favoritePokemon}
            keyExtractor={(item) => item.url.slice(34, -1)}
            renderItem={({ item }) => <PokeCard item={item} />}
          />
        ) : (
          <Text style={{ color: theme.colors.onBackground }}>Você ainda não adicionou nenhum favorito!</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default FavoritesScreen;
