import { Dimensions, PixelRatio } from "react-native"

const { width: windowWidth, height: windowHeight } = Dimensions.get("window")

const minWindowDimension = Math.min(windowWidth, windowHeight)

const responsiveScale = (s: number) => s * PixelRatio.roundToNearestPixel((minWindowDimension / 320) * 0.8)

const responsiveFontScale = (s: number) => s * PixelRatio.roundToNearestPixel((minWindowDimension / 320) * 0.8)

export { responsiveScale, responsiveFontScale, windowWidth, windowHeight }
