import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import GamificationTest from "./GamificationTest";
import { NavigationActions } from "react-navigation";
import { Stack } from "@react-native-material/core";
import CustomButton from "../../components/customButton";
import { useSelector } from "react-redux";

const EvalutionTest = ({ navigation }) => {
  const [evaluationStep, setEvaluationStep] = useState(0);
  const [index, setIndex] = useState(0);
  const [StartCounting, setStartCounting] = useState(false);
  const { selectedActivity } = useSelector((state) => state.videos);
  const test = useMemo(() => selectedActivity, [selectedActivity]);
  const alredyTested = false;
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

  function evaluationSelector(evaluationTest, questionActivity) {
    if (navigation?.state?.params?.toRender === 0) {
      return evaluationTest;
    } else {
      return questionActivity;
    }
  }
  const evaluation = [
    {
      question: evaluationSelector(test?.EQ1, test?.Q1),
      answers: [
        { res: evaluationSelector(test?.EA11, test?.A11), id: 1 },
        { res: evaluationSelector(test?.EA12, test?.A12), id: 2 },
        { res: evaluationSelector(test?.EA13, test?.A13), id: 3 },
        { res: evaluationSelector(test?.EA14, test?.A14), id: 4 },
      ],
      questionID: 1,
      step: 1,
    },
    {
      question: evaluationSelector(test?.EQ2, test?.Q2),
      answers: [
        { res: evaluationSelector(test?.EA21, test?.A21), id: 1 },
        { res: evaluationSelector(test?.EA22, test?.A22), id: 2 },
        {
          res: evaluationSelector(test?.EA23, test?.A23),
          id: 3,
        },
        { res: evaluationSelector(test?.EA24, test?.A24), id: 4 },
      ],
      questionID: 2,
      step: 2,
    },
    {
      question: evaluationSelector(test?.EQ3, test?.Q3),
      answers: [
        { res: evaluationSelector(test?.EA31, test?.A31), id: 1 },
        { res: evaluationSelector(test?.EA32, test?.A32), id: 2 },
        { res: evaluationSelector(test?.EA33, test?.A33), id: 3 },
        { res: evaluationSelector(test?.EA34, test?.A34), id: 4 },
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
