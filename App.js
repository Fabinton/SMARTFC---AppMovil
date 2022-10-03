import React, { Component } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import AppNavigator from "./app/app-navigator-with-state";
import SplashScreen from "./app/components/SplashScreen";

export default class App extends Component {
  state = {
    isReady: false,
  };
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<SplashScreen />} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    );
  }
}
