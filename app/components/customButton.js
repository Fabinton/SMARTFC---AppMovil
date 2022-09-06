import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const customButton = ({
  text,
  onPress,
  textStyle = styles.buttonText,
  textTouchable = styles.touchableButtonSignIn,
}) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} style={textTouchable}>
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  touchableButtonSignIn: {
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: "#70C2E5",
    height: 50,
    width: 250,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
});

export default customButton;
