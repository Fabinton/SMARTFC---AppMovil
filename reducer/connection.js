function connection(state = {}, action) {
  switch (action.type) {
    case "SET_CONNECTION_STATUS": {
      return { ...state, isConnected: action.payload };
    }
    default:
      return state;
  }
}
export default connection;
