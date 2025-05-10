import { StyleSheet, View, FlatList } from "react-native";
import React, { useContext, useEffect } from "react";
import { Searchbar } from "react-native-paper";
import GestureRecognizer from "react-native-swipe-gestures";
import { PokemonContext } from "../providers/PokemonContext";
import PokeCard from "../components/PokeCard";
import PaginationButton from "../components/PaginationButton";

export default function HomeScreen() {
  const {
    pokeList,
    previous,
    next,
    searchText,
    loadPokemon,
    loadAllPokemon,
    searchPokemon,
    handleNext,
    handlePrevious,
    onSwipeLeft,
    onSwipeRight,
    swipeConfig,
  } = useContext(PokemonContext);

  useEffect(() => {
    loadPokemon();
    loadAllPokemon();
  }, []);

  return (
    <GestureRecognizer
      style={styles.container}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={swipeConfig}
    >
      <Searchbar
        placeholder="Search Pokemon"
        onChangeText={searchPokemon}
        value={searchText}
      />
      <FlatList
        style={styles.list}
        data={pokeList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          return <PokeCard item={item} />;
        }}
      />
      {searchText == "" && (
        <View style={styles.buttonContainer}>
          {previous && (
            <PaginationButton action={handlePrevious}>
              Previous
            </PaginationButton>
          )}
          {next && (
            <PaginationButton action={handleNext}>Next</PaginationButton>
          )}
        </View>
      )}
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 32,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  itemContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 62,
  },
});