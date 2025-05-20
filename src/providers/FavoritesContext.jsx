import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useState } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({children}) => {

    const [favoriteItems, setFavoriteItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = 'https://pokeapi.co/api/v2/';

    const loadFavoriteItems = async (favoritesList) => {
        try {
            setLoading(true);
            // Use Promise.all to wait for all API requests to complete
        const itemPromises = favoritesList.map(id => 
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
            const favorites = await AsyncStorage.getItem('favoriteItems');
            const favoritesList = favorites ? JSON.parse(favorites) : [];
            favoritesList.push(id);
            await AsyncStorage.setItem('favoriteItems', JSON.stringify(favoritesList));
            setFavoriteItems(favoritesList);
            console.log(`Added ${id} to favorites`);
            console.log(favoritesList)
        } catch (e) {
            console.error(e);
        }
    }
    
    const removeItemFromFavorites = async (id) => {
        try {
            const favorites = await AsyncStorage.getItem('favoriteItems');
            const favoritesList = favorites ? JSON.parse(favorites) : [];
            if(favoritesList.includes(id)){
                const updatedList = favoritesList.filter((item) => item !== id);
                await AsyncStorage.setItem('favoriteItems', JSON.stringify(updatedList));
                setFavoriteItems(updatedList);
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
            loading,
            loadFavoriteItems,
            addItemToFavorites,
            removeItemFromFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    )
}