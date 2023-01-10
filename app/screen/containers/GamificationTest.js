import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  BackHandler,
  Alert,
} from "react-native";
import CustomButton from "../../components/customButton";
import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBar";
import { NavigationActions } from "react-navigation";
import { _DEFAULT_PROGRESS_UPDATE_INTERVAL_MILLIS } from "expo-av/build/AV";
import { calculateTestGrade, reduxAnswe } from "../../../utils/parsers";

const GamificationTest = ({ navigation }) => {
  const {
    setIndex,
    question,
    answers,
    setEvaluationStep,
    evaluationStep,
    index,
    evaluationType,
  } = navigation?.state?.params;
  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  const alertMessage = () => {
    return Alert.alert(
      "Felicitaciones.",
      "La evaluación ha sido completada.",
      [
        {
          text: "Ir a Mis materias.",
          onPress: () => {
            navigation.dispatch(
              NavigationActions.navigate({
                routeName: "Activity",
              })
            );
          },
        },
      ],
      { cancelable: false }
    );
  };
  useEffect(() => {
    index === 35 &&
      console.log("total", calculateTestGrade(0, 4, index, evaluationType));
    if (index === 35 && evaluationStep > 2) {
      alertMessage();
    }
  }, [index]);

  const completedTest = () => {
    if (evaluationStep > 2) {
      alertMessage();
    }
  };
  return (
    <View style={styles.viewContainer}>
      <View style={styles.questionAnswer}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question}</Text>
        </View>
        <View style={styles.answersContainer}>
          {answers?.map((ans) => (
            <View style={{ marginBottom: 5 }} key={ans.id}>
              <CustomButton
                text={ans.res}
                onPress={() => {
                  setEvaluationStep(evaluationStep + 1);
                  setIndex(0);
                  completedTest();
                  const totalValue = calculateTestGrade(
                    ans.id,
                    ans.correctAns,
                    index,
                    evaluationType
                  );
                  console.log("total", totalValue);
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

GamificationTest.navigationOptions = ({ navigation }) => {
  const { index } = navigation?.state?.params;
  return {
    header: <ProgressBar index={index ? index : 0} />,
  };
};

const styles = StyleSheet.create({
  viewContainer: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    backgroundColor: "#3E454D",
  },
  questionAnswer: {
    display: "flex",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "column",
  },
  questionContainer: {
    paddingHorizontal: 30,
    height: 180,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  answersContainer: {
    marginTop: 100,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    marginHorizontal: 55,
  },
  questionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#70C2E5",
  },
});

export default GamificationTest;
