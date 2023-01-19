import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HeaderLogin from "./components/headerLogin";
import HeaderReturn from "./components/headerReturn";
import StackDrawerNavigator from "./StackDrawerNavigator";
import ActivitySubj from "./containers/home_activity";
import SelectMoment from "./screen/containers/selectMoment";
import DetailActivitySubj from "./screen/containers/detailActivity";
import PlayExcersise from "./screen/containers/playExcercise";
import EvalutionTest from "./screen/containers/EvalutionTest";
import PlayContent from "./screen/containers/playContent";
import GamificationTest from "./screen/containers/GamificationTest";
import ProgressBar from "./components/ProgressBar";
import contenido from "./screen/containers/contenido";
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
          header: () => <HeaderLogin />,
        }}
      />
      <Stack.Screen
        name="PlayContent"
        component={PlayContent}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>Visualiza el contenido</HeaderReturn>
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
        name="Contenido"
        component={contenido}
        options={{
          header: ({ navigation }) => (
            <HeaderReturn {...navigation}>CONTENIDO</HeaderReturn>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
