import React, { useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ItemCard from '../components/ItemCard';
import { FavoritesContext } from '../providers/FavoritesContext';

const FavoriteItemsScreen = () => {
  const { 
    favoriteItems, 
    favoriteItemIds, 
    loading, 
    loadFavoriteItems, 
    addItemToFavorites, 
    removeItemFromFavorites 
  } = useContext(FavoritesContext);

  useEffect(() => {
    loadFavoriteItems();
  }, [favoriteItemIds]);





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
                favoriteItems={favoriteItemIds}
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
