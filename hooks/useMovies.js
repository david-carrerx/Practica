import { db } from "../firebase/config";
import { Alert } from "react-native";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";

//Obtener película
export const fetchMovie = async (searchTerm) => {
    if (!searchTerm) return null;
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=669a7313&t=${searchTerm}`);
        const data = await response.json();
        return data;
    } catch (error) {
        Alert.alert("Error", "Hubo un problema al buscar la película.");
        console.error("Error al buscar la película:", error);
        return null;
    }
};

//Agregar a favoritos
export const addToFavorites = async (movie) => {
    if (!movie || !movie.Title) return;
    try {
        const favoritesRef = collection(db, "favorites");
        const q = query(favoritesRef, where("Title", "==", movie.Title));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            Alert.alert("Alert", "The movie is in favorites already!");
            return;
        }

        await addDoc(favoritesRef, { ...movie, favorite: true });
        Alert.alert("Success", "Movie added to favorites");
    } catch (error) {
        console.error("Error al agregar a favoritos:", error);
    }
};

//Eliminar de favoritos
export const removeFromFavorites = async (movieTitle) => {
    if (!movieTitle) return;
    try {
        const favoritesRef = collection(db, "favorites");
        const q = query(favoritesRef, where("Title", "==", movieTitle));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            Alert.alert("Información", "La película no estaba en favoritos.");
            return;
        }

        querySnapshot.forEach(async (docSnap) => {
            await deleteDoc(doc(db, "favorites", docSnap.id));
        });

    } catch (error) {
        Alert.alert("Error", "No se pudo eliminar la película de favoritos.");
        console.error("Error al eliminar de favoritos:", error);
    }
};

//Obtener favoritas
export const getFavorites = (callback) => {
    const favoritesRef = collection(db, "favorites");

    return onSnapshot(favoritesRef, (snapshot) => {
        const favorites = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(favorites);
    });
};
