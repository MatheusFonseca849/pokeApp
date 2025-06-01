import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect, useRef } from "react";
export const FilterContext = createContext();

const FilterProvider = ({ children }) => {
  const baseUrl = "https://pokeapi.co/api/v2/";
  const [isFiltering, setIsFiltering] = useState(false);
  const [pokeTypes, setPokeTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [selectedGenerations, setSelectedGenerations] = useState([]);
  const hasLoaded = useRef(false);

  const loadFilterData = async () => {
    try {
      // Load cached types
      const cachedTypes = await AsyncStorage.getItem("@pokeTypes");
      if (cachedTypes) {
        setPokeTypes(JSON.parse(cachedTypes));
      } else {
        // If no cached data, fetch types
        await getPokeTypes();
      }

      // Load cached generations
      const cachedGenerations = await AsyncStorage.getItem("@pokeGenerations");
      if (cachedGenerations) {
        setGenerations(JSON.parse(cachedGenerations));
      } else {
        // If no cached data, fetch generations
        await getGenerations();
      }

      // Load user's selected filters if any
      const savedSelectedTypes = await AsyncStorage.getItem("@selectedTypes");
      if (savedSelectedTypes) {
        setSelectedTypes(JSON.parse(savedSelectedTypes));
      }

      const savedSelectedGenerations = await AsyncStorage.getItem(
        "@selectedGenerations"
      );
      if (savedSelectedGenerations) {
        setSelectedGenerations(JSON.parse(savedSelectedGenerations));
      }
    } catch (error) {
      console.error("Error loading filter data:", error);
    }
  };

  //TYPE LOGIC

  const getPokeTypes = async () => {
    try {
      const cachedTypes = await AsyncStorage.getItem("@pokeTypes");
      if (cachedTypes) {
        setPokeTypes(JSON.parse(cachedTypes));
        return;
      }

      // Fetch from API if not cached
      const response = await axios.get(`${baseUrl}type`);
      setPokeTypes(response.data.results);
      AsyncStorage.setItem("@pokeTypes", JSON.stringify(response.data.results));
    } catch (error) {
      console.error("Error fetching Pokemon types:", error);
    }
  };

  const getPokemonByType = async (types, setPokeList) => {
    if (typeof types === "string") {
      types = [types];
    }

    try {
      const promises = types.map((type) => axios.get(`${baseUrl}type/${type}`));
      const responses = await Promise.all(promises);
      const pokemonLists = responses.map((res) =>
        res.data.pokemon.map((p) => p.pokemon)
      );
      const intersectionList =
        pokemonLists.length === 1
          ? pokemonLists[0]
          : pokemonLists.reduce((a, b) => {
              return a.filter((pokeA) =>
                b.some(
                  (pokeB) => pokeB.url.slice(34, -1) === pokeA.url.slice(34, -1)
                )
              );
            });
      setPokeList(intersectionList);
      setIsFiltering(true);
    } catch (error) {
      console.error("Error fetching Pokemon by type:", error);
    }
  };

  const toggleTypeSelection = (type, setPokeList, loadPokemon) => {
    const isSelected = selectedTypes.includes(type);
    const updatedTypes = isSelected
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    setSelectedTypes(updatedTypes);

    if (updatedTypes.length === 0) {
      setIsFiltering(false);
      loadPokemon();
    } else {
      getPokemonByType(updatedTypes, setPokeList);
    }
  };

  const clearSelection = (loadPokemon) => {
    setSelectedTypes([]);
    setSelectedGenerations([]);
    setIsFiltering(false);
    loadPokemon();
  };

  // GENERATION LOGIC

  const getGenerations = async () => {
    try {
      // Check cache first
      const cachedGenerations = await AsyncStorage.getItem("@pokeGenerations");
      if (cachedGenerations) {
        setGenerations(JSON.parse(cachedGenerations));
        return;
      }

      // Fetch from API if not cached
      const response = await axios.get(`${baseUrl}generation`);
      setGenerations(response.data.results);

      // Cache the result
      await AsyncStorage.setItem(
        "@pokeGenerations",
        JSON.stringify(response.data.results)
      );
      console.log("Cached generation data");
    } catch (error) {
      console.error("Error fetching generations:", error);
    }
  };

  const getPokemonByGenerations = async (generations, setPokeList) => {
    try {
      const promises = generations.map((generation) =>
        axios.get(`${baseUrl}generation/${generation}`)
      );
      const responses = await Promise.all(promises);
      const pokemonLists = responses.map((res) =>
        res.data.pokemon_species.map((p) => {
          // Extract the ID from the species URL
          const speciesId = p.url.split("/").filter(Boolean).pop();
          return {
            name: p.name,
            url: `${baseUrl}pokemon/${speciesId}/`,
          };
        })
      );
      const combinedList = pokemonLists.flat();
      setPokeList(combinedList);
      setIsFiltering(true);
    } catch (error) {
      console.error("Error fetching Pokemon by generation:", error);
    }
  };

  const toggleGenerationSelection = (generation, setPokeList, loadPokemon) => {
    const isSelected = selectedGenerations.includes(generation);
    const updatedGenerations = isSelected
      ? selectedGenerations.filter((g) => g !== generation)
      : [...selectedGenerations, generation];

    setSelectedGenerations(updatedGenerations);

    if (updatedGenerations.length === 0) {
      setIsFiltering(false);
      loadPokemon();
    } else {
      getPokemonByGenerations(updatedGenerations, setPokeList);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      loadFilterData();
      hasLoaded.current = true;
    }
  }, []);

  // Save selected types when they change
  useEffect(() => {
    if (hasLoaded.current) {
      AsyncStorage.setItem(
        "@selectedTypes",
        JSON.stringify(selectedTypes)
      ).catch((error) =>
        console.error("Failed to save selected types:", error)
      );
    }
  }, [selectedTypes]);

  // Save selected generations when they change
  useEffect(() => {
    if (hasLoaded.current) {
      AsyncStorage.setItem(
        "@selectedGenerations",
        JSON.stringify(selectedGenerations)
      ).catch((error) =>
        console.error("Failed to save selected generations:", error)
      );
    }
  }, [selectedGenerations]);
  return (
    <FilterContext.Provider
      value={{
        isFiltering,
        setIsFiltering,
        pokeTypes,
        selectedTypes,
        selectedGenerations,
        getPokeTypes,
        getPokemonByType,
        toggleTypeSelection,
        clearSelection,
        getGenerations,
        getPokemonByGenerations,
        generations,
        toggleGenerationSelection,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;
