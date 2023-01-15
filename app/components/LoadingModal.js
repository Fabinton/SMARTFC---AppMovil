import { View, StyleSheet, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const LoadingModal = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView
        source={require("../../assets/spinner2.json")}
        imageAssetsFolder={"images"}
        autoPlay
        loop
        speed={1}
        duration={3000}
      />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 2,
  },
  loadingText: {
    color: "#36EBC3",
    marginTop: 10,
    fontSize: 18,
  },
});
export default LoadingModal;
