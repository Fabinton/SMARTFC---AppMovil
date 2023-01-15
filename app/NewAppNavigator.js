import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./screen/containers/Profile";
import Configure from "./screen/containers/configure";
import Login from "./screen/containers/login";
import contenido from "./screen/containers/contenido";
import Registro from "./screen/containers/registerStudent";
import Activity from "./containers/home_subject";
import HeaderLogin from "./components/headerLogin";
import Header from "./components/header";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./CustomDrawer";
import Doubts from "./screen/containers/doubtsActivity";
import { Ionicons } from "@expo/vector-icons";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
        name="Activities"
        component={Activity}
        options={{
          header: ({ navigation }) => (
            <Header {...navigation}>Mis Cursos</Header>
          ),
          drawerIcon: () => <Ionicons name="home-outline" size={22} />,
        }}
        initialParams={{}}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: () => <Ionicons name="person-outline" size={22} />,
          header: ({ navigation }) => (
            <Header {...navigation}>Mi Perfil</Header>
          ),
        }}
      />
      <Drawer.Screen
        name="Dudas Actividad"
        component={Doubts}
        options={{
          drawerIcon: () => <Ionicons name="help-outline" size={22} />,
          header: ({ navigation }) => (
            <Header {...navigation}>Dudas Actividad</Header>
          ),
        }}
      />
      <Drawer.Screen
        name="Actualiza datos"
        component={Configure}
        options={{
          drawerIcon: () => <Ionicons name="settings-outline" size={22} />,
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
          name="contenido"
          component={contenido}
          initialParams={{}}
        />
        <Stack.Screen
          name="drawer"
          component={DrawerNav}
          options={{ header: () => null }}
        />
        <Stack.Screen name="Registro" component={Registro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NewAppNavigator;
