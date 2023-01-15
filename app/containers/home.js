import React, { Component } from "react";
import Header from "../components/header";
import SuggestionList from "../containers/suggestion-list";
import API from "../../utils/api";
import { connect } from "react-redux";

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header onPress={() => navigation.openDrawer()}>Contenido REA</Header>
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      contenidos: [],
    };
  }
  componentDidMount() {
    API.getContent(this.props.ipconfig)
      .then(({ data }) => {
        this.props.dispatch({
          type: "SET_CONTENTS_LIST",
          payload: {
            contenido: data,
          },
        });
      })
      .catch((e) => {});
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    return <SuggestionList />;
  }
}

function mapStateToProps(state) {
  return {
    student: state.videos.selectedStudent,
    ipconfig: state.videos.selectedIPConfig,
  };
}

export default connect(mapStateToProps)(Home);
