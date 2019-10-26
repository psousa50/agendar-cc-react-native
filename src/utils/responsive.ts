import { Dimensions, PixelRatio } from "react-native"

const { width } = Dimensions.get("window")

const responsiveScale = (s: number) => s * PixelRatio.roundToNearestPixel((width / 320) * 0.8)

const responsiveFontScale = (s: number) => s * PixelRatio.roundToNearestPixel((width / 320) * 0.8)

export { responsiveScale, responsiveFontScale }
