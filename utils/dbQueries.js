export const evaluationQuery = (
  dataComplete,
  hoursComplete,
  id_actividad,
  id_estudiante,
  resultado = [],
  answers
) => {
  const text =
    "insert into events (data_start, hour_start, data_end, hour_end, id_actividad, id_estudiante, check_download, check_inicio, check_fin, check_answer, count_video, check_video, check_document, check_a1, check_a2, check_a3, check_profile, check_Ea1, check_Ea2, check_Ea3) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";
  const query = [
    dataComplete,
    hoursComplete,
    dataComplete,
    hoursComplete,
    id_actividad,
    id_estudiante,
    resultado[0].check_download,
    resultado[0].check_inicio,
    0,
    resultado[0].check_answer,
    resultado[0].count_video,
    resultado[0].check_video,
    0,
    resultado[0].check_a1,
    resultado[0].check_a2,
    resultado[0].check_a3,
    0,
    Object.values(answers)[0],
    Object.values(answers)[1],
    Object.values(answers)[2],
  ];
  return { text, query };
};
export const testQuery = (
  dataComplete,
  hoursComplete,
  id_actividad,
  id_estudiante,
  resultado = [],
  answers
) => {
  console.log("resultado", resultado);
  const text =
    "insert into events (data_start, hour_start, data_end, hour_end, id_actividad, id_estudiante, check_download, check_inicio, check_fin, check_answer, count_video, check_video, check_document, check_a1, check_a2, check_a3, check_profile, check_Ea1, check_Ea2, check_Ea3) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";
  const query = [
    dataComplete,
    hoursComplete,
    dataComplete,
    hoursComplete,
    id_actividad,
    id_estudiante,
    resultado[0].check_download,
    resultado[0].check_inicio,
    0,
    1,
    resultado[0].count_video,
    resultado[0].check_video,
    0,
    Object.values(answers)[0],
    Object.values(answers)[1],
    Object.values(answers)[2],
    0,
    resultado[0].check_Ea1,
    resultado[0].check_Ea2,
    resultado[0].check_Ea2,
  ];
  return { text, query };
};
export const createResult = (storageFilter, evaluationType) => {
  let result = [];
  if (evaluationType) {
    result = Array.from(new Set(storageFilter.map((s) => s.id_actividad))).map(
      (id_actividad) => {
        return {
          id_actividad: id_actividad,
          data_start: storageFilter.find((s) => s.id_actividad === id_actividad)
            .data_start,
          check_video: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_video,
          count_video: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).count_video,
          check_a1: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a1,
          check_a2: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a2,
          check_a3: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_a3,
          check_answer: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_answer,
          check_download: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_download,
          check_inicio: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_inicio,
          id_evento: storageFilter.find((s) => s.id_actividad === id_actividad)
            .id_evento,
        };
      }
    );
  } else {
    result = Array.from(new Set(storageFilter.map((s) => s.id_actividad))).map(
      (id_actividad) => {
        return {
          id_actividad: id_actividad,
          data_start: storageFilter.find((s) => s.id_actividad === id_actividad)
            .data_start,
          count_video: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).count_video,
          check_video: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_video,
          check_inicio: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_inicio,
          check_Ea1: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_Ea1,
          check_Ea2: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_Ea2,
          check_Ea3: storageFilter.find((s) => s.id_actividad === id_actividad)
            .check_Ea3,
          check_download: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_download,
          check_answer: storageFilter.find(
            (s) => s.id_actividad === id_actividad
          ).check_answer,
        };
      }
    );
  }
  return result;
};
