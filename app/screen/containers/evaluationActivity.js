// import React, { Component } from "react";
// import HeaderReturn from "../../components/headerReturn";
// import { StyleSheet, Text, ScrollView, Alert } from "react-native";
// import { Animated } from "react-native";
// import { connect } from "react-redux";
// import RadioForm from "react-native-simple-radio-button";
// import * as SQLite from "expo-sqlite";
// import API from "../../../utils/api";
// import QuestionActivity from "../../components/QuestionActivity";
// import { View } from "react-native";
// import CustomButton from "../../components/customButton";

// const db = SQLite.openDatabase("db5.db");

// class evaluationActivity extends Component {
//   state = {
//     opacity: new Animated.Value(0),
//     value1: 0,
//     value2: 0,
//     value3: 0,
//     storage: null,
//     storageFilter: null,
//     storageFlats: null,
//   };
//   static navigationOptions = ({ navigation }) => {
//     return {
//       header: (
//         <HeaderReturn onPress={() => navigation.goBack()}>
//           Realiza tu Examen**
//         </HeaderReturn>
//       ),
//     };
//   };
//   componentDidMount() {
//     Animated.timing(this.state.opacity, {
//       toValue: 1,
//       duration: 1000,
//     }).start();
//     db.transaction((tx) => {
//       tx.executeSql(
//         "create table if not exists events (id_evento integer primary key not null, data_start text, hour_start text, data_end text, hour_end text, id_actividad int, id_estudiante int, check_download int, check_inicio int, check_fin int, check_answer int, count_video int, check_video int, check_document int, check_a1 int, check_a2 int, check_a3 int, check_profile int, answers text );"
      
//         );
//       console.log('Ingreso transaction 44');
//       tx.executeSql(
//         "create table if not exists flatEvent (id_evento integer not null, upload int);"
//       );
//       console.log('Ingreso transaction 48');
//       tx.executeSql("select * from events", [], (_, { rows: { _array } }) =>
//         this.setState({ storage: _array })
//       );
//       console.log('Ingreso transaction 52');
//       tx.executeSql(
//         `select * from flatEvent ;`,
//         [],
//         (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
//       );
//       console.log('Ingreso transaction 58');
//       tx.executeSql(
//         `select * from events where id_estudiante=? and id_actividad=?;`,
//         [this.props.student.id_estudiante, this.props.activity.id_actividad],
//         (_, { rows: { _array } }) => this.setState({ storageFilter: _array })
//       );
//       console.log('Ingreso transaction 64');
//     });
//   }
//   updateFlat() {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `select * from flatEvent ;`,
//         [],
//         (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
//       );
//       console.log('Ingreso transaction 74');
//     });
//   }
//   update() {
//     db.transaction((tx) => {
//       tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
//         this.setState({ storage: _array })
//       );
//     });

//     db.transaction(
//       (tx) => {
//         tx.executeSql(
//           `insert into flatEvent (id_evento, upload) values (?, ?)`,
//           [this.state.storage[this.state.storage.length - 1].id_evento, 0]
//         );
//       },
//       null,
//       null
//     );
//     db.transaction((tx) => {
//       tx.executeSql(
//         `select * from flatEvent ;`,
//         [],
//         (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
//       );
//     });
//     this.updateFlat();
//   }
//   storageTest() {
//     var date = new Date().getDate();
//     var month = new Date().getMonth() + 1;
//     var year = new Date().getFullYear();
//     var dataComplete = date + "/" + month + "/" + year;
//     var hours = new Date().getHours();
//     var min = new Date().getMinutes();
//     var hoursComplete = hours + ":" + min;
//     db.transaction((tx) => {
//       tx.executeSql(
//         `select * from events where id_estudiante=? and id_actividad=?;`,
//         [this.props.student.id_estudiante, this.props.activity.id_actividad],
//         (_, { rows: { _array } }) => this.setState({ storageFilter: _array })
//       );
//     });

