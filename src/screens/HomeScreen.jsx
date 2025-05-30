import { StyleSheet, View, FlatList, Animated, Easing } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { IconButton, Searchbar, List } from "react-native-paper";
import GestureRecognizer from "react-native-swipe-gestures";
import { PokemonContext } from "../providers/PokemonContext";
import PokeCard from "../components/PokeCard";
import PaginationButton from "../components/PaginationButton";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilterContext } from "../providers/FilterContext";
import { ThemeContext } from "../providers/ThemeContext";

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
  const [contentHeight, setContentHeight] = useState(0);

  const [filtersVisible, setFiltersVisible] = useState(false);

  const { 
    isFiltering, 
    pokeTypes, 
    selectedTypes,
    selectedGenerations,
    getPokeTypes,
    generations,
    getGenerations,
    toggleTypeSelection,
    toggleGenerationSelection,
    clearSelection
  } = useContext(FilterContext);

  const {
    pokeList,
    setPokeList,
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

  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPokemon();
    loadAllPokemon();
  }, []);

  useEffect(() => {
    if (filtersVisible && pokeTypes.length === 0) {
      getPokeTypes();
      getGenerations();
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
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={swipeConfig}
    >
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        edges={["bottom", "left", "right"]}
      >
        <View style={[styles.searchContainer, {backgroundColor: theme.colors.surface}]}>
          <Searchbar
            placeholder="Search Pokemon"
            onChangeText={searchPokemon}
            value={searchText}
            style={styles.searchBar}
          />
          <IconButton
            mode="contained"
            style={styles.button}
            icon={filtersVisible ? "filter" : "filter-outline"}
            onPress={toggleFilters}
          />
        </View>
        <Animated.View
          style={[styles.animatedContainer, { maxHeight: animatedHeight }]}
        >
          {filtersVisible && (
            <ScrollView>
              <View
                style={{ flexGrow: 1 }}
                onLayout={(event) => {
                  const { height } = event.nativeEvent.layout;
                  setContentHeight(height);
                }}
              >
                {(selectedTypes.length > 0 || selectedGenerations.length > 0) && (
                  <IconButton
                    icon="close-circle"
                    onPress={() => clearSelection(loadPokemon)}
                  />
                )}
                <List.Section>
                  <List.Accordion
                    title="Filtrar por Tipo"
                    left={(props) => <List.Icon {...props} icon="shape" />}
                    multiple  
                    
                  >
                    {pokeTypes.map((type) => (
                      <List.Item
                        title={
                          type.name.charAt(0).toUpperCase() + type.name.slice(1)
                        }
                        key={type.name}
                        onPress={() => toggleTypeSelection(type.name, setPokeList, loadPokemon)}
                        left={(props) => (
                          <List.Icon
                            {...props}
                            icon={
                              selectedTypes.includes(type.name)
                                ? "check-circle"
                                : "checkbox-blank-circle-outline"
                            }
                            color={
                              selectedTypes.includes(type.name)
                                ? "#007aff"
                                : undefined
                            }
                          />
                        )}
                      />
                    ))}
                  </List.Accordion>
                  <List.Accordion
                    title="Filtrar por Geração"
                    left={(props) => <List.Icon {...props} icon="history" />}
                  >
                    {generations.map((generation) => (
                      <List.Item
                        title={generation.name}
                        key={generation.name}
                        onPress={() => toggleGenerationSelection(generation.name, setPokeList, loadPokemon)}
                        left={(props) => (
                          <List.Icon
                            {...props}
                            icon={
                              selectedGenerations.includes(generation.name)
                                ? "check-circle"
                                : "checkbox-blank-circle-outline"
                            }
                            color={
                              selectedGenerations.includes(generation.name)
                                ? "#007aff"
                                : undefined
                            }
                          />
                        )}
                      />
                    ))}
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
