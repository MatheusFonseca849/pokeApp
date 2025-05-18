import { createContext, useState } from "react";
import axios from "axios";

export const FilterContext = createContext();

const FilterProvider = ({ children }) => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const [isFiltering, setIsFiltering] = useState(false);
    const [pokeTypes, setPokeTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [ generations, setGenerations ] = useState([]);
    const [selectedGenerations, setSelectedGenerations] = useState([])

    //TYPE LOGIC

    const getPokeTypes = async () => {
        try {
            const response = await axios.get(`${baseUrl}type`);
            setPokeTypes(response.data.results);
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
            const response = await axios.get(`${baseUrl}generation`);
            setGenerations(response.data.results);
            console.log(response.data.results)

        } catch (error) {
            console.error("Error fetching generations:", error);
        }
    }

    const getPokemonByGenerations = async (generations, setPokeList) => {
        try {
            const promises = generations.map((generation) => axios.get(`${baseUrl}generation/${generation}`));
            const responses = await Promise.all(promises);
            const pokemonLists = responses.map((res) =>
                res.data.pokemon_species.map((p) => {
                    // Extract the ID from the species URL
                    const speciesId = p.url.split('/').filter(Boolean).pop();
                    return {
                        name: p.name,
                        url: `${baseUrl}pokemon/${speciesId}/`
                    };
                })
            );
            const combinedList = pokemonLists.flat();
            setPokeList(combinedList);
            setIsFiltering(true);
        } catch (error) {
            console.error("Error fetching Pokemon by generation:", error);
        }
    }

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