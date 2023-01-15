import React, { Component, Fragment } from "react";
import Header from "../../components/header";
import SuggestionList from "../containers/doubtsList";
import API from "../../../utils/api";
import { connect } from "react-redux";

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <Header onPress={() => navigation.openDrawer()}>Dudas</Header>,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      duda: [],
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    var data = {
      id_estudiante: this.props.student.id_estudiante,
    };
    API.allDoubtsStudents(this.props.ipconfig, data)
      .then(({ data }) => {
        this.props.dispatch({
          type: "SET_DOUBT_LIST",
          payload: {
            duda: data,
          },
        });
      })
      .catch((e) => {
        if (this.props.internetConnection) {
          Alert.alert(
            "Error",
            "Error al traer las dudas del servidor.",
            [{ text: "OK", onPress: () => {} }],
            { cancelable: false }
          );
        }
      })
      .finally(() => {
        this.props.dispatch({
          type: "SET_LOADING",
          payload: false,
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
    student: state.videos.selectedStudent,
    ipconfig: state.videos.selectedIPConfig,
    internetConnection: state.connection.isConnected,
  };
}

export default connect(mapStateToProps)(Home);
