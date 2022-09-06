import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import API from "../../utils/api";
import * as SQLite from "expo-sqlite";
import { connect } from "react-redux";
import CustomButton from "./customButton";

const db = SQLite.openDatabase("db5.db");

class QuestionActiviy extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    modalVisible: false,
    pregunta: null,
    storage: null,
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  doubtActivity() {
    this.setModalVisible(true);
  }
  componentDidMount() {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists doubts (id_duda integer not null, id_actividad integer, id_estudiante integer, pregunta text, respuesta text, estado_duda int);"
      );
      tx.executeSql(
        "select * from doubts",
        [],
        (_, { rows: { _array } }) => this.setState({ storage: _array }),
        console.log("storage en Question didmount", this.state.storage)
      );
    });
  }
  registrateDoubt() {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from doubts",
        [],
        (_, { rows: { _array } }) => this.setState({ storage: _array }),
        console.log("storage en componente question", this.state.storage)
      );
    });
    var storageDoubts = this.state.storage;
    if (storageDoubts.length == 0) {
      id_doubt_cont = 1;
    } else {
      id_doubt_cont = storageDoubts.length + 1;
    }
    id_duda = "" + this.props.student.id_estudiante + id_doubt_cont;
    id_duda = parseInt(id_duda);
    dataDoubt = {
      id_duda: id_duda,
      id_actividad: this.props.activity.id_actividad,
      id_estudiante: this.props.student.id_estudiante,
      pregunta: this.state.pregunta,
      respuesta: "",
      estado_duda: 1,
    };
    db.transaction((tx) => {
      tx.executeSql(
        "insert into doubts (id_duda, id_actividad, id_estudiante, pregunta, respuesta, estado_duda) values (?, ?, ?, ?, ?, ?)",
        [
          id_duda,
          this.props.activity.id_actividad,
          this.props.student.id_estudiante,
          this.state.pregunta,
          "",
          0,
        ]
      );
      tx.executeSql(
        "select * from doubts",
        [],
        (_, { rows: { _array } }) => this.setState({ storage: _array }),
        console.log(this.state.storage)
      );
    });
    Alert.alert(
      "Almacenamiento",
      "Su duda ha sido almacenada por favor recuerde sincronizarla para tener alguna respuesta.",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
  }

  async sincronizaDoubt() {
    db.transaction((tx) => {
      tx.executeSql("select * from doubts", [], (_, { rows: { _array } }) =>
        this.setState({ storage: _array })
      );
    });
    var storageDoubts = this.state.storage;
    console.log("Imprimiendo StorageDoubts");
    console.log(storageDoubts[0].id_duda);
    for (var i = 0; i < storageDoubts.length; i++) {
      if (storageDoubts[i].estado_duda == 0) {
        var dataDoubt = storageDoubts[i];
        var creacionDuda = await API.generateDoubt(
          this.props.ipconfig,
          dataDoubt
        );
        var id_dudosa = storageDoubts[i].id_duda;
        db.transaction((tx) => {
          tx.executeSql(
            "update doubts set estado_duda = ? where id_duda = ? ",
            [1, id_dudosa]
          );
          tx.executeSql(
            "select * from doubts",
            [],
            (_, { rows: { _array } }) => this.setState({ storage: _array }),
            console.log(this.state.storage)
          );
        });
      }
    }
    Alert.alert(
      "Sincronización Exitosa",
      "Sus dudas fueron enviadas dentro de poco tendra una respuesta.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  render() {
    return (
      <View style={this.props.style}>
        <View style={styles.box}>
          <CustomButton
            text="Realiza una Pregunta"
            onPress={() => this.doubtActivity()}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <View style={styles.container}>
            <View style={styles.container}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Realiza tu pregunta
              </Text>
              <TextInput
                style={styles.pregunta}
                multiline
                numberOfLines={4}
                placeholder="Escribe aquí tu pregunta"
                onChangeText={(text) => this.setState({ pregunta: text })}
              ></TextInput>
              <CustomButton
                text="Guarda tu pregunta"
                onPress={() => this.registrateDoubt()}
              />
              <CustomButton
                text="Sincroniza tu pregunta"
                onPress={() => this.sincronizaDoubt()}
              />
              <CustomButton
                text="Cancelar"
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  pregunta: {
    marginTop: 25,
    borderRadius: 15,
    color: "#000000",
    borderColor: "#6E6060",
    borderWidth: 1,
    textAlign: "center",
    height: 100,
    width: 300,
    backgroundColor: "#FFFFFF",
  },
  box: {
    flex: 0.5,
    marginBottom: 15,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginLeft: 200,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

function mapStateToProps(state) {
  return {
    student: state.videos.selectedStudent,
    activity: state.videos.selectedActivity,
    ipconfig: state.videos.selectedIPConfig,
  };
}

export default connect(mapStateToProps)(QuestionActiviy);
