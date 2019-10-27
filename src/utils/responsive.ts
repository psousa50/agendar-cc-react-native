import { Dimensions, PixelRatio } from "react-native"

const { width, height } = Dimensions.get("window")

const size = Math.min(width, height)

const responsiveScale = (s: number) => s * PixelRatio.roundToNearestPixel((size / 320) * 0.8)

const responsiveFontScale = (s: number) => s * PixelRatio.roundToNearestPixel((size / 320) * 0.8)

export { responsiveScale, responsiveFontScale }
