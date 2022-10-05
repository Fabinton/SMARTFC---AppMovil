import { View, Image, Dimensions, Text } from "react-native";
import React, { useState } from "react";
import Onboarding from "react-native-onboarding-swiper";
import saludo from "../../assets/images/saludo.png";
import uno from "../../assets/images/uno.png";
import robotPregunta from "../../assets/images/robotPregunta.png";
import CustomButton from "./customButton";
import ConnectIp from "./ConnectIp";

const OnBoardScreens = ({ setFirstLaunch }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      style={{
        height: Dimensions.get("screen").height - 40,
        width: Dimensions.get("screen").width,
      }}
    >
      <Onboarding
        pages={[
          {
            backgroundColor: "#F5F5F5",
            image: <Image source={uno} style={{ width: 196, height: 333 }} />,
            title: "Bienvenid@!",
            subtitle:
              "Este es un pequeño tutorial que te enseñará a usar SmartFC.",
          },
          {
            backgroundColor: "#F5F5F5",
            image: <Image source={robotPregunta} style={{ height: 320 }} />,
            title: "Primer Paso",
            subtitle: (
              <>
                <CustomButton
                  text={"Conectar IP"}
                  onPress={() => setModalVisible(!modalVisible)}
                />
                <Text
                  style={{
                    color: "#424B5B",
                    textAlign: "justify",
                    marginRight: 15,
                    marginLeft: 15,
                    marginTop: 20,
                  }}
                >
                  Si deseas puedes conectar tu Ip, de lo contrario puedes
                  hacerlo más adelante en conectar tu Ip
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
        titleStyles={{ color: "#70C2E5", fontSize: 33, fontWeight: "bold" }}
        subTitleStyles={{ color: "#424B5B", fontSize: 20 }}
      />
    </View>
  );
};

export default OnBoardScreens;
