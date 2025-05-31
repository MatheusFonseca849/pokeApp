import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({children}) => {

    const [favoriteItemIds, setFavoriteItemIds] = useState([]);
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = 'https://pokeapi.co/api/v2/';
    
    useEffect(() => {
        AsyncStorage.getItem('@favoriteItems').then((favorites) => {
            if (favorites) {
                const favoritesList = JSON.parse(favorites);
                setFavoriteItemIds(favoritesList);
            }
        });
    }, []);

    const loadFavoriteItems = async () => {
        try {
            setLoading(true);
            // Use Promise.all to wait for all API requests to complete
            const itemPromises = favoriteItemIds.map(id => 
                axios.get(`${baseUrl}item/${id}`)
            );
            
            const responses = await Promise.all(itemPromises);
            
            // Transform the response data into the format ItemCard expects
            const itemData = responses.map(response => ({
                name: response.data.name,
                url: `https://pokeapi.co/api/v2/item/${response.data.id}/`
            }));
            
            setFavoriteItems(itemData);
        } catch (error) {
            console.error('Error loading favorite items:', error);
        } finally {
            setLoading(false);
        }
    }

    const addItemToFavorites = async (id) => {
        try {
            const favorites = await AsyncStorage.getItem('@favoriteItems');
            const favoritesList = favorites ? JSON.parse(favorites) : [];
            favoritesList.push(id);
            await AsyncStorage.setItem('@favoriteItems', JSON.stringify(favoritesList));
            setFavoriteItemIds(favoritesList);
            console.log(`Added ${id} to favorites`);
            console.log(favoritesList)
        } catch (e) {
            console.error(e);
        }
    }
    
    const removeItemFromFavorites = async (id) => {
        try {
            const favorites = await AsyncStorage.getItem('@favoriteItems');
            const favoritesList = favorites ? JSON.parse(favorites) : [];
            if(favoritesList.includes(id)){
                const updatedList = favoritesList.filter((item) => item !== id);
                await AsyncStorage.setItem('@favoriteItems', JSON.stringify(updatedList));
                setFavoriteItemIds(updatedList);
                console.log(`Removed ${id} from favorites`);
                console.log(updatedList)
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <FavoritesContext.Provider value={{
            favoriteItems,
            favoriteItemIds,
            loading,
            loadFavoriteItems,
            addItemToFavorites,
            removeItemFromFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    )
}