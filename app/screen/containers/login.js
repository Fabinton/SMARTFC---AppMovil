import React, { Component } from "react";
import { CommonActions } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import * as SQLite from "expo-sqlite";
import API from "../../../utils/api";
import CustomButton from "../../components/customButton";
import ConnectIp from "../../components/ConnectIp";
import { Ionicons } from "@expo/vector-icons";

const db = SQLite.openDatabase("db5.db");

class Login extends Component {
  state = {
    email: null,
    password: null,
    storage: null,
    modalVisible: false,
    ipconfig: null,
    internetConnection: this.props.internetConnection,
    showPassword: false,
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  signIn() {
    if (this.props.ipconfig) {
      this.props.dispatch({
        type: "SET_LOADING",
        payload: true,
      });
      this.consulta();
      if (Object.keys(this.state.storage || {})?.length > 0) {
        const studentExist = this?.state?.storage?.find((student) => {
          return (
            student.correo_electronico.toLowerCase() ==
              this.state.email.toLowerCase() && // reminder to check email and password from form.
            student.contrasena.toLowerCase() ==
              this.state.password.toLowerCase() // this.state.email this.state.password
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
          }, 1700);
          setTimeout(() => {
            this.props.dispatch({
              type: "SET_USER_LOGGED_IN",
              payload: { loggedIn: true },
            });
            this.props.navigation.dispatch(
              CommonActions.navigate({
                name: "drawer",
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
              { text: "OK", onPress: () => {} },
            ],
            { cancelable: false }
          );
          setTimeout(() => {
            this.props.dispatch({
              type: "SET_LOADING",
              payload: false,
            });
          }, 1700);
        }
      } else {
        this.props.dispatch({
          type: "SET_LOADING",
          payload: false,
        });
        Alert.alert(
          "Error",
          "Recuerda sincronizar datos de usuario antes de iniciar sesión.",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            { text: "OK", onPress: () => {} },
          ],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        "Error Conexión",
        "Recuerda guardar la dirección IP antes de iniciar sesión.",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          { text: "OK", onPress: () => {} },
        ],
        { cancelable: false }
      );
    }
  }

  componentDidMount() {
    //Aqui Hay un cambio si se aprueba
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
    this.props.navigation.dispatch(
      CommonActions.navigate({
        name: "Registro",
      })
    );
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component

    this.setState = (state, callback) => {
      return;
    };
  }

  sincronizarDatas() {
    if (this.props.internetConnection) {
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
              student.correo_electronico,
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
    } else {
      Alert.alert(
        "ERROR",
        "Recuerda que debes estar conectado a Internet para sincronizar datos.",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
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
      tx.executeSql("select * from students", [], (_, { rows: { _array } }) => {
        this.setState({ storage: _array });
      });
    });
  }
  async loginAdmin() {
    var data = {
      nombre_usuario: this.state.email,
      contrasena: this.state.password,
    };
    const query = await API.loginAdmin(this.props.ipconfig, data);
    if (query.length == 1) {
      this.props.navigation.dispatch(
        CommonActions.navigate({
          name: "Admin",
        })
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
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
        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.password}
            placeholder="Contraseña"
            secureTextEntry={!this.state.showPassword}
            onChangeText={(text) => this.setState({ password: text })}
          ></TextInput>
          <TouchableOpacity
            onPress={() =>
              this.setState({ showPassword: !this.state.showPassword })
            }
          >
            <Ionicons
              size={18}
              style={{ position: "absolute", top: -55, right: 10 }}
              name={
                !this.state.showPassword ? "eye-outline" : "eye-off-outline"
              }
            />
          </TouchableOpacity>
        </View>
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
        <ConnectIp
          modalVisible={this.state.modalVisible}
          setModalVisible={() => this.setModalVisible(!this.state.modalVisible)}
        />
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
