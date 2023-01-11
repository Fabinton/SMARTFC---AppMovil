import * as SQLite from "expo-sqlite";
import { createResult, evaluationQuery, testQuery } from "./dbQueries";

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

export const saveEventsDB = async (
  id_estudiante,
  id_actividad,
  answers,
  score,
  evaluationType
) => {
  console.log(
    "score",
    score,
    Object.values(answers)[0],
    Object.values(answers)[1],
    Object.values(answers)[2]
  );
  const db = SQLite.openDatabase("db5.db");
  let resultado = [];
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const dataComplete = date + "/" + month + "/" + year;
  const hours = new Date().getHours();
  const min = new Date().getMinutes();
  const hoursComplete = hours + ":" + min;
  const store = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from events where id_estudiante=? and id_actividad=?;`,
        [id_estudiante, id_actividad],
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
  const storageFilter = store.reverse();

  if (storageFilter.length === 0) {
    resultado = [
      {
        check_a1: 0,
        check_a2: 0,
        check_a3: 0,
        check_inicio: 0,
        check_video: 0,
        count_video: 0,
        check_answer: 0,
        check_download: 0,
      },
    ];
  }

  if (storageFilter.length != 0) {
    resultado = createResult(storageFilter, evaluationType);
  }
  const { text, query } = evaluationType
    ? evaluationQuery(
        dataComplete,
        hoursComplete,
        id_actividad,
        id_estudiante,
        resultado,
        answers
      )
    : testQuery(
        dataComplete,
        hoursComplete,
        id_actividad,
        id_estudiante,
        resultado,
        answers
      );
  db.transaction(
    (tx) => {
      tx.executeSql(text, query);
    },
    null,
    null
  );
  db.transaction((tx) => {
    tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) =>
      console.log("eventos", _array)
    );
  });

  // this.update();
  // Alert.alert(
  //   "Almacenamiento Exitoso",
  //   "Sus respuestas han sido almacenadas recuerde sincronizar con su servidor cuando este en el colegio",
  //   [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //   { cancelable: false }
  // );
};
