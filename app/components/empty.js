import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Stack, Flex, Spacer } from "@react-native-material/core";

function Empty(props) {
  return (
    <Stack
      style={styles.container}
      direction="column"
      alignItems="center"
      spacing={6}
    >
      <Text style={styles.text}>{props.text}</Text>
      <Spacer />
      <Image
        style={{
          width: 270,
          height: 270,
        }}
        source={require("../../assets/images/sad.png")}
      />
    </Stack>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    marginTop: 35,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default Empty;
