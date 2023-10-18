import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HeaderLogin from "./components/headerLogin";
import HeaderReturn from "./components/headerReturn";
import StackDrawerNavigator from "./StackDrawerNavigator";
import ActivitySubj from "./containers/home_activity";
import SelectMoment from "./screen/containers/selectMoment";
import SelectRetroalimentacion from "./screen/containers/selectRetroalimentacion";
import DetailActivitySubj from "./screen/containers/detailActivity";
import PlayExcersise from "./screen/containers/playExcercise";
import EvalutionTest from "./screen/containers/EvalutionTest";
import QuizTest from "./screen/containers/QuizTest";
import PlayContent from "./screen/containers/playContent";
import RetroalimentacionEvaluationTest from "./screen/containers/RetroalimentacionEvaluationTest";
import RetroalimentacionQuizTest from "./screen/containers/RetroalimentacionQuizTest";
import GamificationTest from "./screen/containers/GamificationTest";
import GamificationEvaluation from "./screen/containers/GamificationEvaluation";
import DetailRetroalimentacionTaller from "./screen/containers/DetailRetroAlimentacionTaller";
import ProgressBar from "./components/ProgressBar";
import contenido from "./screen/containers/contenido";
import RatingStart from "./components/rating-start";
import RatingStartContenido from "./components/rating-start-contenido";
const Stack = createStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="drawer"
      screenOptions={{ initialRouteName: "drawer", gestureEnabled: false }}
    >
      <Stack.Screen
        name="drawer"
        component={StackDrawerNavigator}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="ActivitySubj"
        component={ActivitySubj}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>Mis Actividades</HeaderReturn>
          ),
        }}
      />
      <Stack.Screen
        name="SelectMoment"
        component={SelectMoment}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>Selecciona la etapa</HeaderReturn>
          ),
        }}
      />
      <Stack.Screen
        name="SelectRetroalimentacion"
        component={SelectRetroalimentacion}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>Selecciona la retroalimentación</HeaderReturn>
          ),
        }}
      />
      <Stack.Screen
        name="DetailActivitySubj"
        component={DetailActivitySubj}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>
              Descripción de tu actividad
            </HeaderReturn>
          ),
        }}
      />
      <Stack.Screen
        name="PlayExcersise"
        component={PlayExcersise}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>Visualiza tu contenido</HeaderReturn>
          ),
        }}
      />
      <Stack.Screen
        name="EvalutionTest"
        component={EvalutionTest}
        options={{
          header: ({ navigation }) => (
            <HeaderLogin showGoBack {...navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="QuizTest"
        component={QuizTest}
        options={{
          header: ({ navigation }) => (
            <HeaderLogin showGoBack {...navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="RatingStart"
        component={RatingStart}
        options={{
          header: ({ navigation }) => (
            <HeaderLogin showGoBack {...navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="RatingStartContenido"
        component={RatingStartContenido}
        options={{
          header: ({ navigation }) => (
            <HeaderLogin showGoBack {...navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="RetroalimentacionEvaluationTest"
        component={RetroalimentacionEvaluationTest}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>Retroalimentación Evaluación</HeaderReturn>
          ),
        }}
      />
      <Stack.Screen
        name="RetroalimentacionQuizTest"
        component={RetroalimentacionQuizTest}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>Retroalimentación Quiz</HeaderReturn>
          ),
        }}
      />
      <Stack.Screen
        name="PlayContent"
        component={PlayContent}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>Visualiza el contenido.</HeaderReturn>
          ),
        }}
      />
      <Stack.Screen
        name="GamificationTest"
        component={GamificationTest}
        options={{
          header: ({ route }) => {
            const { index } = route?.params;
            return <ProgressBar index={index ? index : 0} />;
          },
        }}
      />
      <Stack.Screen
        name="GamificationEvaluation"
        component={GamificationEvaluation}
        options={{
          header: ({ route }) => {
            const { index } = route?.params;
            return <ProgressBar index={index ? index : 0} />;
          },
        }}
      />
      <Stack.Screen
        name="Contenido"
        component={contenido}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>CONTENIDO</HeaderReturn>
          ),
        }}
      />
      <Stack.Screen
        name="DetailRetroalimentacionTaller"
        component={DetailRetroalimentacionTaller}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>Retroalimentación taller </HeaderReturn>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
