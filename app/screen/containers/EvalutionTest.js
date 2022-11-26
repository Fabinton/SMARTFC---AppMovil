import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import GamificationTest from "./GamificationTest";
import { NavigationActions } from "react-navigation";

const EvalutionTest = ({ navigation }) => {
  const [evaluationStep, setEvaluationStep] = useState(1);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % (35 + 1));
    }, 1000);
    if (index === 35) {
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
    <View>
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
  );
};

export default EvalutionTest;
