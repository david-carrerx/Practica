import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, ImageBackground, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      {!movie ? (
        <>
          <Text style={styles.title}>Buscador de Películas</Text>
          <TextInput 
            placeholder="Busca una película..." 
            value={searchTerm} 
            onChangeText={setSearchTerm} 
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.button}>
            <Ionicons name="search" size={24} color="white" />
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ImageBackground source={{ uri: movie.Poster }} style={styles.background} blurRadius={10}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {movie?.Poster && movie.Poster !== "N/A" ? (
              <Image source={{ uri: movie.Poster }} style={styles.poster} />
            ) : (
              <Text style={styles.noImage}>Imagen no disponible</Text>
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.movieTitle}>{movie?.Title}</Text>
              <Text style={styles.details}>Año: {movie?.Year}</Text>
              <Text style={styles.details}>Género: {movie?.Genre}</Text>
              <Text style={styles.details}>Director: {movie?.Director}</Text>
              <Text style={styles.plot}>{movie?.Plot}</Text>
            </View>
            <TouchableOpacity onPress={() => addToFavorites(movie)} style={styles.favButton}>
              <Ionicons name="heart-outline" size={24} color="white" />
              <Text style={styles.favButtonText}>Agregar a Favoritos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMovie(null)} style={styles.backButton}>
              <Text style={styles.backButtonText}>Volver a buscar</Text>
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>
      )}
      {loading && <ActivityIndicator size="large" style={styles.loader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" },
  title: { fontSize: 24, color: "white", fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 10, borderWidth: 1, borderColor: "#fff", borderRadius: 8, color: "white", marginBottom: 10, backgroundColor: "#333" },
  button: { flexDirection: "row", alignItems: "center", backgroundColor: "#e50914", padding: 10, borderRadius: 8 },
  buttonText: { color: "white", marginLeft: 5, fontWeight: "bold" },
  backgroundContainer: { width: "100%", height: 225, alignItems: "center", justifyContent: "center" },
  background: { width: "100%", height: "100%", position: "absolute" },
  scrollContainer: { alignItems: "center", paddingTop: 20 },
  poster: { width: 300, height: 450, borderRadius: 10, marginBottom: 20 },
  noImage: { color: "white", fontSize: 18 },
  infoContainer: { width: "90%", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", padding: 20, borderRadius: 10 },
  movieTitle: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 10 },
  details: { fontSize: 16, color: "#bbb", marginBottom: 5 },
  plot: { fontSize: 14, color: "white", textAlign: "center", marginTop: 10 },
  favButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#e50914", padding: 10, borderRadius: 8, marginTop: 20 },
  favButtonText: { color: "white", fontWeight: "bold", marginLeft: 5 },
  backButton: { marginTop: 20 },
  backButtonText: { color: "white", fontSize: 16, textDecorationLine: "underline" },
  loader: { position: "absolute", top: "50%" },
});
