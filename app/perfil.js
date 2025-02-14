import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground, Alert, StyleSheet, Dimensions, Animated } from "react-native";
import { getFavorites, removeFromFavorites } from "./hooks/useMovies";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function FavoritesScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBackground, setCurrentBackground] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1)); 

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
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Animated.timing(fadeAnim, {
              toValue: 0, 
              duration: 500, 
              useNativeDriver: true,
            }).start(() => {
              removeFromFavorites(movieTitle);
              const remainingMovies = movies.filter((movie) => movie.Title !== movieTitle);
              setMovies(remainingMovies);
              if (remainingMovies.length > 0) {
                setCurrentBackground(remainingMovies[0].Poster); 
              } else {
                setCurrentBackground(null); 
              }
              fadeAnim.setValue(1);
            });
          },
        },
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
    <ImageBackground 
      source={movies.length > 0 ? { uri: currentBackground } : null} 
      style={styles.background} 
      blurRadius={movies.length > 0 ? 10 : 0}
    >
      <View style={[styles.overlay, movies.length === 0 && styles.overlayDark]}>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : movies.length === 0 ? (
          <View style={styles.noFavoritesContainer}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <Text style={styles.noFavoritesText}>There's empty</Text>
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
                <Animated.View key={index} style={[styles.movieContainer, { opacity: fadeAnim }]}>
                  <Image source={{ uri: movie.Poster }} style={styles.poster} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.movieTitle}>{movie.Title}</Text>
                    <Text style={styles.movieYear}>{movie.Director}</Text>
                    <TouchableOpacity onPress={() => handleRemove(movie.Title)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete  </Text>
                      <Ionicons name="trash-outline" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>

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
    backgroundColor: "black", 
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayDark: {
    backgroundColor: "black", 
  },
  noFavoritesContainer: {
    alignItems: "center",
  },
  logo: {
    width: 100, 
    height: 100, 
    marginBottom: 20, 
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
    width: width * 0.64, 
    height: height * 0.50,
    borderRadius: 10,
    marginBottom: 10,
    objectFit: 'fill'
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
    borderRadius: 10,
    width: width * 0.64,
    justifyContent: 'center',
    marginTop: 20
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
  }
});