//     var storageFilterGood = this.state.storageFilter;
//     var storageFilter = storageFilterGood.reverse();
//     if (storageFilter.length == 0) {
//       resultado = [
//         {
//           check_a1: 0,
//           check_a2: 0,
//           check_a3: 0,
//           check_inicio: 0,
//           check_video: 0,
//           count_video: 0,
//           check_answer: 0,
//           check_download: 0,
//         },
//       ];
//     }
//     if (storageFilter.length != 0) {
//       resultado = Array.from(new Set(storageFilter.map(s => s.id_actividad)))
//         .map(id_actividad => {
//           return {
//             id_actividad: id_actividad,
//             data_start: storageFilter.find(s => s.id_actividad === id_actividad).data_start,
//             check_video: storageFilter.find(s => s.id_actividad === id_actividad).check_video,
//             count_video: storageFilter.find(s => s.id_actividad === id_actividad).count_video,
//             check_a1: storageFilter.find(s => s.id_actividad === id_actividad).check_a1,
//             check_a2: storageFilter.find(s => s.id_actividad === id_actividad).check_a2,
//             check_a3: storageFilter.find(s => s.id_actividad === id_actividad).check_a3,
//             check_answer: storageFilter.find(s => s.id_actividad === id_actividad).check_answer,
//             check_download: storageFilter.find(s => s.id_actividad === id_actividad).check_download,
//             check_inicio: storageFilter.find(s => s.id_actividad === id_actividad).check_inicio,
//             id_evento: storageFilter.find(s => s.id_actividad === id_actividad).id_evento,
//           };
//         });
//     }

//     db.transaction(
//       (tx) => {
//         tx.executeSql(
//           "insert into events (data_start, hour_start, data_end, hour_end, id_actividad, id_estudiante, check_download, check_inicio, check_fin, check_answer, count_video, check_video, check_document, check_a1, check_a2, check_a3, check_profile, check_Ea1, check_Ea2, check_Ea3) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
//           [
//             dataComplete,
//             hoursComplete,
//             dataComplete,
//             hoursComplete,
//             this.props.activity.id_actividad,
//             this.props.student.id_estudiante,
//             resultado[0].check_download,
//             resultado[0].check_inicio,
//             0,
//             resultado[0].check_answer,
//             resultado[0].count_video,
//             resultado[0].check_video,
//             0,
//             resultado[0].check_a1,
//             resultado[0].check_a2,
//             resultado[0].check_a3,
//             0,
//             this.state.value1,
//             this.state.value2,
//             this.state.value3,
//             JSON.stringify(this.state.resultQuestions)
//           ]
//         );
//       },
//       null,
//       null
//     );
//     db.transaction((tx) => {
//       tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
//         this.setState({ storage: _array })
//       );
//     });

