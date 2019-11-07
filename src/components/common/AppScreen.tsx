import { Body, Container, Content, Header, Left, Right, Title, View } from "native-base"
import React from "react"
import { ImageBackground, StyleSheet } from "react-native"
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
      <Header iosBarStyle={"light-content"}>
        <Left style={styles.left}>{left ? left() : undefined}</Left>
        {title && (
          <Body style={styles.title}>
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

export const leftCloseButton = (onPress: () => void) => ({
  left: () => ButtonIcons.Close(() => onPress()),
})

export const leftBackButton = (onPress: () => void) => ({
  left: () => ButtonIcons.ArrowBack(() => onPress()),
})

export const AppModalScreen: React.FC<AppModalScreenProps> = props => (
  <AppScreen {...props} noScroll={true} {...leftCloseButton(props.navigation.goBack)} />
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
  left: {
    flex: 1,
  },
  title: {
    flex: 5,
  },
})
