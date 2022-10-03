import { View, Animated, Image, Text } from "react-native";
import React, { useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import LogoSinFondo from "../../assets/images/LogoSinFondo.png";
import { SafeAreaView } from "react-native";

const SplashScreen = () => {
  const startAnimation = useRef(new Animated.Value(160)).current;
  useEffect(() => {
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(startAnimation, {
          toValue: -100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          ...styles.animated,
          transform: [{ translateY: startAnimation }],
        }}
      >
        <Image source={LogoSinFondo} style={styles.imageStyle}></Image>
        <Text style={styles.textStyle}> SmartFC</Text>
      </Animated.View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#4D4A95",
  },
  animated: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  textStyle: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});

export default SplashScreen;
