import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Alert } from "react-native";
import { connect } from "react-redux";
import HeaderReturn from "../../components/headerReturn";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationActions } from "react-navigation";
import QuestionActiviy from "../../components/QuestionActivity";
import CustomButton from "../../components/customButton";
import { Stack, TextInput, Flex, Spacer } from "@react-native-material/core";

class selectMoment extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          Selecciona la etapa
        </HeaderReturn>
      ),
    };
  };
  state = {
    storage: null,
  };

  detailActivity() {
    this.props.dispatch({
      type: "SET_SELECT_ACTIVITIES_SUBJECT_LIST",
      payload: {
        activity: this.props.activity,
      },
    });
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: "DetailActivitySubj",
      })
    );
  }
  excersiceActivity() {
    if (this.props.activity.taller == 1) {
      this.props.dispatch({
        type: "SET_SELECT_ACTIVITIES_SUBJECT_LIST",
        payload: {
          activity: this.props.activity,
        },
      });
      this.props.dispatch(
        NavigationActions.navigate({
          routeName: "PlayExcersise",
        })
      );
    } else {
      Alert.alert(
        "Talller",
        "El taller no esta disponible en este momento",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }
  }

  evaluationActivity() {
    if (this.props.activity.evaluacion == 1) {
      this.props.dispatch({
        type: "SET_SELECT_ACTIVITIES_SUBJECT_LIST",
        payload: {
          activity: this.props.activity,
        },
      });
      this.props.dispatch(
        NavigationActions.navigate({
          routeName: "EvaluationActivity",
        })
      );
    } else {
      Alert.alert(
        "Evaluacion",
        "La evaluación no esta disponible en este momento",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    console.log(this.props.activity);
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
          <Flex inline center>
            <Text style={styles.textSelected}>
              Selecciona {"\n"} una etapa {"\n"}para {"\n"}continuar
            </Text>
            <Image
              style={{
                width: 250,
                height: 300,
              }}
              source={require("../../../assets/images/saludo.png")}
            />
          </Flex>
          <CustomButton
            text="PRACTICA EN CASA"
            onPress={() => this.detailActivity()}
          />
          <View style={{ marginTop: 20 }}></View>
          <CustomButton
            text="PRACTICA EN CLASE"
            onPress={() => this.excersiceActivity()}
          />
          <View style={{ marginTop: 20 }}></View>
          <CustomButton
            text="REALIZA TU EXAMEN"
            onPress={() => this.evaluationActivity()}
          />
        </View>
        <QuestionActiviy
          style={{ position: "absolute", top: "90%", left: "-17%" }}
        />
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
    textShadowColor: "#36EBC3",
    textShadowRadius: 30,
  },
});

function mapStateToProps(state) {
  return {
    student: state.videos.selectedStudent,
    activity: state.videos.selectedActivity,
    ipconfig: state.videos.selectedIPConfig,
  };
}
export default connect(mapStateToProps)(selectMoment);
