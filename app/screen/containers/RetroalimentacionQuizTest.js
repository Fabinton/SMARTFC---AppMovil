import React, { useState, useEffect, useMemo } from "react";
import { Stack } from "@react-native-material/core";
import CustomButton from "../../components/customButton";
import { useSelector } from "react-redux";
import { createEvaluation, createQuiz } from "../../../utils/parsers";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ScrollView,
  BackHandler,
  Alert,
  LogBox,
} from "react-native";
const RetroalimentacionQuizTest = ({ navigation, route }) => {
  const [quizStep, setQuizStep] = useState(0);
  const [index, setIndex] = useState(0);
  const [StartCounting, setStartCounting] = useState(false);
  const { selectedActivity, selectedStudent, selectedIPConfig } = useSelector(
    (state) => state.videos
  );
  const { isConnected } = useSelector((state) => state.connection);
  const test = useMemo(() => selectedActivity, [selectedActivity]);
  const student = useMemo(() => selectedStudent, [selectedStudent]);
  const connection = useMemo(() => isConnected, [isConnected]);
  const alredyTested = false;
  const evaluationType = route?.params?.toRender === 0 ? true : false;
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % (35 + 1));
    }, 1000);
    if (StartCounting && index === 35) {
      setTimeout(() => {
        setQuizStep(quizStep + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [index]);
  const { quiz } = createQuiz(test, evaluationType);

  return (
    <ScrollView style={styles.viewContainer}>
      {quiz?.map((eva, index) => (
        <View key={`${eva.questionID}-${index}`} style={styles.questionContainer}>
          <Text style={styles.questionText}>{"Pregunta : " + eva.question}</Text>
          {eva.answers.map((answer, answerIndex) => (
            <View key={`${eva.questionID}-${index}-${answer.id}-${answerIndex}`} style={styles.answersContainer}>
              <View style={styles.answerContent}> 
                <Text style={answer.id === eva.correct ? styles.correctAnswerText : styles.answerText}>
                  {answer.id + ". "}
                  {answer.question}
                </Text>
                {answer.id === eva.correct && (
                  <Image source={require("../../../assets/images/check.png")} style={styles.checkImage} />
                )}
              </View>
            </View>
          ))}
          
            <Text style={styles.correctAnswerRetroText}>{"Retroalimentación : "+eva.retro}</Text>
          {/* {eva.correct && (
                <Text style={styles.correctAnswerText}>{"Respuesta correcta : "+eva.correct}</Text>
              )} */}
        </View>
      ))}   
    </ScrollView>
  );
  };
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"></link>
  const styles = StyleSheet.create({
    viewContainer: {
      flex: 1,
      backgroundColor: "#F5F5F5", // Fondo más atractivo
      paddingVertical: 15, // Agregamos espacio arriba y abajo
    },
    questionContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.80,
      shadowRadius: 3.90,
      elevation: 30, // Sombra para resaltar el contenedor
    },
    answersContainer: {
      marginTop: 10,
      flexDirection: "column",
      borderColor: "blue",
    },
    questionText: {
      textAlign: "center",
      fontSize: 20, // Fuente más grande para las preguntas
      color: "#1E88E5", 
      marginBottom: 10, 
      fontWeight: "600",
    },
    answerText: {
      textAlign: "center",
      fontSize: 16,
      color: "#424242", // Color más oscuro para las respuestas
      marginVertical: 6, // Agregamos espacio vertical entre respuestas
    },
    correctAnswerText: {
      textAlign: "center",
      fontSize: 18,
      color: "#43A047", // Color verde más intenso
      marginTop: 5,
    },
    correctAnswerRetroText: {
      marginVertical: 8, 
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 3,
      borderColor: '#43A047', // Borde verde para retroalimentación
      borderRadius: 10,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000', // Color para el texto de retroalimentación
    },
    answerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center", // Centrar horizontalmente las respuestas
    },
    checkImage: {
      width: 24,
      height: 24,
      resizeMode: "contain",
      marginLeft: 10, // Más espacio entre el texto de la respuesta y la imagen de check
    },
  });
  
  export default RetroalimentacionQuizTest;