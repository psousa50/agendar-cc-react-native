import React from "react";
import { StyleSheet, Text, View } from "react-native";
export const App = () => {
    return (React.createElement(View, null,
        React.createElement(Text, { style: styles.container }, "Hello 1234")));
};
const styles = StyleSheet.create({
    container: {
        color: "red",
    },
});
