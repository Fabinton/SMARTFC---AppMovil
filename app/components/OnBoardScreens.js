import { View, Text, Image } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import saludo from "../../assets/images/saludo.png";
import { Dimensions } from "react-native";

const OnBoardScreens = ({ setFirstLaunch }) => {
  return (
    <View
      style={{
        height: Dimensions.get("screen").height - 50,
        width: Dimensions.get("screen").width,
      }}
    >
      <Onboarding
        pages={[
          {
            backgroundColor: "#F5F5F5",
            image: <Image source={saludo} />,
            title: "Bienvenido",
            subtitle: "Este es un tutorial de como usar SmartFC",
          },
          {
            backgroundColor: "#F5F5F5",
            image: <Image source={saludo} />,
            title: "Primer Paso",
            subtitle:
              "Debes primero hacer la conexión de la Ip en conectar tu IP ",
          },
          {
            backgroundColor: "#F5F5F5",
            image: <Image source={saludo} />,
            title: "Segundo Paso",
            subtitle:
              "Debes registrar tu usuario en la aplicación, en el apartado de Registrate",
          },
          {
            backgroundColor: "#F5F5F5",
            image: <Image source={saludo} />,
            title: "Tercer Paso",
            subtitle:
              "El siguiente paso es presionar el botón Sincronizar datos de usuario y ya puedes iniciar sesión con tu usuario registrado!",
          },
        ]}
        onDone={() => {
          setFirstLaunch(false);
        }}
      />
    </View>
  );
};

export default OnBoardScreens;
