declare module "react-native-admob" {

  import React from "react"

  interface AAdMobBannerProps {
    adSize: string
    adUnitID: string
    didFailToReceiveAdWithError: () => void
    onAdFailedToLoad: (error: any) => void

  }

  declare class AdMobBanner extends React.Component<AAdMobBannerProps> {}
}
