import React, { Component, Fragment } from "react";
import Header from "../components/header";
import SuggestionList from "../containers/subject-list";
import API from "../../utils/api";
import { connect } from "react-redux";

class Home extends Component {
  static options = ({ navigation }) => {
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

  componentDidMount() {
    API.getCourses(
      this.props.ipconfig,
      this.props.student.grado_estudiante,
      this.props.student.id_colegio
    )
      .then(({ data }) => {
        this.props.dispatch({
          type: "SET_ACTIVITIES_LIST",
          payload: {
            subject: data,
          },
        });
      })
      .catch((e) => {
        console.log("error", e);
      });
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
  };
}

export default connect(mapStateToProps)(Home);
