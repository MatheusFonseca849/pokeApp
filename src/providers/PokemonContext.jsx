import { createContext, useEffect } from "react";
import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
    const [pokeList, setPokeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [pokeDatabase, setPokeDatabase] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [favoriteArray, setFavoriteArray] = useState([]);
    
    const baseUrl = "https://pokeapi.co/api/v2/";
    useEffect(() => {
        AsyncStorage.getItem('favorites').then((favorites) => {
            if (favorites) {
                const favoritesList = JSON.parse(favorites);
                setFavoriteArray(favoritesList);
            }
        });
    }, []);


    const loadPokemon = async () => {
        setLoading(true);
        axios
          .get(`${baseUrl}pokemon`)
          .then((response) => {
            setPokeList(response.data.results);
            setNext(response.data.next);
            response.data.previous && setPrevious(response.data.previous);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Failed to load Pokémon:", error);
            setLoading(false);
          });
      };

    const loadAllPokemon = () => {
        setLoading(true);
        axios
          .get(`${baseUrl}pokemon?limit=100000&offset=0`)
          .then((response) => {
            setPokeDatabase(response.data.results);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Failed to load Pokémon:", error);
            setLoading(false);
          });
      };

    const searchPokemon = (searchText) => {
        setSearchText(searchText);
        const filteredPokemon = pokeDatabase.filter((pokemon) =>
          pokemon.name.includes(searchText.toLowerCase())
        );
        setPokeList(filteredPokemon);
      };

    const handleNext = () => {
        setLoading(true);
        axios
          .get(next)
          .then((response) => {
            setPokeList(response.data.results);
            setNext(response.data.next);
            response.data.previous && setPrevious(response.data.previous);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Failed to load Pokémon:", error);
            setLoading(false);
          });
      };

    const handlePrevious = () => {
        setLoading(true);
        axios
          .get(previous)
          .then((response) => {
            setPokeList(response.data.results);
            setNext(response.data.next);
            setPrevious(response.data.previous);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Failed to load Pokémon:", error);
            setLoading(false);
          });
      };

    const addToFavorites = async (item) => {
        console.log(item)
            try {
                // const itemId = item.url.slice(34, -1);
                const favorites = await AsyncStorage.getItem('favorites');
                const favoritesList = favorites ? JSON.parse(favorites) : [];
                favoritesList.push(item);
                await AsyncStorage.setItem('favorites', JSON.stringify(favoritesList));
                // Update the state to trigger re-rendering
                setFavoriteArray(favoritesList);
                console.log(`Added ${item} to favorites`);
                console.log(favoritesList)
            } catch (e) {
                console.error(e);
            }
        };

    const removeFromFavorites = async (id) => {
        try {
            const favorites = await AsyncStorage.getItem('favorites');
            const favoritesList = favorites ? JSON.parse(favorites) : [];
            if(favoritesList.includes(id)){
                const updatedList = favoritesList.filter((pokemon) => pokemon !== id);
                await AsyncStorage.setItem('favorites', JSON.stringify(updatedList));
                setFavoriteArray(updatedList);
                console.log(`Removed ${id} from favorites`);
                console.log(updatedList)
            }
        } catch (e) {
            console.error(e);
        }
    };
    
    const swipeConfig = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
        gestureIsClickThreshold: 5,
      };

      const onSwipeLeft = () => {
        if (searchText == "") {
          handleNext();
        }
      };

      const onSwipeRight = () => {
        if (searchText == "") {
          handlePrevious();
        }
      };

    return(
        <PokemonContext.Provider value={{
            pokeList,
            loading,
            next,
            previous,
            pokeDatabase,
            searchText,
            loadPokemon,
            loadAllPokemon,
            searchPokemon,
            handleNext,
            handlePrevious,
            onSwipeLeft,
            onSwipeRight,
            swipeConfig,
            addToFavorites,
            removeFromFavorites,
            favoriteArray,
            setFavoriteArray
        }}>
            {children}
        </PokemonContext.Provider>
    )
}

export default PokemonProvider;