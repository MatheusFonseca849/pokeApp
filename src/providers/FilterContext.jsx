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
  const [isUsingEnhancedFiltering, setIsUsingEnhancedFiltering] = useState(false);
  const hasLoaded = useRef(false);

  const loadFilterData = async () => {
    try {
      // Load cached types
      const cachedTypes = await AsyncStorage.getItem("@pokeTypes");
      if (cachedTypes) {
        setPokeTypes(JSON.parse(cachedTypes));
      } else {
        await getPokeTypes();
      }

      // Load cached generations
      const cachedGenerations = await AsyncStorage.getItem("@pokeGenerations");
      if (cachedGenerations) {
        setGenerations(JSON.parse(cachedGenerations));
      } else {
        await getGenerations();
      }
    } catch (error) {
      console.error("Error loading filter data:", error);
    }
  };

  //TYPE LOGIC

  const getPokeTypes = async () => {
    try {
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

    if (updatedTypes.length === 0 && selectedGenerations.length === 0) {
      setIsFiltering(false);
      loadPokemon();
    } else {
      applyFilters(updatedTypes, selectedGenerations, setPokeList, loadPokemon);
    }
  };

  const clearSelection = (loadPokemon) => {
    setSelectedTypes([]);
    setSelectedGenerations([]);
    setIsFiltering(false);
    loadPokemon();
  };
  
  // Apply combined filters
  const applyFilters = async (types = [], generations = [], setPokeList, loadPokemon) => {
    setIsFiltering(true);
    
    // If no filters active, reset to default list
    if (types.length === 0 && generations.length === 0) {
      setIsFiltering(false);
      loadPokemon();
      return;
    }
    
    try {
      // Check if enhanced database in AsyncStorage with type information exists
      const cachedEnhancedDatabase = await AsyncStorage.getItem("@pokeDatabase_withTypes");
      
      // Case 1: Only type filters selected & enhanced database available
      if (types.length > 0 && generations.length === 0 && cachedEnhancedDatabase) {
        setIsUsingEnhancedFiltering(true);
        const enhancedPokemonList = JSON.parse(cachedEnhancedDatabase);
        
        // Apply type filters
        const filteredList = enhancedPokemonList.filter(pokemon => 
          types.every(type => pokemon.types?.includes(type))
        );
        
        // Update the Pokemon list with filtered results
        setPokeList(filteredList);
      }
      
      // Case 2: Only generation filters selected
      else if (types.length === 0 && generations.length > 0) {
        // Use the existing generation filter function
        getPokemonByGenerations(generations, setPokeList);
      }
      
      // Case 3: Both type and generation filters active
      else if (types.length > 0 && generations.length > 0) {
        // Get Pokemon from the selected generations
        const promises = generations.map((generation) =>
          axios.get(`${baseUrl}generation/${generation}`)
        );
        
        const responses = await Promise.all(promises);
        const pokemonFromGenerations = responses.flatMap((res) =>
          res.data.pokemon_species.map((p) => {
            // Extract ID from species URL
            const speciesId = p.url.split("/").filter(Boolean).pop();
            return {
              name: p.name,
              url: `${baseUrl}pokemon/${speciesId}/`,
            };
          })
        );
        
        // Filter by selected types
        if (cachedEnhancedDatabase) {
          // Use enhanced database to filter by type if available
          const enhancedPokemonList = JSON.parse(cachedEnhancedDatabase);
          
          // Filter enhanced list by selected types
          const typeFilteredList = enhancedPokemonList.filter(pokemon => 
            types.every(type => pokemon.types?.includes(type))
          );
          
          // Find intersection with Pokemon from selected generations
          const combinedFilteredList = typeFilteredList.filter(typePokemon => 
            pokemonFromGenerations.some(genPokemon => 
              genPokemon.name === typePokemon.name
            )
          );
          
          setPokeList(combinedFilteredList);
        } else {
          // Fall back to API-based filtering if enhanced database isn't available
          // Get Pokemon of selected types
          const promises = types.map((type) => axios.get(`${baseUrl}type/${type}`));
          const responses = await Promise.all(promises);
          const pokemonLists = responses.map((res) =>
            res.data.pokemon.map((p) => p.pokemon)
          );
          
          // Find intersection of Pokemon with selected types
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
          
          // Final intersection with generation-filtered Pokemon
          const finalList = intersectionList.filter(typePokemon => 
            pokemonFromGenerations.some(genPokemon => 
              genPokemon.name === typePokemon.name
            )
          );
          
          setPokeList(finalList);
        }
      } else {
        // No filters active
        setIsFiltering(false);
        loadPokemon();
      }
    } catch (error) {
      console.error("Error applying combined filters:", error);
      
      // Fall back to original basic filtering if error occurs
      if (types.length > 0 && generations.length === 0) {
        getPokemonByType(types, setPokeList);
      } else if (types.length === 0 && generations.length > 0) {
        getPokemonByGenerations(generations, setPokeList);
      } else if (types.length > 0 && generations.length > 0) {
        // Try to at least apply one of the filters
        getPokemonByType(types, setPokeList);
      } else {
        setIsFiltering(false);
        loadPokemon();
      }
    }
  };

  // GENERATION LOGIC

  const getGenerations = async () => {
    try {
      // Fetch from API
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
          // Extract ID from species URL
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

    if (updatedGenerations.length === 0 && selectedTypes.length === 0) {
      setIsFiltering(false);
      loadPokemon();
    } else {
      applyFilters(selectedTypes, updatedGenerations, setPokeList, loadPokemon);
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
        isUsingEnhancedFiltering,
        applyFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;
