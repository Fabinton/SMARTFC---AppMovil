import * as SQLite from "expo-sqlite";

export const calculateTestGrade = (
  selectedAns = 0,
  correctAns,
  time,
  evaluationType
) => {
  const maxTime = 35;
  const value = evaluationType ? 200 : 100; // max value if user press the correct answer in the lowest time.
  const correct = evaluationType ? 200 : 100; // default value if user press the correct answer.
  let result;
  if (selectedAns === correctAns) {
    result = Math.ceil((result = (value * (maxTime - time)) / maxTime));
    return correct + result;
  }
  return 0;
};
export const saveEventsDB = (id_estudiante, id_actividad) => {
  const db = SQLite.openDatabase("db5.db");
  let store = null;
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const dataComplete = date + "/" + month + "/" + year;
  const hours = new Date().getHours();
  const min = new Date().getMinutes();
  const hoursComplete = hours + ":" + min;
  db.transaction((tx) => {
    tx.executeSql(
      `select * from events where id_estudiante=? and id_actividad=?;`,
      [id_estudiante, id_actividad],
      (_, { rows: { _array } }) => (store = _array)
    );
  });
  console.log("store", store);
  // const storageFilterGood = store;
  // const storageFilter = storageFilterGood.reverse();
  // if (storageFilter.length == 0) {
  //   resultado = [
  //     {
  //       check_a1: 0,
  //       check_a2: 0,
  //       check_a3: 0,
  //       check_inicio: 0,
  //       check_video: 0,
  //       count_video: 0,
  //       check_answer: 0,
  //       check_download: 0,
  //     },
  //   ];
  // }
  // if (storageFilter.length != 0) {
  //   resultado = Array.from(
  //     new Set(storageFilter.map((s) => s.id_actividad))
  //   ).map((id_actividad) => {
  //     return {
  //       id_actividad: id_actividad,
  //       data_start: storageFilter.find((s) => s.id_actividad === id_actividad)
  //         .data_start,
  //       check_video: storageFilter.find((s) => s.id_actividad === id_actividad)
  //         .check_video,
  //       count_video: storageFilter.find((s) => s.id_actividad === id_actividad)
  //         .count_video,
  //       check_a1: storageFilter.find((s) => s.id_actividad === id_actividad)
  //         .check_a1,
  //       check_a2: storageFilter.find((s) => s.id_actividad === id_actividad)
  //         .check_a2,
  //       check_a3: storageFilter.find((s) => s.id_actividad === id_actividad)
  //         .check_a3,
  //       check_answer: storageFilter.find((s) => s.id_actividad === id_actividad)
  //         .check_answer,
  //       check_download: storageFilter.find(
  //         (s) => s.id_actividad === id_actividad
  //       ).check_download,
  //       check_inicio: storageFilter.find((s) => s.id_actividad === id_actividad)
  //         .check_inicio,
  //       id_evento: storageFilter.find((s) => s.id_actividad === id_actividad)
  //         .id_evento,
  //     };
  //   });
  // }

  // db.transaction(
  //   (tx) => {
  //     tx.executeSql(
  //       "insert into events (data_start, hour_start, data_end, hour_end, id_actividad, id_estudiante, check_download, check_inicio, check_fin, check_answer, count_video, check_video, check_document, check_a1, check_a2, check_a3, check_profile, check_Ea1, check_Ea2, check_Ea3) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
  //       [
  //         dataComplete,
  //         hoursComplete,
  //         dataComplete,
  //         hoursComplete,
  //         this.props.activity.id_actividad,
  //         this.props.student.id_estudiante,
  //         resultado[0].check_download,
  //         resultado[0].check_inicio,
  //         0,
  //         resultado[0].check_answer,
  //         resultado[0].count_video,
  //         resultado[0].check_video,
  //         0,
  //         resultado[0].check_a1,
  //         resultado[0].check_a2,
  //         resultado[0].check_a3,
  //         0,
  //         this.state.value1,
  //         this.state.value2,
  //         this.state.value3,
  //       ]
  //     );
  //   },
  //   null,
  //   null
  // );
  // db.transaction((tx) => {
  //   tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
  //     this.setState({ storage: _array })
  //   );
  // });

  // this.update();
  // Alert.alert(
  //   "Almacenamiento Exitoso",
  //   "Sus respuestas han sido almacenadas recuerde sincronizar con su servidor cuando este en el colegio",
  //   [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //   { cancelable: false }
  // );
};
