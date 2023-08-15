import React, { Component, Fragment } from "react";
import SuggestionList from "../containers/activity-list";
import API from "../../utils/api";
import { connect } from "react-redux";
import HeaderReturn from "../components/headerReturn";
class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <HeaderReturn onPress={() => navigation.goBack()}>
          Mis Actividades
        </HeaderReturn>
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      activity: [],
    };
  }
  componentDidMount() {
    API.getActivitiesMovil(
      this.props.ipconfig,
      this.props.student.id_colegio,
      this.props.student.grado_estudiante,
      this.props.subject.id_materia
    )
      .then(({ data }) => {
        this.props.dispatch({
          type: "SET_SUBJECT_ACTIVITY_LIST",
          payload: {
            activity: data,
          },
        });
      })
      .catch((e) => {
        console.log("error", e);
      })
      .finally(() => {});
  }
  render() {
    return (
      <Fragment>
        <SuggestionList navigation={this.props.navigation}></SuggestionList>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    ipconfig: state.videos.selectedIPConfig,
    student: state.videos.selectedStudent,
    subject: state.videos.selectedSubjects,
  };
}

export default connect(mapStateToProps)(Home);
