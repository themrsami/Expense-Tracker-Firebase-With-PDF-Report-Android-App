import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View style={styles.container}>
      {/* Background with light colors */}
      <View style={styles.background} />

      {/* Content Overlay */}
      <View style={styles.overlay}>
        <View style={styles.headings}>
          <Text style={styles.heading}>Track Your Expenses</Text>
          <Text style={styles.subheading}>
            Keep your expenses in check with our simple app
          </Text>
        </View>

        {/* Sign Up Button */}
        <Link href="/signup" style={styles.signup}>
          Signup
        </Link>

        {/* Login Button */}
        <Link href="/login" style={styles.login}>
          Login
        </Link>

        {/* Sign Up with Google Button */}
        <TouchableOpacity style={styles.googleButton}>
          <Icon name="google" size={20} color="#4A4A4A" style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Sign Up with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light background
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#e0e0e0", // Slightly darker light background
    opacity: 0.1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  headings: {
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#333", // Dark background for the heading
    padding: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff", // Light text for contrast
    textAlign: "center",
    // animation: "fadeIn 1s ease-in-out", // Animation for heading
  },
  subheading: {
    fontSize: 18,
    color: "#ddd", // Lighter gray for subheading
    marginTop: 10,
    textAlign: "center",
  },
  signup: {
    backgroundColor: "#ffffff", // White background for button
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 10,
    elevation: 2, // Subtle shadow for depth
  },
  login: {
    backgroundColor: "#4A90E2", // Soft blue color for login button
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#ffffff", // White for contrast
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    elevation: 2, // Subtle shadow for depth
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: "#4A4A4A", // Dark gray text on Google button
    fontSize: 18,
    fontWeight: "600",
  },
});


export default Home;
