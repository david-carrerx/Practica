import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';

export default function FavoritesScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      setLoading(true);
      const movieTitles = ['Inception', 'Titanic', 'Avatar', 'The Dark Knight', 'Interstellar', 'Fight Club'];
      const randomMovies = [];

      for (let i = 0; i < 3; i++) {
        const randomTitle = movieTitles[Math.floor(Math.random() * movieTitles.length)];
        const response = await fetch(`https://www.omdbapi.com/?apikey=669a7313&t=${randomTitle}`);
        const data = await response.json();
        randomMovies.push(data);
      }

      setMovies(randomMovies);
      setLoading(false);
    };

    fetchRandomMovies();
  }, []);

  return (
    <ImageBackground source={require('../assets/wallpaper.jpg')}>
      <View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {movies.map((movie, index) => (
              <View key={index}>
                <Image source={{ uri: movie.Poster }} />
                <View>
                  <Text>{movie.Title}</Text>
                  <Text>{movie.Year}</Text>
                  <TouchableOpacity>
                    <Text>Ver detalles</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}
