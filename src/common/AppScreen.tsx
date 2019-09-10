import {
  Body,
  Button,
  Container,
  Content,
  Fab,
  Footer,
  Header,
  Icon,
  Icon as IconBase,
  Left,
  Right,
  Subtitle,
  Title,
  View,
} from "native-base"
import React from "react"
import { Platform, StatusBar, ViewStyle } from "react-native"
import { AdMobBanner } from "react-native-admob"
import { NavigationRoute, NavigationScreenProp, NavigationScreenProps } from "react-navigation"
import { appTheme } from "../utils/appTheme"
import { ButtonIcons, editBackgroundColor } from "./ToolbarIcons"

export interface ScreenStateProps {
  adsRemoved: boolean
}

export type ShowError = (error: string) => void
export interface ScreenDispatchProps {
  showError: ShowError
}

export type ShowModal = <P extends {}>(Component: React.ComponentType<P>, props: P) => void
export type HideModal = () => void

export interface ModalManager {
  showModal: ShowModal
  hideModal: HideModal
}

export interface AppNavigationScreenProps extends NavigationScreenProps {}

export interface AppScreenProps extends AppNavigationScreenProps, ScreenDispatchProps {
  left?: (() => JSX.Element) | null
  right?: () => JSX.Element
  headerBody?: (() => JSX.Element) | null
  editing?: boolean
  title?: string
  subtitle?: string
  footer?: () => JSX.Element
  content?: () => JSX.Element
  contentContainerStyle?: ViewStyle
  tabs?: () => JSX.Element
  onFabPressed?: () => void
  showAds?: boolean
}

export const drawerButton = (navigation: NavigationScreenProp<NavigationRoute>) => ({
  left: () => (
    <Button transparent onPress={() => navigation.openDrawer()}>
      <Icon name="menu" />
    </Button>
  ),
})

export class AppScreen extends React.Component<AppScreenProps> {
  public render() {
    const props = this.props
    const { content, editing, footer, onFabPressed, navigation, right, tabs, title, subtitle } = props

    const left = this.props.left
      ? this.props.left
      : this.props.left === null
      ? null
      : () => ButtonIcons.ArrowBack(() => navigation.goBack())
    const headerBody = this.props.headerBody
      ? this.props.headerBody
      : () => (
          <>
            <Title>{title}</Title>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
          </>
        )

    const contentContainerStyle = props.contentContainerStyle || { flex: 1 }
    if (Platform.OS !== "ios") {
      StatusBar.setBackgroundColor(appTheme.statusBarColor)
    }
    return (
      <>
        <Container>
          <Header hasTabs={tabs !== undefined} style={editing ? { backgroundColor: editBackgroundColor } : {}}>
            <StatusBar barStyle="light-content" backgroundColor={appTheme.statusBarColor} />
            <Left>{left ? left() : undefined}</Left>
            <Body>{headerBody ? headerBody() : undefined}</Body>
            <Right>{right ? right() : undefined}</Right>
          </Header>
          {tabs ? tabs() : undefined}
          {content ? (
            <Content contentContainerStyle={contentContainerStyle} padder>
              {content()}
            </Content>
          ) : (
            undefined
          )}
          {onFabPressed ? (
            <Fab
              direction="up"
              style={{ backgroundColor: appTheme.brandSecondary }}
              containerStyle={{ marginRight: 10 }}
              position="bottomRight"
              onPress={onFabPressed}
            >
              <IconBase name="add" />
            </Fab>
          ) : (
            undefined
          )}
          {footer ? <Footer>{footer()}</Footer> : undefined}
        </Container>
        {this.props.showAds && (
          <View>
            <AdMobBanner
              adSize="smartBannerPortrait"
              adUnitID="ca-app-pub-3035879185204310/8884433866"
              didFailToReceiveAdWithError={this.bannerError}
              onAdFailedToLoad={this.props.showError}
            />
          </View>
        )}
      </>
    )
  }
  private bannerError = () => null
}
