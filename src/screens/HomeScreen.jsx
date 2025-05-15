import { StyleSheet, View, FlatList, Animated, Easing } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { IconButton, Searchbar, List } from "react-native-paper";
import GestureRecognizer from "react-native-swipe-gestures";
import { PokemonContext } from "../providers/PokemonContext";
import PokeCard from "../components/PokeCard";
import PaginationButton from "../components/PaginationButton";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const baseUrl = "https://pokeapi.co/api/v2/";
  const [contentHeight, setContentHeight] = useState(0);
  const [pokeTypes, setPokeTypes] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const {
    pokeList,
    setPokeList,
    isFiltering,
    setIsFiltering,
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

  useEffect(() => {
    if (filtersVisible) {
      getPokeTypes();
    }
  }, [filtersVisible]);

  useEffect(() => {
    if (filtersVisible) {
      Animated.timing(animatedHeight, {
        toValue: contentHeight,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  }, [contentHeight]);

  const getPokeTypes = async () => {
    axios.get(`${baseUrl}type`).then((response) => {
      setPokeTypes(response.data.results);
    });
  };

  const getPokemonByType = async (type) => {
    try {
      const response = await axios.get(`${baseUrl}type/${type}`);
      const pokemonList = response.data.pokemon.map((p) => p.pokemon);
      setPokeList(pokemonList);
      setIsFiltering(true);
    } catch (error) {
      console.error("Erro ao buscar Pokémon por tipo:", error);
    }
  };
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
        toValue: contentHeight,
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
      <SafeAreaView
        style={styles.container}
        edges={["bottom", "left", "right"]}
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
              <View
                onLayout={(event) => {
                  const { height } = event.nativeEvent.layout;
                  setContentHeight(height);
                }}
              >
                <IconButton
                  icon="close"
                  onPress={() => {
                    setIsFiltering(false);
                    loadPokemon(); // volta para a listagem padrão
                  }}
                />
                <List.Section>
                  <List.Accordion
                    title="Filter by Type"
                    left={(props) => <List.Icon {...props} icon="shape" />}
                  >
                    {pokeTypes.map((type) => (
                      <List.Item
                        title={
                          type.name.charAt(0).toUpperCase() + type.name.slice(1)
                        }
                        key={type.name}
                        onPress={() => getPokemonByType(type.name)}
                      />
                    ))}
                  </List.Accordion>
                  <List.Accordion
                    title="Filter by Generation"
                    left={(props) => <List.Icon {...props} icon="history" />}
                  >
                    <List.Item
                      title="Gen 1"
                      onPress={() => console.log("Gen 1")}
                    />
                    <List.Item
                      title="Gen 2"
                      onPress={() => console.log("Gen 2")}
                    />
                  </List.Accordion>
                </List.Section>
              </View>
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
        {searchText == "" && !isFiltering && (
          <View style={styles.buttonContainer}>
            {previous && (
              <PaginationButton action={handlePrevious} icon={"chevron-left"} />
            )}
            {next && (
              <PaginationButton action={handleNext} icon={"chevron-right"} />
            )}
          </View>
        )}
      </SafeAreaView>
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
  },
});