//     this.update();
//     Alert.alert(
//       "Almacenamiento Exitoso",
//       "Sus respuestas han sido almacenadas recuerde sincronizar con su servidor cuando este en el colegio",
//       [{ text: "OK", onPress: () => {} }],
//       { cancelable: false }
//     );
//   }
//   consulta() {
//     db.transaction((tx) => {
//       tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
//         this.setState({ storage: _array })
//       );
//       tx.executeSql(
//         `select * from flatEvent ;`,
//         [],
//         (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
//       );
//     });
//   }
//   sendServer() {
//     if (this.props.internetConnection) {
//       db.transaction((tx) => {
//         tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
//           this.setState({ storage: _array })
//         );
//         tx.executeSql(
//           `select * from flatEvent ;`,
//           [],
//           (_, { rows: { _array } }) => this.setState({ storageFlats: _array })
//         );
//       });
//       var data = this.state.storage;
//       var Flats = this.state.storageFlats;
//       Flats.map((flat) => {
//         if (flat.upload === 0) {
//           data.map((event) => {
//             if (flat.id_evento === event.id_evento) {
//               this.props.dispatch({
//                 type: "SET_LOADING",
//                 payload: true,
//               });
//               API.loadEventsLast(this.props.ipconfig)
//                 .then(({ data }) => {
//                   let dataLength = data?.length;
//                   dataLength = dataLength + 1;
//                   var id_estudianteF = parseInt(
//                     "" + this.props.student.id_estudiante + dataLength
//                   );
//                   event.id_evento = id_estudianteF;
//                   var id_eventoFs = flat.id_evento;
//                   API.createEvents(this.props.ipconfig, event)
//                     .then(() => {
//                       db.transaction((tx) => {
//                         tx.executeSql(
//                           `update flatEvent set upload = ? where id_evento = ? ;`,
//                           [1, id_eventoFs]
//                         );
//                         tx.executeSql(
//                           "select * from flatEvent",
//                           [],
//                           (_, { rows: { _array } }) => console.log(_array)
//                         );
//                       });
//                       Alert.alert(
//                         "Sincronización exitosa",
//                         "La sincronización de respuestas fue exitosa",
//                         [
//                           {
//                             text: "OK",
//                             onPress: () => {},
//                           },
//                         ],
//                         { cancelable: false }
//                       );
//                     })
//                     .catch((e) => {
//                       console.log("error sync", e);
//                       Alert.alert(
//                         "ERROR",
//                         "Ha ocurrido un error al momento de guardar los eventos.",
//                         [{ text: "OK", onPress: () => {} }],
//                         { cancelable: false }
//                       );
//                     })
//                     .finally(() => {
//                       this.props.dispatch({
//                         type: "SET_LOADING",
//                         payload: false,
//                       });
//                     });
//                 })
//                 .catch((e) => {
//                   console.log("fallo en load", e);
//                 })
//                 .finally(() => {});
//             }
//           });
//         }
//       });
//     } else {
//       Alert.alert(
//         "ERROR",
//         "Recuerda que debes estar conectado a internet para sincronizar.",
//         [{ text: "OK", onPress: () => {} }],
//         { cancelable: false }
//       );
//     }
//   }
//   render() {
//     return (
//       <ScrollView style={styles.container}>
//         {this.props.activity.questions.map((value_3, index) => {
//           if (value_3.type == 1) {
//             return (<View key={"v_" + value_3.id}>
//               <Text key={"t_" + value_3.id}>{value_3.question}</Text>
//                 <TextInput 
//                 style={styles.input} key={value_3.id}
//                 onChangeText={(value) => { 
//                   let { resultQuestions } = this.state
//                   resultQuestions[index] = {
//                     id: value_3.id, 
//                     value:value
//                   }
//                   this.setState({...this.state,resultQuestions})
//                  }}></TextInput>
//             </View>)

//             //realizar iput
//           } else {
//             return (<View key={"v_" + value_3.id}>
//               <Text key={"t_" + value_3.id} >{
//                 value_3.question} </Text>
//               <RadioForm
//                 radio_props={value_3.options.map(option=>({label:option.question,value:option.id}))}
//                 initial={0}
//                 onPress={(value) => { 
//                   let { resultQuestions } = this.state
//                   resultQuestions[index] = {
//                     id: value_3.id, 
//                     value:value
//                   }
//                   this.setState({...this.state,resultQuestions})
//                  }}
//                 labelColor={'#9C9C9C'}
//                 key={value_3.id}
//               />
//             </View>)

//           }
//         })}

//         <Button title="Guardar" style={styles.buttonstyle} onPress={() => this.storageTest()} />

//         <Button title="Sincronizar" style={styles.buttonstyle} onPress={() => this.sendServer()} />
//       </ScrollView>
//     );
//   }
// }
// function mapStateToProps(state) {
//   return {
//     activity: state.videos.selectedActivity,
//     student: state.videos.selectedStudent,
//     ipconfig: state.videos.selectedIPConfig,
//     internetConnection: state.connection.isConnected,
//   };
// }
// const styles = StyleSheet.create({
//   container: {
//     marginLeft: 15,
//     marginRight: 15,
//   },
//   texto: {
//     fontWeight: "bold",
//     fontSize: 16,
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignContent: "space-around",
//     marginTop: 30,
//   },
//   buttonstyle: {
//     padding: 20,
//     margin: 20,
//     paddingTop: 20,
//     marginTop: 30,
//   },
// });
// export default connect(mapStateToProps)(evaluationActivity);
