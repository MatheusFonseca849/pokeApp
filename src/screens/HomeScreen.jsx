import {
  StyleSheet,
  View,
  FlatList,
  Animated,
  Easing,
  Text,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  IconButton,
  Searchbar,
  List,
  ActivityIndicator,
} from "react-native-paper";
import GestureRecognizer from "react-native-swipe-gestures";
import { PokemonContext } from "../providers/PokemonContext";
import axios from "axios";
import PokeCard from "../components/PokeCard";
import PaginationButton from "../components/PaginationButton";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilterContext } from "../providers/FilterContext";
import { ThemeContext } from "../providers/ThemeContext";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
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
    clearSelection,
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
    loading,
  } = useContext(PokemonContext);
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [localNext, setLocalNext] = useState(next);

  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPokemon();
    loadAllPokemon();
  }, []);
  
  useEffect(() => {
    setLocalNext(next);
    setHasMoreData(!!next);
  }, [next]);

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
  
  const fetchMorePokemon = async () => {
    // Don't fetch if already loading, no more data, or searching
    if (isLoadingMore || !hasMoreData || searchText !== "" || isFiltering) {
      return;
    }

    try {
      setIsLoadingMore(true);
      const response = await axios.get(localNext);

      // Append new results to existing list
      setPokeList((prevList) => [...prevList, ...response.data.results]);

      // Update pagination data
      setLocalNext(response.data.next);
      setHasMoreData(!!response.data.next);
    } catch (error) {
      console.error("Error loading more Pokemon:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore || searchText !== "" || isFiltering) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.onBackground }}>Loading more...</Text>
      </View>
    );
  };

  const handleSwipeLeft = () => {
    navigation.navigate('Favorites');
  };
  
  const handleSwipeRight = () => {
    navigation.navigate('Teams');
  };

  return (
    <GestureRecognizer
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      config={swipeConfig}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={["bottom", "left", "right"]}
      >
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Searchbar
            placeholder="Search Pokemon"
            onChangeText={searchPokemon}
            value={searchText}
            style={styles.searchBar}
          />
          <View style={{ position: "relative" }}>
            <IconButton
              mode="contained"
              style={[
                styles.button,
                // Apply conditional styling when filters are active
                (selectedTypes.length > 0 || selectedGenerations.length > 0) &&
                  styles.activeFilterButton,
              ]}
              icon={filtersVisible ? "filter" : "filter-outline"}
              onPress={toggleFilters}
            />

            {/* Show badge with clear button when filters are active but panel is closed */}
            {(selectedTypes.length > 0 || selectedGenerations.length > 0) &&
              !filtersVisible && (
                <View style={styles.filterBadge}>
                  <IconButton
                    icon="close-circle"
                    size={16}
                    iconColor="white"
                    style={styles.badgeButton}
                    onPress={() => clearSelection(loadPokemon)}
                  />
                </View>
              )}
          </View>
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
                        onPress={() =>
                          toggleTypeSelection(
                            type.name,
                            setPokeList,
                            loadPokemon
                          )
                        }
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
                        onPress={() =>
                          toggleGenerationSelection(
                            generation.name,
                            setPokeList,
                            loadPokemon
                          )
                        }
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ color: theme.colors.onBackground }}>
              Carregando Pokemons
            </Text>
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={pokeList}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => {
              return <PokeCard item={item} />;
            }}
            onEndReached={searchText === "" && !isFiltering ? fetchMorePokemon : null}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            removeClippedSubviews={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        )}
        
      </SafeAreaView>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  list: {
    marginBottom: 5,
  },
  loaderContainer: {
    paddingVertical: 16,
    alignItems: "center",
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
    marginVertical: 4,
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },

  activeFilterButton: {
    backgroundColor: "#007aff",
  },

  filterBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  badgeButton: {
    marginRight: 5,
    marginTop: 5,
    padding: 0,
    width: 25,
    height: 25,
  },
});
