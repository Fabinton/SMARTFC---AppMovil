import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./CustomDrawer";
import Activity from "./containers/home_subject";
import Header from "./components/header";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Profile from "./screen/containers/Profile";
import Doubts from "./screen/containers/doubtsActivity";
import Home from "./containers/home";
import Configure from "./screen/containers/configure";
const Drawer = createDrawerNavigator();

const StackDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Mis cursos"
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
      />
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

export default StackDrawerNavigator;
