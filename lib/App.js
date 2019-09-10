import { StyleProvider } from "native-base";
import React from "react";
import { GlobalStateInitializer } from "./GlobalStateInitializer";
import { RootNavigator } from "./RootNavigator";
import { GlobalStateProvider } from "./state/main";
import { getTheme } from "./theme/components";
import { appTheme } from "./utils/appTheme";
export const App = () => (React.createElement(StyleProvider, { style: getTheme(appTheme) },
    React.createElement(GlobalStateProvider, null,
        React.createElement(GlobalStateInitializer, null),
        React.createElement(RootNavigator, null))));
//# sourceMappingURL=App.js.map