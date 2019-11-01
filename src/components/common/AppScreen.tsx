import { Body, Container, Content, Header, Left, Right, Title, View } from "native-base"
import React from "react"
import { ImageBackground, StatusBar, StyleSheet } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { appBackgroundImage } from "../../assets/images/images"
import { LoadingPage } from "./LoadingPage"
import { ButtonIcons } from "./ToolbarIcons"

export interface AppNavigationScreenProps extends NavigationScreenProps {}

export interface AppScreenProps extends AppNavigationScreenProps {
  backgroundImage?: any
  loading?: boolean
  left?: () => JSX.Element
  right?: () => JSX.Element
  title?: string
  noScroll?: boolean
}

export const AppScreen: React.FC<AppScreenProps> = ({
  backgroundImage,
  children,
  left,
  loading,
  right,
  noScroll,
  title,
}) => (
  <ImageBackground style={styles.background} resizeMode={"cover"} source={backgroundImage || appBackgroundImage}>
    <Container>
      <View style={{ height: StatusBar.currentHeight || 20 }}></View>
      {left || right ? (
        <Header style={styles.header}>
          <Left>{left ? left() : undefined}</Left>
          {title && (
            <Body>
              <Title>{title}</Title>
            </Body>
          )}
          <Right>{right ? right() : undefined}</Right>
        </Header>
      ) : (
        <StatusBar barStyle="light-content" translucent={true} />
      )}
      {loading ? (
        <LoadingPage />
      ) : noScroll ? (
        <View style={styles.content}>{children}</View>
      ) : (
        <Content style={styles.content}>{children}</Content>
      )}
    </Container>
  </ImageBackground>
)

export interface AppModalScreenProps extends AppNavigationScreenProps {
  backgroundImage?: any
  loading?: boolean
  right?: () => JSX.Element
  title?: string
}

export const AppModalScreen: React.FC<AppModalScreenProps> = props => (
  <AppScreen {...props} left={() => ButtonIcons.Close(() => props.navigation.goBack())} />
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
  },
  header: {
    borderWidth: 0,
  },
})
