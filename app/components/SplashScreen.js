import { Animated, Image } from "react-native";
import React, { useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import LogoSinFondo from "../../assets/images/LogoSinFondo.png";
import SmartTitle from "../../assets/images/SmartFC.png";
import { SafeAreaView } from "react-native";
import { useDispatch } from "react-redux";

const SplashScreen = () => {
  const startAnimation = useRef(new Animated.Value(160)).current;
  const imagesScale = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(imagesScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(startAnimation, {
          toValue: -100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 50);
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 1300,
        useNativeDriver: true,
      }).start();
    }, 1800);
    dispatch({
      type: "SET_LOADING",
      payload: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{
          ...styles.animated,
          transform: [{ translateY: startAnimation }, { scale: imagesScale }],
          opacity: fadeAnimation,
        }}
      >
        <Image source={LogoSinFondo} style={styles.imageStyle} />
        <Image source={SmartTitle} style={styles.textStyle} />
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
    backgroundColor: "#F5F5F5",
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
    width: 350,
    height: 70,
  },
});

export default SplashScreen;
