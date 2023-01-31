import React, { Component, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import Header from "../../components/header";
import API from "../../../utils/api";
import ActivityEvents from "../../components/profileActivity";
import CustomButton from "../../components/customButton";
import { Stack, Spacer } from "@react-native-material/core";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  calculateAllScore,
  getEventsLocalDB,
  getStudentdb,
  getStudentsByschool,
  getStudentsInServerByschool,
  updateStudentdb,
} from "../../../utils/parsers";
import { useFocusEffect } from "@react-navigation/native";

function FetchUserData({ loadAll }) {
  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [])
  );
  return null;
}
class Profile extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <Header onPress={() => navigation.openDrawer()}>PERFIL</Header>,
    };
  };
  state = {
    storage: [],
    result: [
      {
        id_actividad: 0,
        nombre_actividad: "",
        nota: 0,
        count_videos: 0,
        progresso: 0,
      },
    ],
    place: 10,
    active: "",
    uniqueEvents: [],
    totalScore: 0,
    allActivities: [],
  };

  componentDidMount() {
    this.loadActivities();
  }
  async consulta() {
    const studentEvents = await getEventsLocalDB(
      this.props.student.id_estudiante
    );
    this.setState({ storage: studentEvents });
  }
  filtro(activeSub) {
    const data = [];
    function esActividad(elemento) {
      if (elemento.id_actividad == activeSub) {
        data.push(elemento);
      }
    }
    if (!(this.props.list.filter(esActividad).length > 0)) {
      this.state.allActivities.filter(esActividad);
    } else {
      this.props.list.filter(esActividad);
    }
    return data;
  }

  async loadActivities() {
    this.props.dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    await this.consulta();
    let storageActividad = [
      {
        id_actividad: 0,
        nombre_actividad: "",
        nota: 0,
        count_videos: 0,
        progresso: 0,
        totalScore: 0,
      },
    ];
    let activity = [];
    this.setState({ active: "ESTOS SON SU PROGRESO EN LA ACTIVIDAD" });
    if (this.props.internetConnection) {
      await API.getActivities(this.props.ipconfig)
        .then(({ data }) => {
          activity = data;
          this.setState({ allActivities: data });
        })
        .catch((e) => console.log("error al traer actividades", e));
    } else {
      activity = this.props.list;
    }
    let student = await getStudentdb(this.props.student.id_estudiante);
    activity = activity.filter((act) => {
      return (
        act?.id_colegio === student[0]?.id_colegio &&
        act?.id_grado === student[0]?.grado_estudiante
      );
    });

    var notaF = 0;
    var notaFEvaluation = 0;
    var progressoActivity = 0;
    for (var i = this.state.storage.length - 1; i >= 0; i--) {
      for (var j = 0; j < activity?.length; j++) {
        if (this.state.storage[i].id_actividad == activity[j].id_actividad) {
          //Comparation with scores for test
          if (
            this.state.storage[i].check_a1 == activity[j].CA1 &&
            this.state.storage[i].check_a2 == activity[j].CA2 &&
            this.state.storage[i].check_a3 == activity[j].CA3
          ) {
            notaF = 5;
          } else if (
            this.state.storage[i].check_a1 != activity[j].CA1 &&
            this.state.storage[i].check_a2 == activity[j].CA2 &&
            this.state.storage[i].check_a3 == activity[j].CA3
          ) {
            notaF = 4;
          } else if (
            this.state.storage[i].check_a1 == activity[j].CA1 &&
            this.state.storage[i].check_a2 != activity[j].CA2 &&
            this.state.storage[i].check_a3 == activity[j].CA3
          ) {
            notaF = 4;
          } else if (
            this.state.storage[i].check_a1 == activity[j].CA1 &&
            this.state.storage[i].check_a2 == activity[j].CA2 &&
            this.state.storage[i].check_a3 != activity[j].CA3
          ) {
            notaF = 4;
          } else if (
            this.state.storage[i].check_a1 != activity[j].CA1 &&
            this.state.storage[i].check_a2 != activity[j].CA2 &&
            this.state.storage[i].check_a3 == activity[j].CA3
          ) {
            notaF = 3;
          } else if (
            this.state.storage[i].check_a1 != activity[j].CA1 &&
            this.state.storage[i].check_a2 == activity[j].CA2 &&
            this.state.storage[i].check_a3 != activity[j].CA3
          ) {
            notaF = 3;
          } else if (
            this.state.storage[i].check_a1 == activity[j].CA1 &&
            this.state.storage[i].check_a2 != activity[j].CA2 &&
            this.state.storage[i].check_a3 != activity[j].CA3
          ) {
            notaF = 3;
          } else if (
            this.state.storage[i].check_a1 != activity[j].CA1 &&
            this.state.storage[i].check_a2 != activity[j].CA2 &&
            this.state.storage[i].check_a3 != activity[j].CA3
          ) {
            notaF = 0;
          } else {
            notaF = 0;
          }
          //Comparation with scores for Evaluation
          if (
            this.state.storage[i].check_Ea1 == activity[j].ECA1 &&
            this.state.storage[i].check_Ea2 == activity[j].ECA2 &&
            this.state.storage[i].check_Ea3 == activity[j].ECA3
          ) {
            notaFEvaluation = 5;
          } else if (
            this.state.storage[i].check_Ea1 != activity[j].ECA1 &&
            this.state.storage[i].check_Ea2 == activity[j].ECA2 &&
            this.state.storage[i].check_Ea3 == activity[j].ECA3
          ) {
            notaFEvaluation = 4;
          } else if (
            this.state.storage[i].check_Ea1 == activity[j].ECA1 &&
            this.state.storage[i].check_Ea2 != activity[j].ECA2 &&
            this.state.storage[i].check_Ea3 == activity[j].ECA3
          ) {
            notaFEvaluation = 4;
          } else if (
            this.state.storage[i].check_Ea1 == activity[j].ECA1 &&
            this.state.storage[i].check_Ea2 == activity[j].ECA2 &&
            this.state.storage[i].check_Ea3 != activity[j].ECA3
          ) {
            notaFEvaluation = 4;
          } else if (
            this.state.storage[i].check_Ea1 != activity[j].ECA1 &&
            this.state.storage[i].check_Ea2 != activity[j].ECA2 &&
            this.state.storage[i].check_Ea3 == activity[j].ECA3
          ) {
            notaFEvaluation = 3;
          } else if (
            this.state.storage[i].check_Ea1 != activity[j].ECA1 &&
            this.state.storage[i].check_Ea2 == activity[j].ECA2 &&
            this.state.storage[i].check_Ea3 != activity[j].ECA3
          ) {
            notaFEvaluation = 3;
          } else if (
            this.state.storage[i].check_Ea1 == activity[j].ECA1 &&
            this.state.storage[i].check_Ea2 != activity[j].ECA2 &&
            this.state.storage[i].check_Ea3 != activity[j].ECA3
          ) {
            notaFEvaluation = 3;
          } else if (
            this.state.storage[i].check_Ea1 != activity[j].ECA1 &&
            this.state.storage[i].check_Ea2 != activity[j].ECA2 &&
            this.state.storage[i].check_Ea3 != activity[j].ECA3
          ) {
            notaFEvaluation = 0;
          } else {
            notaFEvaluation = 0;
          }
          if (this.state.storage[i].check_inicio == "1") {
            progressoActivity = progressoActivity + 0.1;
          }
          if (this.state.storage[i].check_video == "1") {
            progressoActivity = progressoActivity + 0.1;
          }
          if (this.state.storage[i].check_answer == "1") {
            progressoActivity = progressoActivity + 0.3;
          }
          if (this.state.storage[i].check_download == "1") {
            progressoActivity = progressoActivity + 0.2;
          }
          if (this.state.storage[i].check_Ea1 != "0") {
            progressoActivity = progressoActivity + 0.3;
          }
          const totalActivity = (notaF + notaFEvaluation) / 2;
          const dataActividadEvent = {
            id_evento: this.state.storage[i].id_evento,
            id_actividad: activity[j].id_actividad,
            nombre_actividad: activity[j].titulo_actividad,
            nota: notaF,
            notaEvaluation: notaFEvaluation,
            totalNota: totalActivity,
            count_videos: this.state.storage[i].count_video,
            progresso: progressoActivity,
            totalScore: calculateAllScore(this.state.storage[i]),
          };
          storageActividad.push(dataActividadEvent);
          const resultado = Array.from(
            new Set(storageActividad.map((s) => s.id_actividad))
          ).map((id_actividad) => {
            return {
              id_actividad: id_actividad,
              nombre_actividad: storageActividad.find(
                (s) => s.id_actividad === id_actividad
              ).nombre_actividad,
              nota: storageActividad.find(
                (s) => s.id_actividad === id_actividad
              ).nota,
              notaEvaluation: storageActividad.find(
                (s) => s.id_actividad === id_actividad
              ).notaEvaluation,
              totalNota: storageActividad.find(
                (s) => s.id_actividad === id_actividad
              ).totalNota,
              count_videos: storageActividad.find(
                (s) => s.id_actividad === id_actividad
              ).count_videos,
              progresso: storageActividad.find(
                (s) => s.id_actividad === id_actividad
              ).progresso,
              id_evento: storageActividad.find(
                (s) => s.id_actividad === id_actividad
              ).id_evento,
              totalScore: storageActividad.find(
                (s) => s.id_actividad === id_actividad
              ).totalScore,
              subject: this.filtro(id_actividad),
            };
          });
          this.setState({ result: resultado });
        }
      }
    }
    const arr = this.state.result.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    this.setState({ totalScore: 0 }); //reset counter
    arr.map((obj) =>
      this.setState((prevState) => ({
        totalScore: prevState?.totalScore + (obj?.totalScore || 0),
      }))
    );
    await this.getStudentInfo();
    await this.studentRanked();
    this.props.dispatch({
      type: "SET_LOADING",
      payload: false,
    });
  }

  async getStudentInfo() {
    let student = await getStudentdb(this.props.student.id_estudiante);
    student[0].nombre_usuario = String(this.state.totalScore); //total score into nombre_usuario key.
    await updateStudentdb(
      student[0],
      this.props.ipconfig,
      this.props.internetConnection
    );
  }

  async studentRanked() {
    let student = await getStudentdb(this.props.student.id_estudiante);
    let studentsTorank = [];
    if (!this.props.internetConnection) {
      studentsTorank = await getStudentsByschool(
        student[0].id_colegio,
        student[0].grado_estudiante
      );
    } else {
      await getStudentsInServerByschool(this.props.ipconfig);
      studentsTorank = await getStudentsByschool(
        student[0].id_colegio,
        student[0].grado_estudiante
      );
    }
    studentsTorank.find((studentRank, key) => {
      if (studentRank.id_estudiante === student[0].id_estudiante)
        this.setState({ place: key + 1 });
    });
  }

  keyExtractor = (item) => item.id_actividad.toString();

  viewContenido = (item) => {
    let activity = {};
    const handler = () => {
      const res = item.subject; //handler to send data for the selected activity.
      activity = res;
      this.props.dispatch({
        type: "SET_SELECT_ACTIVITIES_SUBJECT_LIST",
        payload: {
          activity: activity[0],
        },
      });
    };
    if (item.subject) {
      handler();
      this.props.navigation.navigate({
        name: "SelectMoment",
      });
    } else {
      Alert.alert(
        "Error",
        "Recuerde Cargar datos Previamente",
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  };
  async loadData() {
    await this.consulta();
    if (Object.keys(this.state.storage)?.length === 0) {
      Alert.alert(
        "Error",
        "Aún no tienes avances en las actividades.",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    } else {
      this.loadActivities();
    }
  }

  changeColor(val) {
    var color = "#70C2E5";

    if (val == 1) {
      color = "#FFD700";
    } else if (val == 2) {
      color = "#C0C0C0";
    } else if (val == 3) {
      color = "#CD7F32";
    }
    return color;
  }

  renderItem = ({ item }) => {
    if (item.id_actividad != 0) {
      return (
        <ActivityEvents
          {...item}
          onPress={() => {
            this.viewContenido(item);
          }}
        />
      );
    } else return null;
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerText}>
          <Stack direction="row" alignItems="center">
            <Spacer />
            <FontAwesome5
              name="award"
              size={65}
              color={this.changeColor(this.state.place)}
            />
            <Text
              style={{
                fontSize: 65,
                fontWeight: "bold",
                color: this.changeColor(this.state.place),
              }}
            >
              {this.state.place}
            </Text>

            <Spacer />
            <Stack direction="column" alignItems="center">
              <Text style={styles.nombre}>
                {this.props.student.nombre_estudiante}{" "}
                {this.props.student.apellido_estudiante}
              </Text>
              <Text style={styles.grado}>
                Grado: {this.props.student.grado_estudiante}
              </Text>
              <Text style={styles.grado}>
                {"Puntaje: " + this.state.totalScore}
              </Text>
            </Stack>
            <Spacer />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Spacer />
            {this.state.place !== 1 && (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "¿Qué signfica este número?",
                    "Actualmente ocupas el puesto " +
                      this.state.place +
                      " entre tus compañer@s de curso. \n\nPara mejorar tu puesto puedes ver el material de tus cursos y sacar buenos resultados en los test y evaluaciones",
                    [{ text: "OK" }],
                    { cancelable: false }
                  )
                }
              >
                <FontAwesome5
                  name="question-circle"
                  size={35}
                  color="#70C2E5"
                />
              </TouchableOpacity>
            )}
            <Spacer />
            <CustomButton text="Cargar Datos" onPress={() => this.loadData()} />
            <Spacer />
          </Stack>
          <Text style={styles.TextoDatos}>{this.state.active}</Text>
        </View>
        <FlatList
          data={this.state.result}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
        <FetchUserData loadAll={this.loadActivities.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  TextoDatos: {
    marginBottom: 15,
    marginTop: 15,
    fontSize: 14,
    color: "#4F4F4F",
    fontWeight: "bold",
  },
  nombre: {
    marginTop: 10,
    fontSize: 20,
    color: "#44546b",
    fontWeight: "bold",
  },
  containerText: {
    alignItems: "center",
    justifyContent: "center",
  },
  grado: {
    fontSize: 16,
    color: "#6b6b6b",
    fontWeight: "bold",
    marginBottom: 10,
  },
});
function mapStateToProps(state) {
  return {
    student: state.videos.selectedStudent,
    ipconfig: state.videos.selectedIPConfig,
    subject: state.videos.selectedSubjects,
    list: state.videos.activity,
    internetConnection: state.connection.isConnected,
  };
}

export default connect(mapStateToProps)(Profile);
