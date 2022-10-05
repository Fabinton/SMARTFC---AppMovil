import { Text, TextInput, Modal, Alert } from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Flex, Stack } from "@react-native-material/core";
import CustomButton from "./customButton";
import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";

const ConnectIp = ({ modalVisible, setModalVisible }) => {
  const { loading, isConnected } = useSelector((state) => state.connection);
  const dispatch = useDispatch();
  const [IpValue, setIpValue] = useState("");
  const registrateIP = () => {
    if (isConnected) {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });
      api
        .getConection(IpValue)
        .then(() => {
          dispatch({
            type: "SET_IPCONFIG",
            payload: {
              ipconfig: IpValue,
            },
          });
          setTimeout(() => {
            Alert.alert(
              "Conexión",
              "La conexión con el servidor fue exitosa.",
              [
                {
                  text: "OK",
                  onPress: () => setModalVisible(!modalVisible),
                },
              ],
              { cancelable: false }
            );
          }, 300);
        })
        .catch((error) => {
          console.log("error ip", error);
          setTimeout(() => {
            Alert.alert(
              "ERROR",
              "La conexión con el servidor es erronea por favor verifica tu IP",
              [{ text: "OK", onPress: () => {} }],
              { cancelable: false }
            );
          }, 300);
        })
        .finally(() => {
          dispatch({
            type: "SET_LOADING",
            payload: false,
          });
        });
    } else {
      setTimeout(() => {
        Alert.alert(
          "ERROR",
          "Recuerda que debes estar conectado a internet para guardar tu IP.",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      }, 300);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible && !loading}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <Stack
        style={styles.container}
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={6}
      >
        <Text style={styles.textInit}>Conectar IP</Text>
        <TextInput
          style={styles.IP}
          placeholder="Introduce tu IP"
          autoCapitalize="none"
          onChangeText={(text) => setIpValue(text)}
        ></TextInput>
        <Text style={styles.textDocument}>
          Para guardar el IP necesita conexión, en caso de no estar conectado
          dirijase a su director o docente para que se le proporcione la
          conexión
        </Text>
        <Flex inline center self="baseline">
          <CustomButton
            textTouchable={styles.touchableButtonSignIn}
            text="Guardar"
            disabled={IpValue?.length === 0}
            onPress={() => registrateIP()}
          />
          <CustomButton
            textTouchable={styles.touchableButtonSignIn}
            text="Cancelar"
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
        </Flex>
      </Stack>
    </Modal>
  );
};
const styles = StyleSheet.create({
  textDocument: {
    color: "#424B5B",
    textAlign: "justify",
    marginRight: 15,
    marginLeft: 15,
    marginTop: 20,
  },
  touchableButtonSignIn: {
    justifyContent: "center",
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#70C2E5",
    height: 50,
    width: 170,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInit: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#70C2E3",
    margin: "auto",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },

  IP: {
    marginTop: 0,
    textAlign: "center",
    borderRadius: 10,
    height: 40,
    width: 300,
    backgroundColor: "#FFFFFF",
  },
});
export default ConnectIp;
