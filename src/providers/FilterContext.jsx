import { createContext, useState } from "react";
import axios from "axios";

export const FilterContext = createContext();

const FilterProvider = ({ children }) => {
    const baseUrl = "https://pokeapi.co/api/v2/";
    const [isFiltering, setIsFiltering] = useState(false);
    const [pokeTypes, setPokeTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

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

    const clearTypeSelection = (loadPokemon) => {
        setSelectedTypes([]);
        setIsFiltering(false);
        loadPokemon();
    };

    return (
        <FilterContext.Provider
            value={{
                isFiltering,
                setIsFiltering,
                pokeTypes,
                selectedTypes,
                getPokeTypes,
                getPokemonByType,
                toggleTypeSelection,
                clearTypeSelection
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

export default FilterProvider;