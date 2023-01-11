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
  evaScore,
  evaluationType
) => {
  console.log(
    "evaScore",
    evaScore,
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
        answers,
        evaScore
      )
    : testQuery(
        dataComplete,
        hoursComplete,
        id_actividad,
        id_estudiante,
        resultado,
        answers,
        evaScore
      );
  db.transaction(
    (tx) => {
      tx.executeSql(text, query);
    },
    null,
    null
  );
  db.transaction((tx) => {
    tx.executeSql(`select * from events ;`, [], (_, { rows: { _array } }) => {
      console.log("eventos", _array);
    });
  });

  // this.update();
  // Alert.alert(
  //   "Almacenamiento Exitoso",
  //   "Sus respuestas han sido almacenadas recuerde sincronizar con su servidor cuando este en el colegio",
  //   [{ text: "OK", onPress: () => console.log("OK Pressed") }],
  //   { cancelable: false }
  // );
};

export const createEvaluation = (test, evaluationType) => {
  function evaluationSelector(evaluationTest, questionActivity) {
    // evaluationTest = "realiza tu examen", questionActivity = "realiza el test"
    if (evaluationType) {
      return evaluationTest;
    } else {
      return questionActivity;
    }
  }
  const evaluation = [
    {
      question: evaluationSelector(test?.EQ1, test?.Q1),
      answers: [
        {
          res: evaluationSelector(test?.EA11, test?.A11),
          id: 1,
          correctAns: evaluationSelector(test?.ECA1, test?.CA1),
        },
        {
          res: evaluationSelector(test?.EA12, test?.A12),
          id: 2,
          correctAns: evaluationSelector(test?.ECA1, test?.CA1),
        },
        {
          res: evaluationSelector(test?.EA13, test?.A13),
          id: 3,
          correctAns: evaluationSelector(test?.ECA1, test?.CA1),
        },
        {
          res: evaluationSelector(test?.EA14, test?.A14),
          id: 4,
          correctAns: evaluationSelector(test?.ECA1, test?.CA1),
        },
      ],
      questionID: 1,
      step: 1,
    },
    {
      question: evaluationSelector(test?.EQ2, test?.Q2),
      answers: [
        {
          res: evaluationSelector(test?.EA21, test?.A21),
          id: 1,
          correctAns: evaluationSelector(test?.ECA2, test?.CA2),
        },
        {
          res: evaluationSelector(test?.EA22, test?.A22),
          id: 2,
          correctAns: evaluationSelector(test?.ECA2, test?.CA2),
        },
        {
          res: evaluationSelector(test?.EA23, test?.A23),
          id: 3,
          correctAns: evaluationSelector(test?.ECA2, test?.CA2),
        },
        {
          res: evaluationSelector(test?.EA24, test?.A24),
          id: 4,
          correctAns: evaluationSelector(test?.ECA2, test?.CA2),
        },
      ],
      questionID: 2,
      step: 2,
    },
    {
      question: evaluationSelector(test?.EQ3, test?.Q3),
      answers: [
        {
          res: evaluationSelector(test?.EA31, test?.A31),
          id: 1,
          correctAns: evaluationSelector(test?.ECA3, test?.CA3),
        },
        {
          res: evaluationSelector(test?.EA32, test?.A32),
          id: 2,
          correctAns: evaluationSelector(test?.ECA3, test?.CA3),
        },
        {
          res: evaluationSelector(test?.EA33, test?.A33),
          id: 3,
          correctAns: evaluationSelector(test?.ECA3, test?.CA3),
        },
        {
          res: evaluationSelector(test?.EA34, test?.A34),
          id: 4,
          correctAns: evaluationSelector(test?.ECA3, test?.CA3),
        },
      ],
      questionID: 3,
      step: 3,
    },
  ];
  return { evaluation };
};
