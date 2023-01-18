import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./screen/containers/Profile";
import Configure from "./screen/containers/configure";
import Login from "./screen/containers/login";
import Home from "./containers/home";
import Registro from "./screen/containers/registerStudent";
import Activity from "./containers/home_subject";
import HeaderLogin from "./components/headerLogin";
import Header from "./components/header";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./CustomDrawer";
import Doubts from "./screen/containers/doubtsActivity";
import ActivitySubj from "./containers/home_activity";
import SelectMoment from "./screen/containers/selectMoment";
import { Ionicons } from "@expo/vector-icons";
import HeaderReturn from "./components/headerReturn";
import DetailActivitySubj from "./screen/containers/detailActivity";
import PlayExcersise from "./screen/containers/playExcercise";
import EvalutionTest from "./screen/containers/EvalutionTest";
import PlayContent from "./screen/containers/playContent";
import GamificationTest from "./screen/containers/GamificationTest";
import ProgressBar from "./components/ProgressBar";
import contenido from "./screen/containers/contenido";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
import { MaterialIcons } from "@expo/vector-icons";

const DrawerNav = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Activities"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: "Roboto",
          fontSize: 15,
        },
        drawerActiveBackgroundColor: "#70C2E5",
        drawerActiveTintColor: "#333",
        drawerInactiveTintColor: "gray",
        drawerStyle: { width: 210 },
      }}
    >
      <Drawer.Screen
        name="Mi perfil"
        component={Profile}
        options={{
          drawerIcon: () => <Ionicons name="person" size={24} color="white" />,
          header: ({ navigation }) => (
            <Header {...navigation}>Mi Perfil</Header>
          ),
        }}
      />
      <Drawer.Screen
        name="Mis cursos"
        component={Activity}
        options={{
          header: ({ navigation }) => (
            <Header {...navigation}>Mis Cursos</Header>
          ),
          drawerIcon: () => (
            <Ionicons name="home-sharp" size={24} color="white" />
          ),
        }}
        initialParams={{}}
      />
      <Drawer.Screen
        name="Dudas"
        component={Doubts}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="question-answer" size={24} color="white" />
          ),
          header: ({ navigation }) => (
            <Header {...navigation}>Dudas Actividad</Header>
          ),
        }}
      />
      <Drawer.Screen
        name="Contenido REA"
        component={Home}
        options={{
          drawerIcon: () => (
            <MaterialIcons
              name="collections-bookmark"
              size={24}
              color="white"
            />
          ),
          header: ({ navigation }) => (
            <Header {...navigation}>Contenido rea</Header>
          ),
        }}
      />
      <Drawer.Screen
        name="Actualiza datos"
        component={Configure}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="list-alt" size={24} color="white" />
          ),
          header: ({ navigation }) => (
            <Header {...navigation}>Actualiza datos</Header>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const NewAppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ initialRouteName: "Login", gestureEnabled: false }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ header: () => <HeaderLogin /> }}
        />
        <Stack.Screen
          name="drawer"
          component={DrawerNav}
          options={{ header: () => null }}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{ header: () => <HeaderLogin /> }}
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
              <HeaderReturn {...navigation}>
                Visualiza tu contenido
              </HeaderReturn>
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
              <HeaderReturn {...navigation}>
                Visualiza el contenido
              </HeaderReturn>
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
    </NavigationContainer>
  );
};

export default NewAppNavigator;
