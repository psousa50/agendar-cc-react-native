var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pipe } from "fp-ts/lib/pipeable";
import { task } from "fp-ts/lib/Task";
import { chain, fold, map } from "fp-ts/lib/TaskEither";
import { StyleProvider } from "native-base";
import React, { useEffect } from "react";
import { RootNavigator } from "./RootNavigator";
import { GlobalStateProvider, useGlobalState } from "./state/main";
import { getTheme } from "./theme/components";
import { appTheme } from "./utils/appTheme";
import { fetchJson } from "./utils/fetch";
const fetchDistricts = fetchJson("http://192.168.1.105:3000/api/v1/districts");
const fetchCountries = fetchJson("http://192.168.1.105:3000/api/v1/counties");
const mergeWithCounties = (districts) => pipe(fetchCountries, map(counties => ({ districts, counties })));
export const InitGlobalState = () => {
    const [, globalDispatch] = useGlobalState();
    useEffect(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            globalDispatch({ type: "FETCH_STATIC_DATA_INIT", payload: {} });
            const action = pipe(fetchDistricts, chain(mergeWithCounties), fold(error => {
                globalDispatch({ type: "FETCH_STATIC_DATA_FAILURE", payload: { error } });
                return task.of(error);
            }, data => {
                globalDispatch({ type: "FETCH_STATIC_DATA_SUCCESS", payload: data });
                return task.of(undefined);
            }));
            yield action();
        });
        fetchData();
    }, []);
    return null;
};
export const App = () => (React.createElement(StyleProvider, { style: getTheme(appTheme) },
    React.createElement(GlobalStateProvider, null,
        React.createElement(InitGlobalState, null),
        React.createElement(RootNavigator, null))));
//# sourceMappingURL=App.js.map