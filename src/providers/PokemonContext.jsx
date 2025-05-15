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
    const [favoritePokemon, setFavoritePokemon] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);
    
    const baseUrl = "https://pokeapi.co/api/v2/";

    useEffect(() => {
        AsyncStorage.getItem('favorites').then((favorites) => {
            if (favorites) {
                const favoritesList = JSON.parse(favorites);
                setFavoriteArray(favoritesList);
            }
        });
    }, []);


    const loadPokemon = async (url = `${baseUrl}pokemon?limit=25`) => {
      try {
        setLoading(true);
        setIsFiltering(false); // in case user is clearing filters
        const response = await axios.get(url);
        setPokeList(response.data.results);
        setNext(response.data.next);
        setPrevious(response.data.previous ?? null);
      } catch (error) {
        console.error("Failed to load Pokémon:", error);
      } finally {
        setLoading(false);
      }
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

    const loadFavoritePokemon = async () => {
        try {
            setLoading(true);
            // Use Promise.all to wait for all API requests to complete
            const pokemonPromises = favoriteArray.map(id => 
                axios.get(`${baseUrl}pokemon/${id}`)
            );
            
            const responses = await Promise.all(pokemonPromises);
            
            // Transform the response data into the format PokeCard expects
            const pokemonData = responses.map(response => ({
                name: response.data.name,
                url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}/`
            }));
            
            setFavoritePokemon(pokemonData);
        } catch (error) {
            console.error('Error loading favorite Pokemon:', error);
        } finally {
            setLoading(false);
        }
    }

    const searchPokemon = (searchText) => {
        setSearchText(searchText);
        
        const filteredPokemon = pokeDatabase.filter((pokemon) =>{
            return pokemon.name.includes(searchText.toLowerCase()) || pokemon.url.slice(34, -1) === searchText
        });
        console.log(filteredPokemon)
        setPokeList(filteredPokemon);
      };

      
      const handleNext = async () => {
        if (isFiltering || !next) return;
      
        try {
          setLoading(true);
          const response = await axios.get(next);
          setPokeList(response.data.results);
          setNext(response.data.next);
          setPrevious(response.data.previous ?? null); // clear if null
        } catch (error) {
          console.error("Failed to load next Pokémon:", error);
        } finally {
          setLoading(false);
        }
      };

      const handlePrevious = async () => {
        if (isFiltering || !previous) return;
      
        try {
          setLoading(true);
          const response = await axios.get(previous);
          setPokeList(response.data.results);
          setNext(response.data.next);
          setPrevious(response.data.previous ?? null);
        } catch (error) {
          console.error("Failed to load previous Pokémon:", error);
        } finally {
          setLoading(false);
        }
      };

    const addToFavorites = async (id) => {
        console.log(id)
            try {
                const favorites = await AsyncStorage.getItem('favorites');
                const favoritesList = favorites ? JSON.parse(favorites) : [];
                favoritesList.push(id);
                await AsyncStorage.setItem('favorites', JSON.stringify(favoritesList));
                // Update the state to trigger re-rendering
                setFavoriteArray(favoritesList);
                console.log(`Added ${id} to favorites`);
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
        directionalOffsetThreshold: 120,
        gestureIsClickThreshold: 5,
      };

      const onSwipeLeft = () => {
        if (searchText == "" && next) {
          handleNext();
        }
      };

      const onSwipeRight = () => {
        if (searchText == "" && previous) {
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
            pokeList,
            setPokeList,
            isFiltering,
            setIsFiltering,
            searchText,
            loadPokemon,
            loadAllPokemon,
            loadFavoritePokemon,
            searchPokemon,
            handleNext,
            handlePrevious,
            onSwipeLeft,
            onSwipeRight,
            swipeConfig,
            addToFavorites,
            removeFromFavorites,
            favoriteArray,
            setFavoriteArray,
            favoritePokemon
        }}>
            {children}
        </PokemonContext.Provider>
    )
}

export default PokemonProvider;