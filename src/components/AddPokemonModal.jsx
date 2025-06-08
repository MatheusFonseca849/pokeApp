import { Image, StyleSheet } from "react-native"
import { Portal, Dialog, Searchbar, Card, IconButton } from "react-native-paper"
import { useContext, useEffect } from "react"
import { PokemonContext } from "../providers/PokemonContext"
import { TeamsContext } from "../providers/TeamsContext"
import { View } from "react-native"
import { FlatList } from "react-native" 
import { Text } from "react-native"
import { Dimensions } from "react-native";
import { useState } from "react";
import { ThemeContext } from "../providers/ThemeContext"
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native";
import axios from "axios"
import { useNavigation } from "@react-navigation/native"

const { height } = Dimensions.get('window');

const AddPokemonModal = ({ visible, onDismiss, teamId, teamColor }) => {
    const { searchPokemon, searchText, pokeList, next } = useContext(PokemonContext);
    
    const { addPokemonToTeam, removePokemonFromTeam, teams } = useContext(TeamsContext);
    const [addedPokemonUrls, setAddedPokemonUrls] = useState([]);
    const [localPokeList, setLocalPokeList] = useState(pokeList);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [localNext, setLocalNext] = useState(next);
    const { theme } = useContext(ThemeContext);
    const currentTeam = teams.find(team => team.id === teamId);
    const teamPokemon = currentTeam ? currentTeam.pokemon : [];

    const navigation = useNavigation()



    // Reset addedPokemonUrls when modal closes or team changes
    useEffect(() => {
        if (!visible) {
            setAddedPokemonUrls([]);
        }
    }, [visible, teamId]);

    // Update local state when modal opens or pokeList changes
    useEffect(() => {
        if (visible) {
          setLocalPokeList(pokeList);
          setLocalNext(next);
          setHasMoreData(!!next);
        }
      }, [visible, pokeList, next]);

    const handleAddPokemon = (pokemon) => {
        // Check if team is full using the current team data
        if (teamPokemon.length < 6) {
            addPokemonToTeam(teamId, pokemon);
            setAddedPokemonUrls([...addedPokemonUrls, pokemon.url]);
        } else {
            // Show message that team is full
            Toast.show({
                type: "error",
                text1: "Time cheio",
            });
        }
    };

    useEffect(() => {
        if (searchText === '') {
          // Reset to initial state when search is cleared
          setLocalPokeList(pokeList);
          setLocalNext(next);
          setHasMoreData(!!next);
        }
      }, [searchText]);

    const handleRemovePokemon = (pokemon) => {
        removePokemonFromTeam(teamId, pokemon)
        setAddedPokemonUrls(addedPokemonUrls.filter((p) => p !== pokemon.url))
    }

    const fetchMorePokemon = async () => {
        // Don't fetch if already loading, no more data, or searching
        if (isLoadingMore || !hasMoreData || searchText !== '') {
          return;
        }
        
        try {
          setIsLoadingMore(true);
          const response = await axios.get(localNext);
          
          // Append new results to existing list
          setLocalPokeList(prevList => [...prevList, ...response.data.results]);
          
          // Update pagination data
          setLocalNext(response.data.next);
          setHasMoreData(!!response.data.next);
        } catch (error) {
          console.error('Error loading more Pokemon:', error);
        } finally {
          setIsLoadingMore(false);
        }
      };

      const renderFooter = () => {
        if (!isLoadingMore || searchText !== '') return null;
        
        return (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={teamColor || theme.colors.primary} />
          </View>
        );
      };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Adicionar Pokemon</Dialog.Title>
                <Dialog.Content>
                    <View style={styles.searchContainer}>
                    <Searchbar
                    placeholder="Search Pokemon"
                    onChangeText={searchPokemon}
                    value={searchText}
                    style={styles.searchBar}
                    />
                    
                    </View>
                    <FlatList
                    data={searchText !== '' ? pokeList : localPokeList}
                    style={styles.list}
                    renderItem={({ item }) => {
                        const pokeId = item.url.slice(34, -1);

                        const isPokemonInTeam = (teamPokemon && teamPokemon.some(pokemon => pokemon.url === item.url)) || 
                        addedPokemonUrls.includes(item.url);



                        return (
                        <Card style={[styles.pokemonItem, { borderLeftWidth: isPokemonInTeam ? 8 : 0, borderLeftColor: teamColor }]} key={pokeId} onPress={() =>{
                            onDismiss(); // Close the modal
  navigation.navigate("PokemonDetails", { 
    id: pokeId,
    returnToModal: true,
    teamId: teamId,
    teamColor: teamColor
                            })
                        }}>
                            <Card.Content style={styles.pokemonItemContent}>
                                <View style={styles.itemContainer}>
                                <Image
                                source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png` }}
                                style={{ width: 50, height: 50 }}
                                />
                                <Text style={{ color: theme.colors.onSurface}}>{item.name}</Text>
                                </View>
                                <IconButton
                                icon={isPokemonInTeam ? "minus" : "plus"}
                                style={styles.favButton}
                                onPress={() => isPokemonInTeam ? handleRemovePokemon(item) : handleAddPokemon(item)}
                                />
                            </Card.Content>
                        </Card>
                        )
                    }}
                    keyExtractor={(item) => item.url.slice(34, -1)}
                    onEndReached={searchText === '' ? fetchMorePokemon : null}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={10}
                    
                    />
                </Dialog.Content>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    dialog: {
        borderRadius: 12,
        maxHeight: height * 0.7, // Use 80% of screen height maximum
    },
    dialogContent: {
        paddingHorizontal: 16,
        paddingBottom: 0, // Remove bottom padding as FlatList will handle it
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    searchBar: {
        flex: 1,
        height: 40,
    },
    list: {
        maxHeight: height * 0.5, // Limit list height to ~50% of screen
    },
    listContent: {
        paddingBottom: 16,
    },
    pokemonItem: {
        marginBottom: 8,
    },
    pokemonItemContent: {
        fontSize: 18,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    loaderContainer: {
        paddingVertical: 16,
        alignItems: 'center',
      },
})

export default AddPokemonModal