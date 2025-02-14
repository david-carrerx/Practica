import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, ImageBackground, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchMovie, addToFavorites } from "./hooks/useMovies";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
    const [searchTerm, setSearchTerm] = useState("");
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setMovie(null);
        const data = await fetchMovie(searchTerm);
    
        setTimeout(() => {
            setMovie(data);
            setLoading(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }, 1000); 
    };

    const handleHideMovie = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setMovie(null);
        });
    };

    const handleAddToFavorites = (movie) => {
        addToFavorites(movie);
        handleHideMovie();
    };

    return (
        <ImageBackground source={require("../assets/wallpaper.jpg")} style={styles.background}>
            <View style={[styles.overlay, { backgroundColor: movie ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.78)" }]} /> 
            <View style={styles.container}>
                {!movie && !loading ? (
                    <>
                        <Image source={require("../assets/logo.png")} style={styles.logo} />
                        <Text style={styles.title}>CINEMA PARADISO</Text> 
                        <Text style={styles.subtitle}>Search four favorites movies</Text> 
                        <TextInput placeholder="Search a movie..." value={searchTerm} onChangeText={setSearchTerm} style={styles.input} placeholderTextColor="#bbb"/>
                        <TouchableOpacity onPress={handleSearch} style={styles.button}>
                            <Text style={styles.buttonText}>Search  </Text>
                            <Ionicons name="search" size={24} color="white" />
                        </TouchableOpacity>
                    </>
                ) : null}
                
                {loading && <ActivityIndicator size="large" color="#FFA500" style={styles.loader} />}
                {movie && !loading && (
                    <Animated.View style={[styles.movieContainer, { opacity: fadeAnim }]}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            {movie?.Poster && movie.Poster !== "N/A" ? (
                                <View style={{ position: "relative", width: "100%" }}>
                                    <ImageBackground source={{ uri: movie.Poster }} style={styles.poster} imageStyle={{ blurRadius: 10 }}>
                                        <LinearGradient colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]} style={styles.gradientOverlayTop} />
                                        <LinearGradient colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]} style={styles.gradientOverlayBottom} />
                                    </ImageBackground>
                                </View>
                            ) : (
                                <Text style={styles.noImage}>Imagen no disponible</Text>
                            )}
                            <View style={styles.infoContainer}>
                                <Text style={styles.movieTitle}>{movie?.Title}</Text>
                                <Text style={styles.details}>Year: {movie?.Year}</Text>
                                <Text style={styles.details}>Genre: {movie?.Genre}</Text>
                                <Text style={styles.details}>Directed by: {movie?.Director}</Text>
                                <Text style={styles.plot}>{movie?.Plot}</Text>
                            </View>

                            <TouchableOpacity onPress={() => handleAddToFavorites(movie)} style={styles.favButton}>
                                <Text style={styles.favButtonText}>Add to favorites  </Text>
                                <Ionicons name="heart-outline" size={24} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleHideMovie} style={styles.backButton}>
                                <Text style={styles.backButtonText}>Back  </Text>
                                <Ionicons name="arrow-forward-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </ScrollView>
                    </Animated.View>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject
    }, 
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: '900',
        marginBottom: 10
    },
    subtitle: { 
        fontSize: 18,
        color: "white",
        fontWeight: 'bold',
        marginBottom: 10
    }, 
    gradientOverlayTop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 30,
        zIndex: 1
    },
    gradientOverlayBottom: {
        position: "absolute",
        bottom: 0, 
        left: 0,
        right: 0,
        height: 20,
        zIndex: 1 
    },
    input: {
        width: "80%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 8,
        color: "white",
        marginBottom: 10,
        backgroundColor: "#333"
    },
    button: { 
        width: '80%', 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#FFA500", 
        padding: 10, 
        borderRadius: 8, 
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8
    },
    scrollContainer: {
        alignItems: "center",
        paddingTop: 20
    },
    poster: {
        width: '100%',
        height: 450,
        marginBottom: 20,
        marginTop: 20,
        resizeMode: 'cover'
    },
    noImage: { 
        color: "white",
        fontSize: 18
    },
    infoContainer: {
        width: "100%",
        alignItems: "flex-start",
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 20,
        borderRadius: 10
    },
    movieTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
        marginTop: -20
    },
    details: {
        fontSize: 16,
        color: "#bbb",
        marginBottom: 5,
        textAlign: "left"
    },
    plot: {
        fontSize: 14,
        color: "white",
        textAlign: "justify",
        marginTop: 10
    },
    favButton: {
        width: '90%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFA500",
        padding: 10,
        borderRadius: 8,
        marginTop: 20
    },
    favButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8
    },
    backButton: {
        width: '90%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFA500",
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 30
    },
    backButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8
    },
    loader: {
        position: "absolute",
        top: "50%"
    },
    movieContainer: {
        width: "100%",
        alignItems: "center"
    }
});
