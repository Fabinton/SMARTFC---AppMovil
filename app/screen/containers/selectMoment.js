import React, { Component } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { connect } from "react-redux";
import HeaderReturn from "../../components/headerReturn";
import { NavigationActions } from "react-navigation";
import QuestionActiviy from "../../components/QuestionActivity";
import CustomButton from "../../components/customButton";

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

  detailActivity() {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: "DetailActivitySubj",
      })
    );
  }
  excersiceActivity() {
    if (this.props.activity.taller == 1) {
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
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
    }
  }

  evaluationActivity() {
    if (this.props.activity.evaluacion == 1) {
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
      <View style={styles.container}>
        <View style={styles.box0}>
          <Text style={styles.textActivity}>
            {this.props.activity.titulo_actividad}
          </Text>
          <Text style={styles.textSelected}>
            Selecciona una etapa para continuar:{" "}
          </Text>
          <View style={{ marginTop: 20 }}></View>
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
      </View>
    );
  }
}
const styles = StyleSheet.create({
  box0: {
    flex: 11,
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  textSelected: {
    marginTop: 20,
    marginBottom: 25,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C2C2C",
  },
  textActivity: {
    marginTop: 35,
    fontSize: 20,
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
export default connect(mapStateToProps)(selectMoment);
