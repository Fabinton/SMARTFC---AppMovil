import { View, Image } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import saludo from "../../assets/images/saludo.png";
import robotPregunta from "../../assets/images/robotPregunta.png";
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
            image: (
              <Image source={saludo} style={{ width: 300, height: 390 }} />
            ),
            title: "Bienvenido",
            subtitle:
              "Este es un pequeño tutorial que te enseñará a usar SmartFC.",
          },
          {
            backgroundColor: "#F5F5F5",
            image: <Image source={robotPregunta} />,
            title: "Primer Paso",
            subtitle:
              "Debes primero hacer la conexión de la Ip en conectar tu IP. ",
          },
          {
            backgroundColor: "#F5F5F5",
            image: (
              <Image source={saludo} style={{ width: 300, height: 390 }} />
            ),
            title: "Segundo Paso",
            subtitle:
              "Debes registrar tu usuario en la aplicación, en el apartado de Regístrate.",
          },
          {
            backgroundColor: "#F5F5F5",
            image: <Image source={robotPregunta} style={{ marginTop: 20 }} />,
            title: "Último Paso",
            subtitle:
              "El siguiente paso es presionar el botón Sincronizar datos de usuario y ya puedes iniciar sesión con tu usuario registrado!",
          },
        ]}
        onDone={() => {
          setFirstLaunch(false);
        }}
        showSkip={false}
        bottomBarColor={"#F5F5F5"}
        titleStyles={{ color: "#70C2E5", fontSize: 33 }}
        subTitleStyles={{ color: "#424B5B", fontSize: 20 }}
      />
    </View>
  );
};

export default OnBoardScreens;
