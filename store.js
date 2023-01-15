import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import reducer from "./reducer/index";
import { AsyncStorage } from "react-native";
import { createReactNavigationReduxMiddleware } from "react-navigation-redux-helpers";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["navigation"],
};
const persistedReducer = persistReducer(persistConfig, reducer);

const navigationMiddleware = createReactNavigationReduxMiddleware(
  (state) => state.navigation
);

const store = createStore(
  persistedReducer,
  applyMiddleware(navigationMiddleware)
);
const persistor = persistStore(store);

export { store, persistor };
