import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Picker,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/header";
import { Ionicons, Octicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { connect } from "react-redux";
import API from "../../../utils/api";
import CustomButton from "../../components/customButton";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, TextInput, Flex, Spacer } from "@react-native-material/core";

const db = SQLite.openDatabase("db5.db");

class Configure extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header onPress={() => navigation.openDrawer()}>
          Actualiza tus datos
        </Header>
      ),
    };
  };
  state = {
    id_student: null,
    grado: this.props.student.grado_estudiante,
    password: null,
    school: null,
    schoolSelected: this.props.student.id_colegio,
    name: this.props.student.nombre_estudiante,
    last_name: this.props.student.apellido_estudiante,
    user: this.props.student.nombre_usuario,
    email: this.props.student.correo_electronico,
    storage: null,
    students: null,
  };
  async componentDidMount() {
    console.log(this.props.student.grado_estudiante);
    var query2 = await API.loadSchool(this.props.ipconfig);
    var query = await API.allStudent(this.props.ipconfig);
    this.setState({ students: query });
    this.setState({ school: query2 });
  }
  async actualizaUser() {
    //update items set done = 1 where id = ?;
    if (this.state.password != null) {
      data = {
        id_estudiante: this.props.student.id_estudiante,
        //tipo_usuario: 1,
        nombre_estudiante: this.state.name,
        apellido_estudiante: this.state.last_name,
        grado_estudiante: this.state.grado,
        curso_estudiante: 1,
        id_colegio: this.state.schoolSelected,
        nombre_usuario: this.state.user,
        contrasena: this.state.password,
        correo_electronico: this.state.email,
      };
      var student = await API.updateStudents(this.props.ipconfig, data);
      console.log(student);
      db.transaction(
        (tx) => {
          //id_estudiante, tipo_usuario, nombre_estudiante, apellido_estudiante, grado_estudiante, curso_estudiante, id_colegio, nombre_usuario, contrasena, correo_electronico
          tx.executeSql(
            "update students set nombre_estudiante = ? , apellido_estudiante = ?, grado_estudiante = ?,curso_estudiante = ?, id_colegio = ?, nombre_usuario = ?, contrasena = ?, correo_electronico = ? where id_estudiante = ? ",
            [
              this.state.name,
              this.state.last_name,
              this.state.grado,
              1,
              this.state.schoolSelected,
              this.state.user,
              this.state.password,
              this.state.email,
              this.props.student.id_estudiante,
            ]
          );
          tx.executeSql(
            "select * from students",
            [],
            (_, { rows: { _array } }) => console.log(_array)
          );
        },
        null,
        null
      );
      Alert.alert(
        "Actualización Exitosa",
        "La actualización de sus datos es exitosa",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      this.props.dispatch({
        type: "SET_STUDENT",
        payload: {
          student: data,
        },
      });
    } else {
      Alert.alert(
        "Actualización Data",
        "No ha ingresado la contraseña por favor ingresela e intente nuevamente",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  }
  funcionCargada() {
    this.actualizaUser();
    this.actualizaUser();
  }

  render() {
    var datasSchoolFull = null;

    let itemsInPicker = null;
    //let itemsInPicker2= null;
    if (this.state.school == null) {
      itemsInPicker = null;
    } else {
      console.log("Imprimiendo State");
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
    //Agregando ItemPicker For Grados
    var dataGrado = [
      {
        id_grado: 6,
        grado: "6",
      },
      {
        id_grado: 7,
        grado: "7",
      },
      {
        id_grado: 8,
        grado: "8",
      },
      {
        id_grado: 9,
        grado: "9",
      },
      {
        id_grado: 10,
        grado: "10",
      },
      {
        id_grado: 11,
        grado: "11",
      },
    ];
    //console.log(dataGrado);
    let itemsInPicker2 = dataGrado.map((data) => {
      return (
        <Picker.Item
          label={data.grado}
          key={data.id_grado}
          value={data.id_grado}
        />
      );
    });

    return (
      <Stack
        style={styles.container}
        direction="column"
        alignItems="stretch"
        spacing={6}
      >
        <TextInput
          color="#70C2E5"
          variant="standard"
          placeholder="Nombre *"
          value={this.state.name}
          onChangeText={(text) => this.setState({ name: text })}
          leading={() => <Feather name="user" size={24} color="black" />}
        />
        <TextInput
          color="#70C2E5"
          variant="standard"
          placeholder="Apellido *"
          value={this.state.last_name}
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
            style={[styles.picker]}
            itemStyle={styles.pickerItem}
            selectedValue={this.state.grado}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ grado: itemValue })
            }
          >
            {itemsInPicker2}
          </Picker>
        </Flex>
        <Flex inline center>
          <MaterialCommunityIcons name="warehouse" size={24} color="black" />
          <Spacer />
          <Picker
            style={[styles.picker]}
            itemStyle={styles.pickerItem}
            selectedValue={this.state.schoolSelected}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ schoolSelected: itemValue })
            }
          >
            {itemsInPicker}
          </Picker>
        </Flex>
        <TextInput
          color="#70C2E5"
          variant="standard"
          placeholder="Correo electrónico *"
          value={this.state.email}
          onChangeText={(text) => this.setState({ user: text, email: text })}
          leading={() => <Feather name="mail" size={24} color="black" />}
        />
        <TextInput
          secureTextEntry={true}
          color="#70C2E5"
          variant="standard"
          placeholder="Digita tu contraseña"
          onChangeText={(text) => this.setState({ password: text })}
          leading={() => (
            <MaterialCommunityIcons name="key" size={24} color="black" />
          )}
        />
        <Flex center>
          <CustomButton
            text="Actualizar datos"
            onPress={() => this.funcionCargada()}
          />
        </Flex>
      </Stack>
    );
  }
}
const styles = StyleSheet.create({
  textDocument: {
    color: "#000",
    textAlign: "justify",
    marginTop: 30,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
  },
  containerText: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  containerTest: {
    flex: 1,
    flexDirection: "row",
    marginRight: 10,
  },
  textText: {
    marginTop: 10,
    marginRight: 0,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    borderRadius: 16,
    alignItems: "flex-start",
    width: 100,
    color: "#000000",
  },
  textData: {
    marginTop: 0,
    color: "#000000",
    textAlign: "center",
    borderRadius: 10,
    height: 40,
    width: 300,
    backgroundColor: "#FFFFFF",
  },
  styleTextIni: {
    marginBottom: 15,
    fontSize: 16,
    color: "#4F4F4F",
    fontWeight: "bold",
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
});
function mapStateToProps(state) {
  return {
    student: state.videos.selectedStudent,
    ipconfig: state.videos.selectedIPConfig,
  };
}
export default connect(mapStateToProps)(Configure);
