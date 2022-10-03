import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { StyleSheet, Text, CheckBox, Picker, Alert } from "react-native";
import HeaderLogin from "../../components/headerLogin";
import * as SQLite from "expo-sqlite";
import API from "../../../utils/api";
import { connect } from "react-redux";
import CustomButton from "../../components/customButton";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, TextInput, Flex, Spacer } from "@react-native-material/core";

const db = SQLite.openDatabase("db5.db");

class Register extends Component {
  state = {
    val: "ed",
    seePass: true,
  };
  static navigationOptions = () => {
    return {
      header: <HeaderLogin></HeaderLogin>,
    };
  };
  state = {
    id_student: null,
    grado: null,
    checked: false,
    password: null,
    school: null,
    schoolSelected: null,
    name: null,
    last_name: null,
    user: null,
    email: null,
    storage: null,
    students: null,
  };
  componentDidMount() {
    API.loadSchool(this.props.ipconfig)
      .then(({ data }) => {
        this.setState({ school: data });
      })
      .catch((e) => {});
    API.allStudent(this.props.ipconfig).then(({ data }) => {
      this.setState({ students: data });
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
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  Registrate() {
    if (this.props.internetConnection) {
      this.props.dispatch({
        type: "SET_LOADING",
        payload: true,
      });
      let id_students_F;
      let id_final;
      API.allStudent(this.props.ipconfig)
        .then(({ data }) => {
          if (data?.length == 0) {
            id_students_F = 1;
            this.setState({ id_student: 1 });
          } else {
            id_students_F = data?.length + 1;
            this.setState({ id_student: id_students_F });
          }
          id_final = "" + this.state.schoolSelected + id_students_F;
          id_final = parseInt(id_final);
          const dataToSave = {
            id_estudiante: id_final,
            tipo_usuario: 1,
            nombre_estudiante: this.state.name,
            apellido_estudiante: this.state.last_name,
            grado_estudiante: this.state.grado,
            curso_estudiante: 1,
            id_colegio: this.state.schoolSelected,
            nombre_usuario: this.state.user,
            contrasena: this.state.password,
            correo_electronico: this.state.email,
          };
          API.createStudents(this.props.ipconfig, dataToSave)
            .then(({ data }) => {
              db.transaction(
                (tx) => {
                  tx.executeSql(
                    "insert into students (id_estudiante, tipo_usuario, nombre_estudiante, apellido_estudiante, grado_estudiante, curso_estudiante, id_colegio, nombre_usuario, contrasena, correo_electronico) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                      id_final,
                      1,
                      this.state.name,
                      this.state.last_name,
                      this.state.grado,
                      1,
                      this.state.schoolSelected,
                      this.state.user,
                      this.state.password,
                      this.state.email,
                    ]
                  );
                  tx.executeSql(
                    "select * from students",
                    [],
                    (_, { rows: { _array } }) => {}
                  );
                },
                null,
                null
              );
              this.props.dispatch(
                NavigationActions.navigate({
                  routeName: "Notification",
                })
              );
            })
            .catch((e) => {
              console.log("error register", e);
              Alert.alert(
                "Error",
                "Ha ocurrido un error al registrar usuario.",
                [{ text: "OK", onPress: () => {} }],
                { cancelable: false }
              );
            })
            .finally(() => {});
        })
        .catch((e) => {
          console.log("error allstudents", e);
          Alert.alert(
            "Error",
            "Ha ocurrido un error al registrar usuario.",
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
        "Recuerda que debes estar conectado para registrarte.",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  }

  close() {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: "Notification",
      })
    );
  }
  validateForm() {
    return (
      this.state?.name?.length > 0 &&
      this.state?.last_name?.length > 0 &&
      this.state?.grado?.length > 0 &&
      this.state?.schoolSelected &&
      this.state?.email?.length > 0 &&
      this.state?.password?.length > 0 &&
      this.state.checked
    );
  }

  render() {
    var datasSchoolFull = null;

    let itemsInPicker = null;
    if (this.state.school == null) {
      itemsInPicker = null;
    } else {
      //console.log(datasSchool);
      datasSchoolFull = this.state.school;

      itemsInPicker = datasSchoolFull.map((data) => {
        return (
          <Picker.Item
            label={data.nombre_colegio}
            key={data.id_colegio}
            value={data.id_colegio}
          />
        );
      });
    }

    return (
      <Stack
        style={styles.container}
        direction="column"
        alignItems="stretch"
        spacing={6}
      >
        <Text style={styles.textInit}>Crea una cuenta</Text>
        <TextInput
          color="#70C2E5"
          variant="standard"
          placeholder="Nombre *"
          onChangeText={(text) => this.setState({ name: text })}
          leading={() => <Feather name="user" size={24} color="black" />}
        />
        <TextInput
          color="#70C2E5"
          variant="standard"
          placeholder="Apellido *"
          onChangeText={(text) => this.setState({ last_name: text })}
          leading={() => <Feather name="user" size={24} color="black" />}
        />
        <Flex inline center>
          <AntDesign
            style={{ marginTop: 5 }}
            name="book"
            size={24}
            color="black"
          />
          <Spacer />
          <Picker
            mode="dropdown"
            style={[styles.picker]}
            selectedValue={this.state.grado}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ grado: itemValue })
            }
          >
            <Picker.Item color="gray" label="Curso" value="" />
            <Picker.Item label="6" value="6" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="11" value="11" />
          </Picker>
        </Flex>
        <Flex inline center>
          <MaterialCommunityIcons name="warehouse" size={24} color="black" />
          <Spacer />
          <Picker
            mode="dropdown"
            style={[styles.picker]}
            itemStyle={styles.pickerItem}
            selectedValue={this.state.schoolSelected}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ schoolSelected: itemValue })
            }
          >
            <Picker.Item color="gray" label="Colegio" value="" />
            {itemsInPicker}
          </Picker>
        </Flex>
        <TextInput
          color="#70C2E5"
          variant="standard"
          placeholder="Correo electrónico *"
          onChangeText={(text) => this.setState({ user: text, email: text })}
          leading={() => <Feather name="mail" size={24} color="black" />}
        />
        <TextInput
          secureTextEntry={true}
          color="#70C2E5"
          variant="standard"
          placeholder="Contraseña *"
          onChangeText={(text) => this.setState({ password: text })}
          leading={() => (
            <MaterialCommunityIcons name="key" size={24} color="black" />
          )}
        />
        <Flex inline center style={{ marginLeft: 10 }}>
          <CheckBox
            value={this.state.checked}
            onValueChange={() =>
              this.setState({ checked: !this.state.checked })
            }
          />
          <Text style={styles.textDocument}>
            Acepto los terminos de uso de datos para futuras investigaciones.
          </Text>
        </Flex>
        <Text style={styles.textDocument}>
          Para registrarse necesita conexión, en caso de no estar conectado
          dirijase a su director o docente para que se le proporcione la
          conexión
        </Text>

        <Flex center>
          <CustomButton
            text="Registrate"
            onPress={() => this.Registrate()}
            disabled={!this.validateForm()}
          />
          <CustomButton text="Cancelar" onPress={() => this.close()} />
        </Flex>
      </Stack>
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
  container: {
    backgroundColor: "white",
    marginLeft: 20,
    marginRight: 20,
  },
  containerTest: {
    marginTop: 20,
    flex: 1,
    flexDirection: "row",
  },
  textInit: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#70C2E3",
    margin: "auto",
  },
  textText: {
    marginTop: 10,
    marginRight: 0,
    marginLeft: 10,
    backgroundColor: "transparent",
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    borderRadius: 16,
    alignItems: "flex-start",
    width: 100,
  },
  textData: {
    marginTop: 5,
    borderRadius: 15,
    color: "#000000",
    borderColor: "#6E6060",
    borderWidth: 1,
    textAlign: "center",
    height: 40,
    width: 200,
    backgroundColor: "#FFFFFF",
  },
  picker: {
    marginTop: 5,
    width: 330,
    borderRadius: 15,
    height: 40,
    color: "#000000",
    borderWidth: 1,
  },
  pickerItem: {
    height: 44,
    color: "white",
  },

  textTouchable: {
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: "#70C2E5",
    height: 45,
    width: 150,
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
  searchSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
});
function mapStateToProps(state) {
  return {
    ipconfig: state.videos.selectedIPConfig,
    internetConnection: state.connection.isConnected,
  };
}
export default connect(mapStateToProps)(Register);
