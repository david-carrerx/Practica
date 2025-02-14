import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchMovie, addToFavorites } from "./hooks/useMovies";

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    const data = await fetchMovie(searchTerm);
    setMovie(data);
    setLoading(false);
  };

  return (
    <View>
      {!movie ? (
        <>
          <Text>Buscador de Películas</Text>
          <TextInput placeholder="Busca una película..." value={searchTerm} onChangeText={setSearchTerm} />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} />
            <Text>Buscar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView>
          {movie?.Poster && movie.Poster !== "N/A" ? (
            <Image source={{ uri: movie.Poster }} style={{ width: 300, height: 450 }} />
          ) : (
            <Text>Imagen no disponible</Text>
          )}
          <View>
            <Text>{movie?.Title}</Text>
            <Text>Año: {movie?.Year}</Text>
            <Text>Género: {movie?.Genre}</Text>
            <Text>Director: {movie?.Director}</Text>
            <Text>{movie?.Plot}</Text>
          </View>
          <TouchableOpacity onPress={() => addToFavorites(movie)}>
            <Ionicons name="heart-outline" size={24} />
            <Text>Agregar a Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMovie(null)}>
            <Text>Volver a buscar</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {loading && <ActivityIndicator size="large" />}
    </View>
  );
}
