import { StyleSheet, View, FlatList, Animated, Easing } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { IconButton, Searchbar, List } from "react-native-paper";
import GestureRecognizer from "react-native-swipe-gestures";
import { PokemonContext } from "../providers/PokemonContext";
import PokeCard from "../components/PokeCard";
import PaginationButton from "../components/PaginationButton";
import { ScrollView } from "react-native-gesture-handler";

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

  const [filtersVisible, setFiltersVisible] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleFilters = () => {
    if (filtersVisible) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => setFiltersVisible(false));
    } else {
      setFiltersVisible(true);
      Animated.timing(animatedHeight, {
        toValue: 360, // Adjust based on your content
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <GestureRecognizer
      style={styles.container}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={swipeConfig}
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search Pokemon"
          onChangeText={searchPokemon}
          value={searchText}
          style={styles.searchBar}
        />
        <IconButton
          mode="contained"
          style={styles.button}
          icon="filter"
          onPress={toggleFilters}
        />
      </View>
      <Animated.View
        style={[styles.animatedContainer, { height: animatedHeight }]}
      >
        {filtersVisible && (
          <ScrollView>
          <List.Section>
            <List.Accordion
              title="Filter by Type"
              left={(props) => <List.Icon {...props} icon="shape" />}
            >
              <List.Item title="Fire" onPress={() => console.log("Fire")} />
              <List.Item title="Water" onPress={() => console.log("Water")} />
              <List.Item title="Grass" onPress={() => console.log("Grass")} />
              <List.Item title="Electric" onPress={() => console.log("Electric")} />
              <List.Item title="Normal" onPress={() => console.log("Normal")} />
              <List.Item title="Ice" onPress={() => console.log("Ice")} />
              <List.Item title="Fighting" onPress={() => console.log("Fighting")} />
              <List.Item title="Poison" onPress={() => console.log("Poison")} />
              <List.Item title="Ground" onPress={() => console.log("Ground")} />
              <List.Item title="Flying" onPress={() => console.log("Flying")} />
              <List.Item title="Psychic" onPress={() => console.log("Psychic")} />
              <List.Item title="Bug" onPress={() => console.log("Bug")} />
              <List.Item title="Rock" onPress={() => console.log("Rock")} />
              <List.Item title="Ghost" onPress={() => console.log("Ghost")} />
              <List.Item title="Dragon" onPress={() => console.log("Dragon")} />
              <List.Item title="Dark" onPress={() => console.log("Dark")} />
              <List.Item title="Steel" onPress={() => console.log("Steel")} />
              <List.Item title="Fairy" onPress={() => console.log("Fairy")} />
            </List.Accordion>
            <List.Accordion
              title="Filter by Generation"
              left={(props) => <List.Icon {...props} icon="history" />}
            >
              <List.Item title="Gen 1" onPress={() => console.log("Gen 1")} />
              <List.Item title="Gen 2" onPress={() => console.log("Gen 2")} />
            </List.Accordion>
          </List.Section>
          </ScrollView>
        )}
      </Animated.View>
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
            <PaginationButton action={handlePrevious} icon={"chevron-left"} />
          )}
          {next && (
            <PaginationButton action={handleNext} icon={"chevron-right"} />
          )}
        </View>
      )}
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 5,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },

  animatedContainer: {
    overflow: "hidden",
    paddingHorizontal: 12,
    backgroundColor: "#fff", // optional, match your theme
  },

  searchBar: {
    flex: 1,
    height: 40,
    marginVertical: 0,
  },

  button: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginLeft: 0,
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
