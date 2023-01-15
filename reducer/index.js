import { combineReducers } from "redux";
import navigation from "./navigation";
import videos from "./videos";
import connection from "./connection";
const reducer = combineReducers({
  videos,
  navigation,
  connection,
});

export default reducer;
