import React from "react"
import { ImageBackground, StatusBar, StyleSheet } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { LoadingPage } from "./LoadingPage"

export interface AppNavigationScreenProps extends NavigationScreenProps {}

export interface AppScreenProps extends AppNavigationScreenProps {
  backgroundImage: any
  loading?: boolean
}

export const AppScreen: React.FC<AppScreenProps> = ({ backgroundImage, children, loading }) => (
  <ImageBackground style={styles.container} resizeMode={"cover"} source={backgroundImage}>
    <>
      <StatusBar barStyle="dark-content" backgroundColor={"transparent"} translucent={true} />
      {loading ? <LoadingPage /> : children}
    </>
  </ImageBackground>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
})
