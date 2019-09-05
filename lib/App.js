import { StyleProvider } from "native-base";
import React from "react";
import { RootNavigator } from "./RootNavigator";
import { getTheme } from "./theme/components";
import { appTheme } from "./utils/appTheme";
export const App = () => {
    return (React.createElement(StyleProvider, { style: getTheme(appTheme) },
        React.createElement(RootNavigator, null)));
};
//# sourceMappingURL=App.js.map