import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, HStack, VStack } from "react-native-flex-layout";
import * as Progress from "react-native-progress";

function Suggestion(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.container}>
        <View style={styles.right}>
          <Text style={styles.title}>{props.nombre_actividad}</Text>
          <HStack m={4} spacing={6}>
            <View>
              <Text style={styles.teacher}>Nota Quiz: {props.nota}</Text>
              <Text style={styles.teacher}>
                Nota Evaluación*: {props.notaEvaluation}
              </Text>
              <Text style={styles.teacher}>
                Nota Actividad: {props.totalNota}
              </Text>
            </View>
            <Text style={styles.puntaje}>{props.totalScore}</Text>
          </HStack>
          <Progress.Bar
            progress={props.progresso}
            width={310}
            height={12}
            color={props.progresso === 1 ? "#70C2E5" : "rgba(0,0,0,0.3)"}
          />
          <Text style={styles.curso}></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    shadowColor: "#70C2E5",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  cover: {
    marginTop: 10,
    height: 100,
    width: 100,
    resizeMode: "cover",
    borderRadius: 5,
    overflow: "hidden",
  },
  puntaje: {
    position: "absolute",
    right: 0,
    fontSize: 30,
    color: "#70C2E5",
    fontWeight: "bold",
  },
  right: {
    paddingLeft: 10,
    justifyContent: "space-between",
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    color: "#44546b",
    fontWeight: "bold",
    width: 300,
    marginBottom: 10,
  },
  curso: {
    fontSize: 11,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  teacher: {
    fontSize: 14,
    color: "#6b6b6b",
    marginBottom: 10,
  },
  progressBarF: {
    height: 10,
  },
});
export default Suggestion;
