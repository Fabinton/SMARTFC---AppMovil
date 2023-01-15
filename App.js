import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { Entypo } from "@expo/vector-icons";
import * as Font from "expo-font";
import SplashScreen from "./app/components/SplashScreen";
import OnBoardScreens from "./app/components/OnBoardScreens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-gesture-handler"; //this line is needed
import NewAppNavigator from "./app/NewAppNavigator";

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState(null);
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
        await new Promise((resolve) => setTimeout(resolve, 2750));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    async function setData() {
      const appData = await AsyncStorage.getItem("appLaunched");
      if (appData == null) {
        setFirstLaunch(true);
        AsyncStorage.setItem("appLaunched", "false");
      } else {
        setFirstLaunch(false);
      }
    }
    prepare();
    setData();
  }, []);
  if (!appIsReady) {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SplashScreen />
        </PersistGate>
      </Provider>
    );
  } else {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {firstLaunch && <OnBoardScreens setFirstLaunch={setFirstLaunch} />}
          <NewAppNavigator />
        </PersistGate>
      </Provider>
    );
  }
};

export default App;
