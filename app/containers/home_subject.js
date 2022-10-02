import React, { Component, Fragment } from "react";
import Header from "../components/header";
import SuggestionList from "../containers/subject-list";
import API from "../../utils/api";
import { connect } from "react-redux";

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header onPress={() => navigation.openDrawer()}>Mis Cursos</Header>
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      subject: [],
    };
  }

  async componentDidMount() {
    API.getCourses(
      this.props.ipconfig,
      this.props.student.grado_estudiante,
      this.props.student.id_colegio
    ).then(({ data }) => {
      this.props.dispatch({
        type: "SET_ACTIVITIES_LIST",
        payload: {
          data,
        },
      });
    });
  }
  render() {
    return (
      <Fragment>
        <SuggestionList></SuggestionList>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    ipconfig: state.videos.selectedIPConfig,
    student: state.videos.selectedStudent,
  };
}

export default connect(mapStateToProps)(Home);
