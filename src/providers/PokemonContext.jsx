import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useRef,
} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FilterContext } from "./FilterContext";
import Toast from "react-native-toast-message";

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

  const { isFiltering, setIsFiltering } = useContext(FilterContext);

  const hasLoaded = useRef(false);

  const baseUrl = "https://pokeapi.co/api/v2/";

  useEffect(() => {
    if (!hasLoaded.current) {
      loadPokemonData();
      hasLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (favoritePokemon.length > 0) {
      AsyncStorage.setItem(
        "@favoritePokemonData",
        JSON.stringify(favoritePokemon)
      ).catch((error) =>
        Toast.show({
          type: "error",
          text1: `Erro ao salvar favoritos: ${error}`,
        })
      );
    }
  }, [favoritePokemon]);

  const loadPokemonData = async () => {
    setLoading(true);
    try {
      // 1. First load favorites from AsyncStorage
      const favorites = await AsyncStorage.getItem("@favorites");
      if (favorites) {
        const favoritesList = JSON.parse(favorites);
        setFavoriteArray(favoritesList);
      }

      // 2. Check for cached Pokemon list
      const cachedPokeList = await AsyncStorage.getItem("@pokeList");
      if (cachedPokeList) {
        const pokeListData = JSON.parse(cachedPokeList);
        setPokeList(pokeListData.results);
        setNext(pokeListData.next);
        setPrevious(pokeListData.previous);
      } else {
        // If no cached data, load from API using existing function
        await loadPokemon();
      }

      // 3. Optionally load the full database in background if needed
      const cachedDatabase = await AsyncStorage.getItem("@pokeDatabase");
      if (cachedDatabase) {
        setPokeDatabase(JSON.parse(cachedDatabase));
      } else if (pokeDatabase.length === 0) {
        // Don't await this - let it load in background
        loadAllPokemon();
      }
    } catch (error) {
      console.error("Failed to load Pokemon data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const loadAllPokemon = async () => {
    setLoading(true);

    const cachedDatabase = await AsyncStorage.getItem("@pokeDatabase");
    if (cachedDatabase) {
      setPokeDatabase(JSON.parse(cachedDatabase));
      setLoading(false);
      console.log("Using cached pokemon database");
      return;
    }

    console.log("Fetching full pokemon database");
    axios
      .get(`${baseUrl}pokemon?limit=100000&offset=0`)
      .then((response) => {
        setPokeDatabase(response.data.results);
        setLoading(false);
        AsyncStorage.setItem(
          "@pokeDatabase",
          JSON.stringify(response.data.results)
        );
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
      const pokemonPromises = favoriteArray.map((id) =>
        axios.get(`${baseUrl}pokemon/${id}`)
      );

      const responses = await Promise.all(pokemonPromises);

      // Transform the response data into the format PokeCard expects
      const pokemonData = responses.map((response) => ({
        name: response.data.name,
        url: `https://pokeapi.co/api/v2/pokemon/${response.data.id}/`,
      }));

      setFavoritePokemon(pokemonData);
    } catch (error) {
      console.error("Error loading favorite Pokemon:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchPokemon = (searchText) => {
    setSearchText(searchText);

    const filteredPokemon = pokeDatabase.filter((pokemon) => {
      return (
        pokemon.name.includes(searchText.toLowerCase()) ||
        pokemon.url.slice(34, -1) === searchText
      );
    });
    console.log(filteredPokemon);
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

  const addToFavorites = (id) => {
    setFavoriteArray(prev => [...prev, id]);
  };
  
  const removeFromFavorites = (id) => {   
    setFavoriteArray(prev => prev.filter(pokemon => pokemon !== id));
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

  return (
    <PokemonContext.Provider
      value={{
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
        favoritePokemon,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonProvider;
