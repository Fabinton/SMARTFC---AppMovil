import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState, useEffect } from "react";
import GamificationTest from "./GamificationTest";
import { NavigationActions } from "react-navigation";
import { Stack, Flex, Spacer } from "@react-native-material/core";
import CustomButton from "../../components/customButton";

const EvalutionTest = ({ navigation }) => {
  const [evaluationStep, setEvaluationStep] = useState(0);
  const [index, setIndex] = useState(0);
  const [StartCounting, setStartCounting] = useState(false);
  alredyTested = true;
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % (35 + 1));
    }, 1000);
    if (StartCounting && index === 35) {
      setTimeout(() => {
        setEvaluationStep(evaluationStep + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [index]);
  const evaluation = [
    {
      question: "¿ Por qué la novia es tan linda ? ",
      answers: [
        { res: "Su hermosa sonrisa", id: 1 },
        { res: "Su perfectas piernas", id: 2 },
        { res: "Su preciosa espalda", id: 3 },
        { res: "Su buen poto", id: 4 },
      ],
      questionID: 1,
      step: 1,
    },
    {
      question: "¿ Por qué la novia es la mejor ? ",
      answers: [
        { res: "Porque es brillante", id: 1 },
        { res: "Demasiado inteligente", id: 2 },
        { res: "Porque quiere mucho a Santiago", id: 3 },
        { res: "Su buen poto :3", id: 4 },
      ],
      questionID: 2,
      step: 2,
    },
    {
      question: "Who has not won multiple Oscars for best actor ? ",
      answers: [
        { res: "Leonardo DiCaprio", id: 1 },
        { res: "Tom Hanks", id: 2 },
        { res: "Jack Nicholson", id: 3 },
        { res: "Dustin Hoffman", id: 4 },
      ],
      questionID: 3,
      step: 3,
    },
  ];
  return (
    <>
      {alredyTested ? (
        <View>
          <Stack
            style={styles.container}
            direction="column"
            alignItems="center"
          >
            <Text style={styles.text}>¡Oh no!</Text>
            <Text style={styles.text2}>
              Parece que ya respondiste la evaluación, recuerda que sólo puedes
              responderla una única vez.
            </Text>
            <Image
              style={{
                width: 320,
                height: 350,
                marginTop: 40,
              }}
              source={require("../../../assets/images/sad.png")}
            />
          </Stack>
        </View>
      ) : (
        <View>
          <Stack
            style={styles.container}
            direction="column"
            alignItems="center"
          >
            <Text style={styles.text}>Instrucciones:</Text>
            <Text style={styles.text2}>
              1. Podrás realizar la evaluación solo una vez {"\n"}
              {"\n"}
              2. Selecciona una única respuesta {"\n"}
              {"\n"}
              3. El resultado estará basado en si la respuesta es correcta o no
              y en el tiempo que tomes en responder {"\n"}
            </Text>
            <CustomButton
              text="Jugar"
              onPress={() => {
                setEvaluationStep(1);
                setStartCounting(true);
                setIndex(0);
              }}
            />
            <Image
              style={{
                width: 320,
                height: 350,
                position: "absolute",
                top: "110%",
              }}
              source={require("../../../assets/images/expTest.jpg")}
            />
          </Stack>
          {evaluation?.map((eva) => {
            if (evaluationStep === eva.step) {
              navigation.dispatch(
                NavigationActions.navigate({
                  routeName: "GamificationTest",
                  params: {
                    question: eva.question,
                    answers: eva.answers,
                    setEvaluationStep: setEvaluationStep,
                    evaluationStep: evaluationStep,
                    index: index,
                    setIndex: setIndex,
                  },
                })
              );
            }
          })}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  text2: {
    paddingTop: 20,
    fontSize: 20,
    textAlign: "center",
    color: "#6D6E6E",
  },
});

export default EvalutionTest;
