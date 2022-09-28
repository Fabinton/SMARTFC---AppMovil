function connection(state = {}, action) {
  switch (action.type) {
    case "SET_CONNECTION_STATUS": {
      return { ...state, isConnected: action.payload };
    }
    case "SET_LOADING": {
      return { ...state, loading: action.payload };
    }
    default:
      return state;
  }
}
export default connection;
