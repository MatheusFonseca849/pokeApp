import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { FlatList } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemCard from "../components/ItemCard";
import { useContext } from "react";
import { FavoritesContext } from "../providers/FavoritesContext";
import { Searchbar } from "react-native-paper";
import { ThemeContext } from "../providers/ThemeContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ItemsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [items, setItems] = useState([]);
  const [itemsDatabase, setItemsDatabase] = useState([]);
  const [searchItemText, setSearchItemText] = useState("");
  const [next, setNext] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [localNext, setLocalNext] = useState("");
  const {
    favoriteItemIds,
    loadFavoriteItems,
    addItemToFavorites,
    removeItemFromFavorites,
  } = useContext(FavoritesContext);

  const swipeConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 120,
    gestureIsClickThreshold: 5,
  };
  const loadAllItems = async () => {
    const response = await fetch(
      "https://pokeapi.co/api/v2/item?limit=100000&offset=0"
    );
    const data = await response.json();
    setItemsDatabase(data.results);
  };

  useEffect(() => {
    loadItems();
    loadAllItems();
  }, []);
  
  useEffect(() => {
    setLocalNext(next);
    setHasMoreData(!!next);
  }, [next]);

  const loadItems = async () => {
    const response = await fetch("https://pokeapi.co/api/v2/item");
    const data = await response.json();
    setItems(data.results);
    setNext(data.next);
    setPrevious(data.previous);
  };

  const searchItems = (searchItemText) => {
    setSearchItemText(searchItemText);
    const filteredItems = itemsDatabase.filter((item) => {
      return (
        item.name.includes(searchItemText.toLowerCase()) ||
        item.url.slice(34, -1) === searchItemText
      );
    });
    setItems(filteredItems);
  };
  
  const fetchMoreItems = async () => {
    // Don't fetch if already loading, no more data, or searching
    if (isLoadingMore || !hasMoreData || searchItemText !== "") {
      return;
    }

    try {
      setIsLoadingMore(true);
      const response = await axios.get(localNext);

      // Append new results to existing list
      setItems((prevItems) => [...prevItems, ...response.data.results]);

      // Update pagination data
      setLocalNext(response.data.next);
      setHasMoreData(!!response.data.next);
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore || searchItemText !== "") return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.onBackground }}>Loading more...</Text>
      </View>
    );
  };
  
  const handleSwipeLeft = () => {
    navigation.navigate('Teams');
  };
  
  const handleSwipeRight = () => {
    navigation.navigate('Favorites');
  };

  useEffect(() => {
    loadFavoriteItems();
  }, [favoriteItemIds]);

  return (
    <GestureRecognizer
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      config={swipeConfig}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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
            placeholder="Search Items"
            onChangeText={searchItems}
            value={searchItemText}
            style={styles.searchBar}
          />
        </View>
        <FlatList
          style={styles.list}
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            const id = item.url.split("/").filter(Boolean).pop();
            return (
              <ItemCard
                item={item}
                id={id}
                favoriteItems={favoriteItemIds}
                addItemToFavorites={addItemToFavorites}
                removeItemFromFavorites={removeItemFromFavorites}
                theme={theme}
              />
            );
          }}
          onEndReached={searchItemText === "" ? fetchMoreItems : null}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      </SafeAreaView>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  list: {
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  searchBar: {
    flex: 1,
    marginVertical: 4,
  },
  loaderContainer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});

export default ItemsScreen;
