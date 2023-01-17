import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";

const Progress = ({ step, steps, height }) => {
  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(-1000)).current;
  const reactive = useRef(new Animated.Value(-1000)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 30,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    reactive.setValue(-width + (width * step) / steps);
  }, [width, step]);
  return (
    <>
      <View style={styles.textContainer}>
        <Text style={{ color: "#70C2E5" }}>Tiempo Restante</Text>
        <Text style={{ color: "#70C2E5" }}>
          {step}/{steps} Seg
        </Text>
      </View>

      <View
        style={{
          height,
          backgroundColor: "white",
          borderRadius: height,
          overflow: "hidden",
          marginHorizontal: 3,
        }}
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;
          setWidth(newWidth);
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height,
            left: 0,
            top: 0,
            borderRadius: height,
            backgroundColor: "#2A7E19",
            transform: [{ translateX: animatedValue }],
          }}
        />
      </View>
    </>
  );
};

const ProgressBar = ({ index }) => {
  return (
    <View>
      <StatusBar backgroundColor="#272D34" barStyle="light-content" />
      <SafeAreaView style={styles.statusBar} />
      <View style={styles.container}>
        <Progress step={index} steps={35} height={20} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: "#272D34",
    padding: 18,
    height: 60,
  },
  progressBar: {
    height: 20,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 5,
    overflow: "hidden",
  },
  statusBar: {
    paddingTop: 5,
    marginTop: 0,
    height: 0,
    backgroundColor: "#272D34",
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 3,
  },
});
export default ProgressBar;
