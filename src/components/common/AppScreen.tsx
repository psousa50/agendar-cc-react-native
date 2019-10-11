import { Container, Header, Left, Right, View } from "native-base"
import React from "react"
import { ImageBackground, StatusBar, StyleSheet } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { appBackgroundImage } from "../../assets/images/images"
import { LoadingPage } from "./LoadingPage"

export interface AppNavigationScreenProps extends NavigationScreenProps {}

export interface AppScreenProps extends AppNavigationScreenProps {
  backgroundImage?: any
  loading?: boolean
  left?: () => JSX.Element
  right?: () => JSX.Element
}

export const AppScreen: React.FC<AppScreenProps> = ({ backgroundImage, children, left, loading, right }) => (
  <ImageBackground style={styles.background} resizeMode={"cover"} source={backgroundImage || appBackgroundImage}>
    <StatusBar barStyle="light-content" backgroundColor={"#00000020"} translucent={true} />
    <Container>
      <View style={styles.statusBar}></View>
      {left || right ? (
        <Header style={styles.header}>
          <Left>{left ? left() : undefined}</Left>
          <Right>{right ? right() : undefined}</Right>
        </Header>
      ) : null}
      <View style={styles.content}>{loading ? <LoadingPage /> : children}</View>
    </Container>
  </ImageBackground>
)

const styles = StyleSheet.create({
  background: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusBar: {
    height: 25,
  },
  header: {
    backgroundColor: "#00000090",
    borderWidth: 0,
  },
})
