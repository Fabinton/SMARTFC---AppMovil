import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import StackNavigator from "./StackNavigator";
import login from "./screen/containers/login";
import Registro from "./screen/containers/registerStudent";
import HeaderLogin from "./components/headerLogin";

const NotLogged = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ initialRouteName: "Login", gestureEnabled: false }}
    >
      <Stack.Screen
        name="Login"
        component={login}
        options={{ header: () => <HeaderLogin /> }}
      />
      <Stack.Screen
        name="Registro"
        component={Registro}
        options={{ header: () => <HeaderLogin /> }}
      />
    </Stack.Navigator>
  );
};

const NewAppNavigator = () => {
  const { loggedIn } = useSelector((state) => state.videos);
  return (
    <NavigationContainer>
      {loggedIn ? <StackNavigator /> : <NotLogged />}
    </NavigationContainer>
  );
};

export default NewAppNavigator;
