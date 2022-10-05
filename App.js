import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import AppNavigator from "./app/app-navigator-with-state";
import { Entypo } from "@expo/vector-icons";
import * as Font from "expo-font";
import SplashScreen from "./app/components/SplashScreen";
import OnBoardScreens from "./app/components/OnBoardScreens";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    return <SplashScreen />;
  } else {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {<OnBoardScreens setFirstLaunch={setFirstLaunch} />}
          <AppNavigator />
        </PersistGate>
      </Provider>
    );
  }
};

export default App;
