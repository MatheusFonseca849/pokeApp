import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ItemCard from '../components/ItemCard';

const FavoriteItemsScreen = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const baseUrl = 'https://pokeapi.co/api/v2/';

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteItems');
      if (storedFavorites) {
        const favoritesList = JSON.parse(storedFavorites);
        setFavorites(favoritesList);
        loadFavoriteItems(favoritesList);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const loadFavoriteItems = async (favoritesList) => {
    try {
      setLoading(true);
      // Use Promise.all to wait for all API requests to complete
      const itemPromises = favoritesList.map(id => 
        axios.get(`${baseUrl}item/${id}`)
      );
      
      const responses = await Promise.all(itemPromises);
      
      // Transform the response data into the format ItemCard expects
      const itemData = responses.map(response => ({
        name: response.data.name,
        url: `https://pokeapi.co/api/v2/item/${response.data.id}/`
      }));
      
      setFavoriteItems(itemData);
    } catch (error) {
      console.error('Error loading favorite items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToFavorites = async (id) => {
    try {
      const favoritesList = [...favorites];
      favoritesList.push(id);
      await AsyncStorage.setItem('favoriteItems', JSON.stringify(favoritesList));
      setFavorites(favoritesList);
      loadFavoriteItems(favoritesList);
    } catch (e) {
      console.error(e);
    }
  };

  const removeItemFromFavorites = async (id) => {
    try {
      const updatedList = favorites.filter(item => item !== id);
      await AsyncStorage.setItem('favoriteItems', JSON.stringify(updatedList));
      setFavorites(updatedList);
      loadFavoriteItems(updatedList);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4264a8" />
        <Text>Loading favorite items...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {favoriteItems.length > 0 ? (
        <FlatList
          style={styles.list}
          data={favoriteItems}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            const id = item.url.split("/").filter(Boolean).pop();
            return (
              <ItemCard 
                item={item} 
                id={id} 
                favoriteItems={favorites}
                addItemToFavorites={addItemToFavorites}
                removeItemFromFavorites={removeItemFromFavorites}
              />        
            );
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text>You don't have any favorite items yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoriteItemsScreen;
