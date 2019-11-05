import { Body, Container, Content, Header, Left, Right, Title, View } from "native-base"
import React from "react"
import { ImageBackground, StyleSheet } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { appBackgroundImage } from "../../assets/images/images"
import { LoadingPage } from "./LoadingPage"
import { ErrorBox, MessageBoxProps } from "./MessageBox"
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
      <Header iosBarStyle={"light-content"}>
        <Left>{left ? left() : undefined}</Left>
        {title && (
          <Body>
            <Title>{title}</Title>
          </Body>
        )}
        <Right>{right ? right() : undefined}</Right>
      </Header>
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
  noScroll?: boolean
}

export const AppModalScreen: React.FC<AppModalScreenProps> = props => (
  <AppScreen {...props} noScroll={true} left={() => ButtonIcons.Close(() => props.navigation.goBack())} />
)

export const AppErrorScreen: React.FC<AppModalScreenProps & MessageBoxProps> = props => (
  <AppModalScreen {...props}>
    <ErrorBox {...props} />
  </AppModalScreen>
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
})
