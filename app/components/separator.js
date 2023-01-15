import React from "react";
import { View, Text, StyleSheet } from "react-native";

function VerticalSeparator(props) {
  return (
    <View>
      <Text> </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  separator: {
    borderTopWidth: 1,
  },
});

export default VerticalSeparator;
