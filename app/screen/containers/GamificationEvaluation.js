import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    BackHandler,
    Alert,
    LogBox,
  } from "react-native";
  import CustomButton from "../../components/customButton";
  import { TextInput,ScrollView,Button } from 'react-native';
  import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
  import React, { useEffect, useState } from "react";
  import { calculateTestGrade, saveEventsDB } from "../../../utils/parsers";
  import { useDispatch } from "react-redux";
  import { Audio } from "expo-av";
  
  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  const GamificationEvaluation = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [allAnswers, setAllAnswers] = useState({});
    const [evaScore, setEvaScore] = useState(0);
    const [sound, setSound] = useState();
    const [clockSound, setClockSound] = useState();
    const {
      setIndex,
      question,
      answers,
      correct,
      setEvaluationStep,
      evaluationStep,
      index,
      evaluationType,
      IDstudent,
      IDactivity,
      internetConnection,
      selectedIPConfig,
      valorEvaluation,
    } = route?.params;

    // console.log("datas "+ route?.params.answers);
    // console.log("valor evaluation "+ route?.params.valorEvaluation);
    // console.log("datas "+ route?.params.evaluationType);
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
        "Felicitaciones. ",
        "La evaluación ha sido completada, Recuerda que si no tienes acceso a internet, debes sincronizar desde mis cursos en el futuro.",
        [
          {
            text: "Ir a Mis materias.",
            onPress: () => {
              saveEventsDB(
                IDstudent,
                IDactivity,
                allAnswers,
                evaScore,
                evaluationType,
                internetConnection,
                selectedIPConfig,
                dispatch,
                navigation
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
      if (index === 35 && evaluationStep >= valorEvaluation) {
        alertMessage();
      }
      if (index === 28) playClockSound();
    }, [index]);
  
    const completedTest = () => {
      if (evaluationStep >= valorEvaluation) {
        alertMessage();
      }
    };
  
    useEffect(() => {
      completedTest();
    }, [allAnswers]);
  
    async function playButtonSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/sounds/buttonClick.mp3")
      );
      setSound(sound);
      await sound.playAsync();
    }
    async function playClockSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/sounds/clock-ticking.mp3")
      );
      setClockSound(sound);
      await sound.playAsync();
    }
    useEffect(() => {
      return sound
        ? () => {
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);
    useEffect(() => {
      return clockSound
        ? () => {
            clockSound.unloadAsync();
          }
        : undefined;
    }, [clockSound]);
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
                text={ans.question}
                onPress={() => {
                  playButtonSound();
                  clockSound && clockSound.unloadAsync();
                  setAllAnswers({
                    ...allAnswers,
                    [`  ${ans.question}` + ans.question]: ans.id, //to prevent automatic sort of javascript it key its a number.
                  });
                  const totalValue = calculateTestGrade(
                    ans.id,
                    correct,
                    index,
                    evaluationType
                  );
                  console.log("Calificacion " + totalValue);
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

    //validar 
  };
  
  const styles = StyleSheet.create({
    viewContainer: {
      height: Dimensions.get("screen").height,
      width: Dimensions.get("screen").width,
      backgroundColor: "#3E454D",
    },
    container: {
      marginLeft: 15,
      marginRight: 15,
      flex: 1
    },
    answersContainer: {
      marginTop: 100,
      marginBottom: 20,
      display: "flex",
      flexDirection: "column",
      marginHorizontal: 55,
    },
    questionContainer: {
      paddingHorizontal: 30,
      height: 180,
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
    },
    input: {
      width: "90%",
      height: 100,
      backgroundColor: "#f1f1f1",
      borderRadius: 12,
    },
    questionText: {
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 10,
      marginBottom: 10,
    },
    buttonstyle: {
      padding: 20,
      margin: 20,
      paddingTop: 20,
      marginTop: 30,
    },
  });
  
  export default GamificationEvaluation;
  