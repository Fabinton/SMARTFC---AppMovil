import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableHighlight,
} from "react-native";
import API from "../../utils/api";
import * as SQLite from "expo-sqlite";
import { connect } from "react-redux";
import CustomButton from "./customButton";
import { Stack, Flex, Spacer } from "@react-native-material/core";
import pregunta from "../../assets/images/pregunta.png";
import {
  getLocalDoubts,
  getLocalDoubtsByStudent,
  setLocalDoubtsByStudent,
} from "../../utils/parsers";

const db = SQLite.openDatabase("db5.db");

class QuestionActivity extends Component {
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
      tx.executeSql("select * from doubts", [], (_, { rows: { _array } }) =>
        this.setState({ storage: _array })
      );
    });
  }
  async registrateDoubt(showAlert = true) {
    let id_doubt_cont;
    let id_duda;
    if (this.props.internetConnection)
      await API.allDoubts(this.props.ipconfig)
        .then(({ data }) => {
          this.setState({ storage: data });
          if (data.length == 0) id_doubt_cont = 1;
          else id_doubt_cont = data.length + 1;
        })
        .catch((e) => console.log(e));
    else {
      this.setState({ storage: await getLocalDoubts() });
      const storageDoubts = this.state.storage;
      if (storageDoubts.length == 0) id_doubt_cont = 1;
      else id_doubt_cont = storageDoubts + 1;
    }
    id_duda = "" + this.props.student.id_estudiante + id_doubt_cont;
    id_duda = parseInt(id_duda);
    await setLocalDoubtsByStudent(
      id_duda,
      this.props.student.id_estudiante,
      this.props.activity.id_actividad,
      this.state.pregunta
    );
    if (showAlert)
      Alert.alert(
        "Almacenamiento",
        "Su duda ha sido almacenada por favor recuerde sincronizarla para tener alguna respuesta.",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    await this.sincronizaDoubt(false);
  }

  async sincronizaDoubt(showAlert = true) {
    if (this.props.internetConnection) {
      this.props.dispatch({
        type: "SET_LOADING",
        payload: true,
      });
      const storageDoubts = await getLocalDoubtsByStudent(
        this.props.student.id_estudiante,
        this.props.activity.id_actividad
      );
      storageDoubts.forEach((doubt) => {
        if (doubt.estado_duda === 0) {
          API.generateDoubt(this.props.ipconfig, doubt)
            .then(async () => {
              const id_dudosa = doubt.id_duda;
              await new Promise((resolve, reject) => {
                db.transaction((tx) => {
                  tx.executeSql(
                    "update doubts set estado_duda = ? where id_duda = ? ",
                    [1, id_dudosa],
                    (query, { rows: { _array } }) => {
                      if (!query._error) {
                        resolve(_array);
                      } else {
                        reject(query._error);
                      }
                    }
                  );
                });
              });
              Alert.alert(
                "Sincronización Exitosa",
                "Sus dudas fueron enviadas dentro de poco tendra una respuesta.",
                [{ text: "OK", onPress: () => {} }],
                { cancelable: false }
              );
            })
            .catch((e) => {
              console.log("error", e);
              Alert.alert(
                "Error",
                "Error, sus dudas no han podido ser sincronizadas. Intente nuevamente.",
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
      });
    } else {
      if (showAlert)
        Alert.alert(
          "ERROR",
          "Recuerda que debes estar conectado para sincronizar las preguntas.",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
    }
  }

  render() {
    return (
      <View style={this.props.style}>
        <View style={styles.box}>
          <TouchableHighlight
            onPress={() => this.doubtActivity()}
            underlayColor={"#F2F2F2"}
          >
            <Image source={pregunta} style={{ width: 150, height: 150 }} />
          </TouchableHighlight>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ pregunta: "" });
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <Stack
            style={styles.container}
            direction="column"
            alignItems="center"
            spacing={6}
          >
            <Spacer />
            <Flex inline>
              <Image
                style={{
                  width: 210,
                  height: 284,
                }}
                source={require("../../assets/images/robotPregunta.png")}
              />
              <Text style={{ fontSize: 30, fontWeight: "bold", marginTop: 20 }}>
                Realiza una {"\n"} pregunta a {"\n"} tu profesor/a {"\n"}
              </Text>
            </Flex>
            <Spacer />
            <TextInput
              style={styles.pregunta}
              multiline
              numberOfLines={4}
              placeholder="Escribe aquí tu pregunta"
              onChangeText={(text) => this.setState({ pregunta: text })}
            ></TextInput>
            <Spacer />
            <CustomButton
              text="Guarda tu pregunta"
              onPress={() => this.registrateDoubt()}
              disabled={!(this?.state?.pregunta?.length > 0)}
            />
            <Spacer />
            <CustomButton
              text="Sincroniza tu pregunta"
              onPress={() => this.sincronizaDoubt()}
              disabled={!(this?.state?.pregunta?.length > 0)}
            />
            <Spacer />
            <CustomButton
              text="Cancelar"
              onPress={() => {
                this.setState({ pregunta: "" });
                this.setModalVisible(!this.state.modalVisible);
              }}
            />
            <Spacer />
          </Stack>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  pregunta: {
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
    marginTop: 25,
  },
});

function mapStateToProps(state) {
  return {
    student: state.videos.selectedStudent,
    activity: state.videos.selectedActivity,
    ipconfig: state.videos.selectedIPConfig,
    internetConnection: state.connection.isConnected,
  };
}

export default connect(mapStateToProps)(QuestionActivity);
