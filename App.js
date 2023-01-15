import React from "react";
import { useWindowDimensions } from "react-native";
import WebView from "react-native-webview";
const index = require("./views/controller.html");

export default function App() {
  const { width } = useWindowDimensions();
  return (
    <WebView
      contentWidth={width}
      source={index}
    />
  );
}