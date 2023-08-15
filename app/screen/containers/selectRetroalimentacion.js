import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Alert } from "react-native";
import { connect } from "react-redux";
import HeaderReturn from "../../components/headerReturn";
import CustomButton from "../../components/customButton";
import { Stack, Flex, Spacer } from "@react-native-material/core";
import { getLocalEventsByStudent } from "../../../utils/parsers";

class selectRetroalimentacion extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          Selecciona la etapa
        </HeaderReturn>
      ),
    };
  };

  retroalimentacionQuiz() {
    this.props.navigation.navigate({
      name: "RetroalimentacionQuizTest",
    });
  }

  
  retroalimentacionTaller() {
    if (this.props.activity.taller == 1) {
      this.props.navigation.navigate({
        name: "DetailRetroalimentacionTaller",
      });
    } else {
      Alert.alert(
        "La retroalimentacion no esta disponible",
        "El retroalimentacion no esta disponible en este momento",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
    }
  }

  async retroalimentacionEvaluacion() {
    const localEvents = await getLocalEventsByStudent(
      this.props.student.id_estudiante,
      this.props.activity.id_actividad
    );
    const lastEvent = localEvents?.reverse();
    if (this.props.activity.evaluacion == 1 ) {
      this.props.navigation.navigate({
        name: "RetroalimentacionEvaluationTest",
        params: { toRender: 0 },
      });
    } else {
      Alert.alert(
        "Evaluacion",
        "La evaluación no esta disponible en este momento",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
    }
  }
  render() {
    return (
      <Stack
        style={styles.container}
        direction="column"
        alignItems="stretch"
        spacing={6}
      >
        <View style={styles.box0}>
          <Text style={styles.textActivity}>
            {this.props.activity.titulo_actividad}
          </Text>
          <Spacer />
          <Flex inline center>
            <Text style={styles.textSelected}>
              Selecciona {"\n"} una etapa de {"\n"} retroalimentación {"\n"}para {"\n"}continuar
            </Text>
            <Image
              style={{
                width: 200,
                height: 250,
              }}
              source={require("../../../assets/images/saludo.png")}
            />
          </Flex>
          <Spacer />
          <CustomButton
            text="Retroalimentación Quiz"
            onPress={() => this.retroalimentacionQuiz()}
          />
          <Spacer />
          <CustomButton
            text="Retroalimentación Taller"
            onPress={() => this.retroalimentacionTaller()}
          />
          <Spacer />
          <CustomButton
            text="Retroalimentación Evaluación"
            onPress={() => this.retroalimentacionEvaluacion()}
          />
          <Spacer />
        </View>
      </Stack>
    );
  }
}
const styles = StyleSheet.create({
  dialogo: {
    position: "absolute",
    width: 270,
    height: 270,
    top: "20%",
    left: "0%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C2C2C",
    borderColor: "black",
  },
  box0: {
    flex: 11,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  textSelected: {
    marginLeft: 50,
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C2C2C",
    textAlign: "center",
  },
  textActivity: {
    marginTop: 35,
    fontSize: 25,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
});

function mapStateToProps(state) {
  return {
    student: state.videos.selectedStudent,
    activity: state.videos.selectedActivity,
    ipconfig: state.videos.selectedIPConfig,
  };
}
export default connect(mapStateToProps)(selectRetroalimentacion);
