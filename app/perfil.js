import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, Alert, StyleSheet, Dimensions } from "react-native";
import { getFavorites, removeFromFavorites } from "./hooks/useMovies";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function FavoritesScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBackground, setCurrentBackground] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = getFavorites((favorites) => {
      const filteredMovies = favorites.filter((movie) => movie.favorite === true);
      setMovies(filteredMovies);
      setCurrentBackground(filteredMovies.length > 0 ? filteredMovies[0].Poster : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRemove = (movieTitle) => {
    Alert.alert(
      "Delete from favorites",
      `Are you sure of delete "${movieTitle}" from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive",onPress: () => removeFromFavorites(movieTitle) },
      ]
    );
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (movies[index]) {
      setCurrentBackground(movies[index].Poster);
      setCurrentIndex(index);
    }
  };

  return (
    <ImageBackground source={{ uri: currentBackground }} style={styles.background} blurRadius={10}>
      <View style={styles.overlay}>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : movies.length === 0 ? (
          <View style={styles.noFavoritesContainer}>
            <Text style={styles.noFavoritesText}>No hay películas en favoritos</Text>
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {movies.map((movie, index) => (
                <View key={index} style={styles.movieContainer}>
                  <Image source={{ uri: movie.Poster }} style={styles.poster} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.movieTitle}>{movie.Title}</Text>
                    <Text style={styles.movieYear}>{movie.Director}</Text>
                    <TouchableOpacity onPress={() => handleRemove(movie.Title)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete from favorites  </Text>
                      <Ionicons name="trash-outline" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Indicador de scroll */}
            <View style={styles.indicatorContainer}>
              {movies.map((_, index) => (
                <View key={index} style={[styles.indicator, currentIndex === index && styles.activeIndicator]} />
              ))}
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  noFavoritesContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noFavoritesText: {
    fontSize: 18,
    color: "white",
  },
  movieContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  poster: {
    width: width * 0.60, // Póster un poco más grande
    height: height * 0.4,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: "center",
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  movieYear: {
    fontSize: 18,
    color: "white",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#FFA500",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '600'
  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "white",
  },
});
