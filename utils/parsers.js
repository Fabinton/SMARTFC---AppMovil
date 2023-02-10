import * as SQLite from "expo-sqlite";
import API from "./api";
import {
  createResult,
  evaluationQuery,
  studentToDBQuery,
  testQuery,
  updateStudentQuery,
} from "./dbQueries";

export const calculateTestGrade = (
  selectedAns = 0,
  correctAns,
  time,
  evaluationType
) => {
  console.log("selected - correct", selectedAns, correctAns);
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
  evaluationType,
  internetConnection,
  selectedIPConfig,
  dispatch,
  navigation
) => {
  dispatch({
    type: "SET_LOADING",
    payload: true,
  });
  navigation.navigate({
    name: "Mis cursos",
  });

  console.log(
    "evaScore, ans in order they'll save",
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

  await new Promise((resolve, reject) => {
    //save event into db.
    db.transaction(
      (tx) => {
        tx.executeSql(text, query, (query, { rows: { _array } }) => {
          if (!query._error) {
            resolve(_array);
          } else {
            reject(query._error);
          }
        });
      },
      null,
      null
    );
  });
  const allEvents = await selectAllEventsBd();
  await inserFlatEventsBd(allEvents[allEvents.length - 1].id_evento);
  const allFlatEvents = await selectAllFlatEventsBd();
  if (internetConnection) {
    await syncServer(
      allEvents,
      allFlatEvents,
      selectedIPConfig,
      id_estudiante,
      dispatch
    );
  } else {
    dispatch({
      type: "SET_LOADING",
      payload: false,
    });
  }
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

export const getEventsLocalDB = async (id_estudiante) => {
  const db = SQLite.openDatabase("db5.db");
  const store = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from events where id_estudiante = ?;`,
        [id_estudiante],
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
  return store;
};

export const calculateAllScore = (event) => {
  let score = 0;
  if (event.check_video === 1) score = score + 400;
  if (event.check_download === 1) score = score + 800;
  if (event.check_inicio === 1) score = score + 150;
  return (score = score + (event.check_fin + event.check_document));
};

export const getStudentdb = async (id_estudiante) => {
  const db = SQLite.openDatabase("db5.db");
  const student = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from students where id_estudiante = ?;`,
        [id_estudiante],
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
  return student;
};

export const updateStudentdb = async (
  studentToUpdate,
  ip,
  internetConnection
) => {
  const db = SQLite.openDatabase("db5.db");
  const { text, studentValues } = updateStudentQuery(studentToUpdate);
  await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(text, studentValues, (query, { rows: { _array } }) => {
        if (!query._error) {
          resolve(_array);
        } else {
          reject(query._error);
        }
      });
    });
  });
  const currentStudent =
    internetConnection && (await getStudentdb(studentToUpdate.id_estudiante)); //this just in case saving in db fails.
  internetConnection &&
    API.updateStudents(ip, currentStudent[0])
      .then()
      .catch((e) => console.log("error saving score", e));
};

export const selectAllEventsBd = async () => {
  const db = SQLite.openDatabase("db5.db");
  const store = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from events ;`,
        [],
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
  return store;
};

export const selectAllFlatEventsBd = async () => {
  const db = SQLite.openDatabase("db5.db");
  const store = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from flatEvent ;`,
        [],
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
  return store;
};

export const inserFlatEventsBd = async (id) => {
  const db = SQLite.openDatabase("db5.db");
  await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into flatEvent (id_evento, upload) values (?, ?)`,
        [id, 0],
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
};

export const updateUploadedFlat = async (state = 1, id) => {
  const db = SQLite.openDatabase("db5.db");
  await new Promise(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `update flatEvent set upload = ? where id_evento = ? ;`,
        [state, id],
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
};

export const syncServer = async (
  allEvents,
  allFlatEvents,
  selectedIPConfig,
  id_estudiante,
  dispatch
) => {
  let EventsServerlength = 0;
  await API.loadEventsLast(selectedIPConfig) // loading all events (extract length) to set the current event an id.
    .then(({ data }) => (EventsServerlength = data.length + 1))
    .catch((e) => {
      console.log("fallo al traer todos los eventos", e);
    });
  const id_estudianteF = parseInt("" + id_estudiante + EventsServerlength);
  if (EventsServerlength.toString().length > 0) {
    allFlatEvents?.map((flat) => {
      const id_eventoFs = flat.id_evento;
      if (flat.upload === 0) {
        allEvents?.map((event) => {
          // map all flat events to check if it is uploaded,map all event to set the id event and sending it to the server.
          if (flat.id_evento === event.id_evento) {
            event.id_evento = id_estudianteF;
            API.createEvents(selectedIPConfig, event)
              .then(async () => {
                await updateUploadedFlat(1, id_eventoFs); // change the upload state to 1 (uploaded)
              })
              .catch((e) => {
                console.log("fallo guardando evento en bd", e);
              })
              .finally(() => {
                dispatch({
                  type: "SET_LOADING",
                  payload: false,
                });
              });
          }
        });
      }
    });
  }
};

export const getStudentsByschool = async (id_school, id_grado) => {
  const db = SQLite.openDatabase("db5.db");
  const store = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from students where id_colegio = ? and grado_estudiante = ? order by curso_estudiante  desc ;`,
        [id_school, id_grado],
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
  // const userNameNumber = store.flatMap((stu) => {
  //   //function to create an array with the username transform to number
  //   if (!stu.nombre_usuario.includes("$")) return [];
  //   else {
  //     return {
  //       ...stu,
  //       nombre_usuario: +stu.nombre_usuario.split("$")[0],
  //     };
  //   }
  // });
  // // sorting the previous array to get the student rank
  // const sortedStudents = userNameNumber.sort(
  //   (a, b) => b.nombre_usuario - a.nombre_usuario
  // );
  console.log("store updated", store);
  return store;
};

export const insertStudentDB = async (student) => {
  const db = SQLite.openDatabase("db5.db");
  const { text, studentInfo } = studentToDBQuery(student);
  await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(text, studentInfo, (query, { rows: { _array } }) => {
        if (!query._error) {
          resolve(_array);
        } else {
          reject(query._error);
        }
      });
    });
  });
};

export const getStudentsInServerByschool = async (ip) => {
  await API.allStudent(ip)
    .then(({ data }) => {
      data.map(async (student) => {
        if (student.id_estudiante === 81700346411)
          await updateStudentdb(student, "45.231.184.246", false);
      });
    })
    .catch((e) => console.log("error trayendo estudiantes", e));
};
