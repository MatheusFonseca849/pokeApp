import { View, Text, StyleSheet, Image } from "react-native";
import axios from 'axios'
import { useEffect, useState } from "react";
import { ActivityIndicator, Card } from "react-native-paper";

const ItemDetailsScreen = ({ route }) => {
    const [itemInfo, setItemInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(route)
    const { item } = route.params;
    console.log(item)

    useEffect(() => {
        setLoading(true);
        axios.get(item.url)
            .then((response) => {
                setItemInfo(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching item details:", error);
                setLoading(false);
            });
    }, [item]);
    
    console.log(itemInfo)
    console.log(item)

    if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4264a8" />
            <Text>Loading Pokémon details...</Text>
          </View>
        );
      }  

    return (
        <Card>
            {itemInfo && (
                <>
            <Text style={styles.title}>{itemInfo.name}</Text>
            <Image source={{ uri: itemInfo.sprites.default }} style={styles.image} />
                </>
            )}
        </Card>
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
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  type: {
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    textTransform: "capitalize",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  statName: {
    textTransform: "capitalize",
  },
  statValue: {
    fontWeight: "bold",
  },
  ability: {
    textTransform: "capitalize",
    marginLeft: 8,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
});

export default ItemDetailsScreen;
