import { View, Text, StyleSheet, Image } from "react-native";
import axios from 'axios'
import { useEffect, useState } from "react";
import { ActivityIndicator, Card, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import GestureRecognizer from "react-native-swipe-gestures";
import { useContext } from "react";
import { FavoritesContext } from "../providers/FavoritesContext";

const ItemDetailsScreen = ({ route }) => {
    const [itemInfo, setItemInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation()
    const { id } = route.params;
    const { favoriteItems, addItemToFavorites, removeItemFromFavorites } = useContext(FavoritesContext);
    console.log("Current Item ID:", id)

    const swipeConfig = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 120,
        gestureIsClickThreshold: 5,
      };

      useEffect(() => {
        setLoading(true);
        // Fetch the item details using the `id`
        axios.get(`https://pokeapi.co/api/v2/item/${id}`)
          .then((response) => {
            setItemInfo(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching item details:", error);
            setLoading(false);
          });
      }, [id]);

    const goToPreviousItem = () => {
        if (parseInt(id) > 1) {
          // Navigate to the previous item
          const previousId = (parseInt(id) - 1).toString();
          // Update the route params without leaving the screen
          navigation.setParams({ id: previousId });
        }
      };

      const goToNextItem = () => {
        // Navigate to the next item
        const nextId = (parseInt(id) + 1).toString();
        // Update the route params without leaving the screen
        navigation.setParams({ id: nextId });
      };
    
    console.log("Item Info:", itemInfo)

    if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4264a8" />
            <Text>Loading item details...</Text>
          </View>
        );
      }  

    return (
      <SafeAreaView style={styles.container}>
        <GestureRecognizer
        onSwipeLeft={goToNextItem}
        onSwipeRight={goToPreviousItem}
        config={swipeConfig}
        style={styles.flexContainer}
        >
        <Card style={styles.card}>
          <View style={styles.headerContainer}> 
            <IconButton
              icon="arrow-left"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>{itemInfo.name}</Text>
            <IconButton
            icon={favoriteItems.includes(itemInfo.id.toString()) ? "heart" : "heart-outline"}
            style={styles.favButton}
            onPress={() => {
              favoriteItems.includes(itemInfo.id.toString()) ? removeItemFromFavorites(itemInfo.id.toString()) : addItemToFavorites(itemInfo.id.toString())
            }}
            >
            </IconButton>
          </View>
          <View style={styles.imageContainer}>
              <Image source={{ uri: itemInfo.sprites.default }} style={styles.image} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text>{itemInfo.flavor_text_entries[0].text}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Attributes</Text>
            {itemInfo.attributes.map((attribute) => (
              <Text key={attribute.name}>{attribute.name}</Text>
            ))}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Effects</Text>
            <Text>{itemInfo.effect_entries[0].effect.replace("\n", "")}</Text>
          </View>
        </Card>
        </GestureRecognizer>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    marginTop: -40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 16,
    marginBottom: 8,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    textTransform: "capitalize",
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
  },
  infoContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
 
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
});

export default ItemDetailsScreen;
