import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import {
  Modal,
  StyleSheet,
  Text,
  BackHandler,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import * as SQLite from "expo-sqlite";
//import Header from '../../components/header';
import HeaderLogin from "../../components/headerLogin";
import API from "../../../utils/api";
import CustomButton from "../../components/customButton";
import { Stack, Flex, Spacer } from "@react-native-material/core";
import CheckConnection from "../../components/CheckConnection";

const db = SQLite.openDatabase("db5.db");
function goodBye() {
  BackHandler.exitApp();
}

class Login extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <HeaderLogin></HeaderLogin>,
    };
  };
  state = {
    email: null,
    password: null,
    storage: null,
    modalVisible: false,
    ipconfig: null,
    internetConnection: this.props.internetConnection,
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  async signIn(data) {
    this.props.dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    this.consulta();
    if (this.state.storage) {
      const studentExist = this?.state?.storage?.find((student) => {
        return (
          student.correo_electronico == "estudiante10@fc.com" && // reminder to check email and password from form.
          student.contrasena == "1234" // this.state.email this.state.password
        );
      });
      if (studentExist) {
        this.props.dispatch({
          type: "SET_STUDENT",
          payload: {
            student: studentExist,
          },
        });
        setTimeout(() => {
          this.props.dispatch({
            type: "SET_LOADING",
            payload: false,
          });
        }, 2000);
        setTimeout(() => {
          this.props.dispatch(
            NavigationActions.navigate({
              routeName: "Activities",
            })
          );
        }, 1500);
      } else {
        Alert.alert(
          "Datos Incorrectos",
          "La contraseña o email son incorrecto",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            { text: "OK", onPress: {} },
          ],
          { cancelable: false }
        );
      }
    }
  }

  componentDidMount() {
    //Aqui Hay un cambio si se aprueba
    var d = new Date();
    console.log(d.getFullYear());
    var year = d.getFullYear();
    console.log(typeof year);
    this.props.dispatch({
      type: "SET_STUDENT",
      payload: {
        student: null,
      },
    });

    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists students (id_estudiante integer not null unique, tipo_usuario integer, nombre_estudiante text, apellido_estudiante text, grado_estudiante int, curso_estudiante int, id_colegio int, nombre_usuario text, contrasena text, correo_electronico text);"
      );
      tx.executeSql("select * from students", [], (_, { rows: { _array } }) =>
        this.setState({ storage: _array })
      );
    });
  }
  registrateForm() {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: "Registro",
      })
    );
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  async registrateIP() {
    ipConfigSend = this.state.ipconfig;
    if (this.props.internetConnection) {
      this.props.dispatch({
        type: "SET_LOADING",
        payload: true,
      });
      API.getConection(ipConfigSend)
        .then((response) => {
          this.props.dispatch({
            type: "SET_IPCONFIG",
            payload: {
              ipconfig: ipConfigSend,
            },
          });
          Alert.alert(
            "Conexión",
            "La conexión con el servidor fue exitosa.",
            [
              {
                text: "OK",
                onPress: () => this.setModalVisible(!this.state.modalVisible),
              },
            ],
            { cancelable: false }
          );
        })
        .catch((error) => {
          console.log("error ip", error);
          Alert.alert(
            "ERROR",
            "La conexión con el servidor es erronea por favor verifica tu IP",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        })
        .finally(() => {
          this.props.dispatch({
            type: "SET_LOADING",
            payload: false,
          });
        });
    } else {
      Alert.alert(
        "ERROR",
        "Recuerda que debes estar conectado a internet para guardar tu IP.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }

  async sincronizarDatas() {
    this.props.dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    API.allStudent(this.props.ipconfig)
      .then(({ data }) => {
        this.setState({ storage: data });
        data.map((student) => {
          this.envioDatosSQL(
            student.id_estudiante,
            student.id_colegio,
            student.nombre_estudiante,
            student.tipo_usuario,
            student.grado_estudiante,
            student.curso_estudiante,
            student.apellido_estudiante,
            student.contrasena,
            student.correo_electronico
          );
        });
        Alert.alert(
          "Sincronización",
          "La sincronización de los usuarios fue realizada",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      })
      .catch((e) => {
        console.log("error", e);
        Alert.alert(
          "Error",
          "Se presentó un error al sincronizar usuarios",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      })
      .finally(() => {
        this.props.dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      });
  }
  envioDatosSQL(
    id_estudiante,
    id_colegio,
    nombre_estudiante,
    nombre_usuario,
    tipo_usuario,
    grado_estudiante,
    curso_estudiante,
    apellido_estudiante,
    contrasena,
    correo_electronico
  ) {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into students (id_estudiante, tipo_usuario, nombre_estudiante, apellido_estudiante, grado_estudiante, curso_estudiante, id_colegio, nombre_usuario, contrasena, correo_electronico) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id_estudiante,
          tipo_usuario,
          nombre_estudiante,
          apellido_estudiante,
          grado_estudiante,
          curso_estudiante,
          id_colegio,
          nombre_usuario,
          contrasena,
          correo_electronico,
        ]
      );
    }, null);
  }
  consulta() {
    db.transaction((tx) => {
      tx.executeSql("select * from students", [], (_, { rows: { _array } }) =>
        this.setState({ storage: _array })
      );
    });
  }
  async loginAdmin() {
    var data = {
      nombre_usuario: this.state.email,
      contrasena: this.state.password,
    };
    const query = await API.loginAdmin(this.props.ipconfig, data);
    console.log(query);
    if (query.length == 1) {
      this.props.dispatch(
        NavigationActions.navigate({
          routeName: "Admin",
        })
      );
    } else {
      console.log("Pailas");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CheckConnection />
        <Image
          style={{ width: 300, height: 200 }}
          source={require("../../../assets/images/LogoSinFondo.png")}
        />
        <Image
          style={{ width: 350, height: 84 }}
          source={require("../../../assets/images/SmartFC.png")}
        />

        <TextInput
          style={styles.IP}
          placeholder="Correo Electronico"
          autoCapitalize="none"
          onChangeText={(text) => this.setState({ email: text })}
        ></TextInput>
        <TextInput
          style={styles.password}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
        ></TextInput>
        <CustomButton text="Iniciar sesión" onPress={() => this.signIn()} />
        <CustomButton
          text="Sincroniza datos usuario"
          onPress={() => this.sincronizarDatas()}
        />
        <CustomButton
          text="Login como Admin"
          onPress={() => this.loginAdmin()}
        />
        <View style={styles.registrate}>
          <Text style={{ color: "#424B5B", fontSize: 20 }}>
            ¿No tienes Cuenta?
          </Text>
          <CustomButton
            text="Registrate"
            textStyle={{ color: "#70C2E5", marginLeft: 5, fontSize: 20 }}
            textTouchable={{}} //empty cuz of default style in button
            onPress={() => this.registrateForm()}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            //Alert.alert("Modal has been closed.");
            this.setModalVisible(false);
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
              onChangeText={(text) => this.setState({ ipconfig: text })}
            ></TextInput>
            <Text style={styles.textDocument}>
              Para guardar el IP necesita conexión, en caso de no estar
              conectado dirijase a su director o docente para que se le
              proporcione la conexión
            </Text>
            <Flex inline center self="baseline">
              <CustomButton
                textTouchable={styles.touchableButtonSignIn}
                text="Guardar"
                onPress={() => this.registrateIP()}
              />
              <CustomButton
                textTouchable={styles.touchableButtonSignIn}
                text="Cancelar"
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              />
            </Flex>
          </Stack>
        </Modal>
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text>Conectar IP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
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
  registrate: {
    marginTop: 15,
    flexDirection: "row",
  },
  IP: {
    marginTop: 0,
    textAlign: "center",
    borderRadius: 10,
    height: 40,
    width: 300,
    backgroundColor: "#FFFFFF",
  },
  password: {
    marginTop: 25,
    marginBottom: 25,
    color: "#000000",
    borderRadius: 10,
    textAlign: "center",
    height: 40,
    width: 300,
    backgroundColor: "#FFFFFF",
  },
});
function mapStateToProps(state) {
  return {
    ipconfig: state.videos.selectedIPConfig,
    internetConnection: state.connection.isConnected,
    loading: state.connection.loading,
  };
}

export default connect(mapStateToProps)(Login);
