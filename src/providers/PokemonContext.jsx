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
  const [unfilteredPokeList, setUnfilteredPokeList] = useState([]);
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
      // First load favorites from AsyncStorage
      const favorites = await AsyncStorage.getItem("@favorites");
      if (favorites) {
        const favoritesList = JSON.parse(favorites);
        setFavoriteArray(favoritesList);
      }

      // Check for cached Pokemon list
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

      // Optionally load full database in background if needed
      const cachedDatabase = await AsyncStorage.getItem("@pokeDatabase");
      if (cachedDatabase) {
        setPokeDatabase(JSON.parse(cachedDatabase));
      } else if (pokeDatabase.length === 0) {
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
      const results = response.data.results;
      setPokeList(results);
      setUnfilteredPokeList(results); // Store an unfiltered copy
      setNext(response.data.next);
      setPrevious(response.data.previous ?? null);

      // Cache the loaded data
      await AsyncStorage.setItem(
        "@pokeList",
        JSON.stringify({
          results: results,
          next: response.data.next,
          previous: response.data.previous,
        })
      );
    } catch (error) {
      console.error("Failed to load Pokémon:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllPokemon = async () => {
    setLoading(true);

    // Check if we have cached enhanced database with types
    const cachedEnhancedDatabase = await AsyncStorage.getItem(
      "@pokeDatabase_withTypes"
    );
    if (cachedEnhancedDatabase) {
      setPokeDatabase(JSON.parse(cachedEnhancedDatabase));
      setLoading(false);
      return;
    }

    // Check for regular cached database
    const cachedDatabase = await AsyncStorage.getItem("@pokeDatabase");
    if (cachedDatabase) {
      const basicPokemonList = JSON.parse(cachedDatabase);
      setPokeDatabase(basicPokemonList);

      // Enhance the database with types in background
      enhancePokemonWithTypes(basicPokemonList);
      return;
    }

    // If no cache exists, fetch fresh data
    axios
      .get(`${baseUrl}pokemon?limit=100000&offset=0`)
      .then((response) => {
        setPokeDatabase(response.data.results);
        setLoading(false);

        // Cache basic data
        AsyncStorage.setItem(
          "@pokeDatabase",
          JSON.stringify(response.data.results)
        );

        // Enhance with types in background
        enhancePokemonWithTypes(response.data.results);
      })
      .catch((error) => {
        console.error("Failed to load Pokémon:", error);
        setLoading(false);
      });
  };

  const enhancePokemonWithTypes = async (basicPokemonList) => {
    try {
      // Get all types
      const typesResponse = await axios.get(`${baseUrl}type`);
      const types = typesResponse.data.results;

      // Create a map to easily update Pokemon with their types
      const pokemonMap = {};
      basicPokemonList.forEach((pokemon) => {
        pokemonMap[pokemon.name] = {
          ...pokemon,
          types: [], // Initialize empty types
        };
      });

      // Process each type
      for (const type of types) {
        const typeData = await axios.get(type.url);

        // For each Pokemon of this type
        typeData.data.pokemon.forEach((p) => {
          const pokemonName = p.pokemon.name;

          // Add type to Pokemon if it exists in map
          if (pokemonMap[pokemonName]) {
            pokemonMap[pokemonName].types.push(type.name);
          }
        });
      }

      // Convert map back to array
      const enhancedPokemonList = Object.values(pokemonMap);

      // Save to state and cache
      setPokeDatabase(enhancedPokemonList);
      setLoading(false);
      await AsyncStorage.setItem(
        "@pokeDatabase_withTypes",
        JSON.stringify(enhancedPokemonList)
      );
    } catch (error) {
      console.error("Error enhancing Pokemon with types:", error);
      setLoading(false);
    }
  };

  const loadFavoritePokemon = async () => {
    try {
      setLoading(true);
      // Use Promise.all to wait for all API requests to complete
      const pokemonPromises = favoriteArray.map((id) =>
        axios.get(`${baseUrl}pokemon/${id}`)
      );

      const responses = await Promise.all(pokemonPromises);

      // Transform the response data into expected format
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
    setPokeList(filteredPokemon);
  };

  const handleNext = async () => {
    if (isFiltering || !next) return;

    try {
      setLoading(true);
      const response = await axios.get(next);
      setPokeList(response.data.results);
      setNext(response.data.next);
      setPrevious(response.data.previous ?? null);
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
    setFavoriteArray((prev) => [...prev, id]);
  };

  const removeFromFavorites = (id) => {
    setFavoriteArray((prev) => prev.filter((pokemon) => pokemon !== id));
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
        unfilteredPokeList,
        loading,
        next,
        previous,
        pokeDatabase,
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
