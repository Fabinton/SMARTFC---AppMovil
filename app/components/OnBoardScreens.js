import { View, Image, Dimensions, Text } from "react-native";
import React, { useState } from "react";
import Onboarding from "react-native-onboarding-swiper";
import imagen from "../../assets/images/f5f5f5.png";
import uno from "../../assets/images/uno.png";
import sincronizar from "../../assets/images/sincronizar.png";
import registrate from "../../assets/images/registrate.png";
import CustomButton from "./customButton";
import ConnectIp from "./ConnectIp";

const OnBoardScreens = ({ setFirstLaunch }) => {
  const [modalVisible, setModalVisible] = useState(false);

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
            image: <Image source={uno} style={{ width: 295, height: 501 }} />,
            title: "Bienvenid@!",
            subtitle:
              "Este es un pequeño tutorial que te enseñará a usar Smart FC",
          },
          {
            backgroundColor: "#F5F5F5",
            image: <Image source={imagen} style={{ height: 5, width: 5 }} />,
            title: "Primer paso",
            subtitle: (
              <>
                <CustomButton
                  text={"Conectar IP"}
                  onPress={() => setModalVisible(!modalVisible)}
                />
                <Text
                  style={{
                    color: "#424B5B",
                    textAlign: "center",
                    fontSize: 18,
                    marginRight: 15,
                    marginLeft: 15,
                    marginTop: 20,
                  }}
                >
                  Ingresa la IP para conectarte al servidor del colegio, de lo
                  contrario puedes hacerlo más adelante en "Conectar tu Ip".
                  Esto se hace sólo la primera vez que se usa la app.
                </Text>
                <ConnectIp
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                />
              </>
            ),
          },
          {
            backgroundColor: "#F5F5F5",
            image: (
              <Image source={registrate} style={{ height: 220, width: 284 }} />
            ),
            title: "Segundo paso",
            subtitle:
              "Si no tienes un usuario debes registrarte en la aplicación con tus datos, en el apartado de Regístrate.",
          },
          {
            backgroundColor: "#F5F5F5",
            image: (
              <Image source={sincronizar} style={{ height: 220, width: 300 }} />
            ),
            title: "Último Paso",
            subtitle:
              "Presiona el botón Sincronizar datos de usuario, ingresa tus datos y podrás iniciar sesión con tu usuario registrado!",
          },
        ]}
        onDone={() => {
          setFirstLaunch(false);
        }}
        showSkip={false}
        bottomBarColor={"#F5F5F5"}
        titleStyles={{ color: "#70C2E5", fontSize: 33, fontWeight: "bold" }}
        subTitleStyles={{ color: "#424B5B", fontSize: 20 }}
        nextLabel="-->"
      />
    </View>
  );
};

export default OnBoardScreens;
