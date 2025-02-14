import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, Alert } from "react-native";
import { getFavorites, removeFromFavorites } from "./hooks/useMovies";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getFavorites((favorites) => {
      // Filtra solo las películas que tienen favorite: true
      const filteredMovies = favorites.filter((movie) => movie.favorite === true);
      setMovies(filteredMovies);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = (movieTitle) => {
    Alert.alert(
      "Eliminar",
      `¿Seguro que quieres eliminar "${movieTitle}" de tus favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => removeFromFavorites(movieTitle) },
      ]
    );
  };

  return (
      <View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : movies.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 18, color: "white" }}>No hay películas en favoritos</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {movies.map((movie) => (
              <View key={movie.id} style={{ margin: 10 }}>
                <Image source={{ uri: movie.Poster }} style={{ width: 150, height: 220 }} />
                <View>
                  <Text>{movie.Title}</Text>
                  <Text>{movie.Year}</Text>
                  <TouchableOpacity onPress={() => handleRemove(movie.Title)}>
                    <Ionicons name="trash-outline" size={24} />
                    <Text>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
  );
}
