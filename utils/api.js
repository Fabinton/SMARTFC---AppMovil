import axios from "axios";
class Api {
  getContent(BASE_IP) {
    var BASE_API = "http://" + BASE_IP + ":3000" + "/loadAllcontentsMovil";
    return axios.get(`${BASE_API}`);
  }
  getConection(BASE_IP) {
    var BASE_API = "http://" + BASE_IP + ":3000" + "/conectionWithApp";
    return axios.get(`${BASE_API}`, { timeout: 3000 });
  }

  getCourses(BASE_IP, id_grado, id_colegio) {
    var BASE_API_COURSES =
      "http://" + BASE_IP + ":3000" + "/loadAllSubjectActivesMovil";
    return axios.post(`${BASE_API_COURSES}`, {
      id_colegio: id_colegio,
      id_grado: id_grado,
    });
  }
  async getActivities(BASE_IP) {
    var BASE_API_ACTIVITIES =
      "http://" + BASE_IP + ":3000" + "/loadAllactivities";
    const query = await fetch(`${BASE_API_ACTIVITIES}`);
    const data = await query.json();
    //console.log(data);
    return data;
  }
  getActivitiesMovil(BASE_IP, id_colegio, id_grado, id_materia) {
    var BASE_API_ACTIVITIES_MOVIL =
      "http://" + BASE_IP + ":3000" + "/loadAllActivitiesMovil";
    return axios.post(`${BASE_API_ACTIVITIES_MOVIL}`, {
      id_colegio: id_colegio,
      id_grado: id_grado,
      id_materia: id_materia,
    });
  }
  async SearchContent(BASE_IP, title) {
    var BASE_API_SEARCH = "http://" + BASE_IP + ":3000" + "/searchContentREA";
    var datajson = { nombre_CREA: title };
    console.log("JSON BUSQUEDA_________________");
    const query2 = await fetch(`${BASE_API_SEARCH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datajson),
    });
    const data2 = await query2.json();
    const predata2 = await data2.content;
    //console.log(predata2);
    return predata2;
  }
  createEvents(BASE_IP, eventsStudents) {
    console.log("metricas", eventsStudents);
    var BASE_API_EVENTS = "http://" + BASE_IP + ":3000" + "/createEventos";
    return axios.post(`${BASE_API_EVENTS}`, eventsStudents);
  }

  loadEventsLast(BASE_IP) {
    var BASE_API_LOAD_EVENTS = "http://" + BASE_IP + ":3000" + "/loadAllEvento";
    return axios.get(`${BASE_API_LOAD_EVENTS}`);
  }

  async loginStudent(BASE_IP, eventsStudents) {
    // apparently not in use
    console.log("JSON LOGIN");
    var BASE_API_LOGIN = "http://" + BASE_IP + ":3000" + "/loginEstudiante";
    const query2 = await fetch(`${BASE_API_LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventsStudents),
    });
    const data2 = await query2.json();
    //console.log(data2);
  }
  loadSchool(BASE_IP) {
    var BASE_API_SCHOOL = "http://" + BASE_IP + ":3000" + "/loadAllSchools";
    return axios.get(`${BASE_API_SCHOOL}`);
  }
  async createStudents(BASE_IP, Student) {
    var BASE_API_STUDENTS = "http://" + BASE_IP + ":3000" + "/createEstudiante";
    return axios.post(`${BASE_API_STUDENTS}`, Student);
  }
  async updateStudents(BASE_IP, Student) {
    var BASE_UPDATE_API_STUDENTS =
      "http://" + BASE_IP + ":3000" + "/uploadEstudiante";
    return axios.post(`${BASE_UPDATE_API_STUDENTS}`, Student);
  }
  async allStudent(BASE_IP) {
    var BASE_API_ALL_STUDENTS =
      "http://" + BASE_IP + ":3000" + "/loadAllStudent";
    return axios.get(`${BASE_API_ALL_STUDENTS}`);
  }
  async allDoubts(BASE_IP) {
    var BASE_API_ALL_STUDENTS = "http://" + BASE_IP + ":3000" + "/loadAllDudas";
    const query = await fetch(`${BASE_API_ALL_STUDENTS}`);
    const data = await query.json();
    //console.log(data);
    return data;
  }
  allDoubtsStudents(BASE_IP, student) {
    var BASE_API_LOAD_DOUBTS_STUDENT =
      "http://" + BASE_IP + ":3000" + "/loadDudaStudents";
    return axios.post(`${BASE_API_LOAD_DOUBTS_STUDENT}`, student);
  }
  async generateMetrics(BASE_IP, Student) {
    console.log("JSON EVENTOS");
    var BASE_API_LOAD_EVENT_STUDENT =
      "http://" + BASE_IP + ":3000" + "/generateMetrica";
    const query2 = await fetch(`${BASE_API_LOAD_EVENT_STUDENT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Student),
    });
    const data2 = await query2.json();
    //console.log(data2);
    return data2;
  }
  generateDoubt(BASE_IP, dataDoubt) {
    console.log("duda en app nueva", dataDoubt);
    var BASE_API_CREATE_DOUBT = "http://" + BASE_IP + ":3000" + "/createDuda";
    return axios.post(`${BASE_API_CREATE_DOUBT}`, dataDoubt);
  }
  async loadDoubt(BASE_IP) {
    var BASE_API_LOAD_DOUBT = "http://" + BASE_IP + ":3000" + "/createDuda";
    const query = await fetch(`${BASE_API_LOAD_DOUBT}`);
    const data2 = await query.json();
    return data2;
  }
  async loginAdmin(BASE_IP, dataLogin) {
    var BASE_API_LOGIN_ADMIN =
      "http://" + BASE_IP + ":3000" + "/loginAdminMovil";
    const query2 = await fetch(`${BASE_API_LOGIN_ADMIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataLogin),
    });
    const data2 = await query2.json();
    return data2;
  }
  async checkIp(ip, dispatch) {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(reject, 5000, "Request timed out");
    });
    const request = fetch(`http://${ip}:3000`);
    try {
      const response = await Promise.race([timeout, request]);
      dispatch({
        type: "SET_CONNECTION_STATUS",
        payload: true,
      });
      return true;
    } catch (error) {
      console.log(error);
      dispatch({
        type: "SET_CONNECTION_STATUS",
        payload: false,
      });
      return false;
    }
  }
}
export default new Api();
