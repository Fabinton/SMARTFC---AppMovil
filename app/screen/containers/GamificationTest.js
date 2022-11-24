import { View, Text, StyleSheet, Dimensions } from "react-native";
import CustomButton from "../../components/customButton";
import React from "react";
import ProgressBar from "../../components/ProgressBar";

const GamificationTest = ({ navigation }) => {
  const question = navigation?.state?.params?.question;
  const answers = navigation?.state?.params?.answers;
  return (
    <View style={styles.viewContainer}>
      <View style={styles.questionAnswer}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question}</Text>
        </View>
        <View style={styles.answersContainer}>
          {answers?.map((ans) => (
            <View style={{ marginBottom: 5 }} key={ans.id}>
              <CustomButton text={ans.res} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

GamificationTest.navigationOptions = (navigation) => {
  return {
    header: <ProgressBar />,
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
