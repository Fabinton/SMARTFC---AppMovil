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
import { calculateTestGrade, saveEventsDB } from "../../../utils/parsers";

const GamificationTest = ({ navigation }) => {
  const [allAnswers, setAllAnswers] = useState({});
  const [evaScore, setEvaScore] = useState(0);
  const {
    setIndex,
    question,
    answers,
    setEvaluationStep,
    evaluationStep,
    index,
    evaluationType,
    IDstudent,
    IDactivity,
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
            saveEventsDB(
              //TODO: CHECK WHAT HAPPENS WHEN IT'S TEST (CALLING TWICE THIS FUNCTION)
              IDstudent,
              IDactivity,
              allAnswers,
              evaScore,
              evaluationType
            );
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
      (() => {
        answers?.map((ans) => setAllAnswers({ ...allAnswers, [ans.res]: 0 }));
        setEvaScore(evaScore + calculateTestGrade(0, 4, index, evaluationType));
      })();
    if (index === 35 && evaluationStep >= 3) {
      alertMessage();
    }
  }, [index]);

  const completedTest = () => {
    if (evaluationStep >= 3) {
      alertMessage();
    }
  };

  useEffect(() => {
    completedTest();
  }, [allAnswers]);

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
                  setAllAnswers({
                    ...allAnswers,
                    [ans.res]: ans.id,
                  });
                  const totalValue = calculateTestGrade(
                    ans.id,
                    ans.correctAns,
                    index,
                    evaluationType
                  );
                  setEvaScore(evaScore + totalValue);
                  setEvaluationStep(evaluationStep + 1);
                  setIndex(0);
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
