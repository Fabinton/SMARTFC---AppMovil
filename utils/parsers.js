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
  console.log("selected - correctss", selectedAns, correctAns);
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
    "linea 49 evaScore, ans in order they'll save",
    evaScore,
    Object.values(answers)
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
  console.log('stpre ',store);
  const storageFilter = store.reverse();
  
  console.log('82 storageFilter '+storageFilter);
  if (storageFilter.length === 0) {
    console.log(storageFilter.length + 'contador ');
    resultado = [
      {
        check_a1: "",
        check_a2: "",
        check_a3: "",
        check_inicio: 0,
        check_video: 0,
        count_video: 0,
        check_answer: 0,
        check_download: 0,
      },
    ];
    console.log('resultado 96'+  resultado.check_a1);
  }

  if (storageFilter.length != 0) {
    resultado = createResult(storageFilter, evaluationType);
  }

  console.log('resultados sss ',resultado );
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
    console.log('resultado '+ resultado[0].check_a1);
    console.log('query ', query);
    await new Promise((resolve, reject) => {
      //save event into db.
      //console.log('Guardar eventos en bd '+ text + ' query '+query);
      db.transaction(
        (tx) => {
          tx.executeSql(text, query, (query, { rows: { _array } }) => {
            if (!query._error) {
              console.log('text ',text , ' query ', query);
              resolve(_array);
              console.log('array '+ _array);
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
  console.log('allEvents ',allEvents);
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
  function evaluationSelector(questionActivity) {
    // Realiza cualquier manipulación o lógica necesaria para obtener las evaluaciones
    return questionActivity;
  }

  const evaluation = [];

  // Iterar sobre las preguntas de test.questions
  for (let i = 0; i < test?.questions?.length; i++) {
    const question = evaluationSelector(test.questions[i]?.question);
    const options = evaluationSelector(test.questions[i]?.options);
    const correct = evaluationSelector(test.questions[i]?.correct);
    const retro = evaluationSelector(test.questions[i]?.retro);
    const questionID = evaluationSelector(test.questions[i]?.id);
    const step = i + 1;

    // Generar las respuestas para la pregunta actual
    const answers = options.map((option) => ({
      id: evaluationSelector(option.id),
      question: evaluationSelector(option.question),
    }));

    // Agregar la evaluación al array evaluation
    evaluation.push({
      question,
      answers,
      correct,
      retro,
      questionID,
      step,
    });
  }
  return { evaluation };
};


export const createQuiz = (test, evaluationType) => {
  function questionSelector(questionActivity) {
    // evaluationTest = "realiza tu examen", questionActivity = "realiza el test"
      return questionActivity;
  }
  const quiz = [
    {
      question: questionSelector(test?.Q1),
      answers: [
        {
          question: questionSelector(test?.A11),
          id: "A",
        },
        {
          question: questionSelector(test?.A12),
          id: "B",
        },
        {
          question: questionSelector(test?.A13),
          id: "C",
        },
        {
          question: questionSelector(test?.A14),
          id: "D",
        },
      ],
      questionID: 1,
      step: 1,
      correct : questionSelector(test?.CA1),
      retro:questionSelector(test?.RQ1),
    },
    {
      question: questionSelector(test?.Q2),
      answers: [
        {
          question: questionSelector(test?.A21),
          id: "A",
        },
        {
          question: questionSelector(test?.A22),
          id: "B",
        },
        {
          question: questionSelector(test?.A23),
          id: "C",
        },
        {
          question: questionSelector(test?.A24),
          id: "D",
        },
      ],
      correct:questionSelector(test?.CA2),
      retro:questionSelector(test?.RQ2),
      questionID: 2,
      step: 2,
    },
    {
      question: questionSelector(test?.Q3),
      answers: [
        {
          question: questionSelector(test?.A31),
          id: "A",
        },
        {
          question: questionSelector(test?.A32),
          id: "B",
        },
        {
          question: questionSelector(test?.A33),
          id: "C",
        },
        {
          question: questionSelector(test?.A34),
          id: "D",
        },
      ],
      questionID: 3,
      step: 3,
      correct:questionSelector(test?.CA3),
      retro:questionSelector(test?.RQ3),
    },
  ];
  //console.log('quiz mejor ', quiz );
  return { quiz };
};

export const getEventsLocalDB = async (id_estudiante) => {
  console.log('idestudiante ',id_estudiante);
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
  console.log('store ',store);
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
  await new Promise((resolve, reject) => {
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
    const temporalEVENTS = allEvents?.reverse();
    const notUploadedFlat = allFlatEvents.filter(
      // filter only te flat events that  hasnt been uploaded
      (currentFlat) => currentFlat.upload === 0
    );
    notUploadedFlat?.map((flat) => {
      const id_eventoFs = flat.id_evento;
      temporalEVENTS?.map((event) => {
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
        await updateStudentdb(student, "", false);
      });
    })
    .catch((e) => console.log("error trayendo estudiantes", e));
};
export const getLocalEventsByStudent = async (id_estudiante, id_actividad) => {
  const db = SQLite.openDatabase("db5.db");
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
  return store;
};
export const getLocalDoubts = async () => {
  const db = SQLite.openDatabase("db5.db");
  const store = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from doubts;`,
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
export const getLocalDoubtsByStudent = async (id_estudiante, id_actividad) => {
  const db = SQLite.openDatabase("db5.db");
  const store = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from doubts where id_estudiante=? and id_actividad=?;`,
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
  return store;
};
export const setLocalDoubtsByStudent = async (
  id_duda,
  id_estudiante,
  id_actividad,
  question
) => {
  const db = SQLite.openDatabase("db5.db");
  await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into doubts (id_duda, id_actividad, id_estudiante, pregunta, respuesta, estado_duda) values (?, ?, ?, ?, ?, ?)",
        [id_duda, id_actividad, id_estudiante, question, "", 0],
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
