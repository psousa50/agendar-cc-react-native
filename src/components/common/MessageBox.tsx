import { Button, Text, View } from "native-base"
import React from "react"
import { ActivityIndicator, Dimensions } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import { shadow } from "../../styles/shadows"
import { appTheme } from "../../utils/appTheme"

interface MessageBoxProps {
  lines: string[]
  activityIndicator?: boolean
  backgroundColor?: string
  onOk?: () => void
}
export const MessageBox: React.FC<MessageBoxProps> = ({ activityIndicator, backgroundColor, lines, onOk }) => {
  const { width } = Dimensions.get("window")

  return (
    <View style={styles.container}>
      <View style={[styles.message, { backgroundColor: backgroundColor || "white", width: width * 0.8 }]}>
        {lines.map((line, i) => (
          <Text key={i} style={styles.text}>
            {line}
          </Text>
        ))}
        {activityIndicator && <ActivityIndicator size="small" color={appTheme.primaryColor} />}
        {onOk && (
          <Button style={styles.button} info onPress={onOk}>
            <Text>{"Ok"}</Text>
          </Button>
        )}
      </View>
    </View>
  )
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  message: {
    flexDirection: "column",
    paddingHorizontal: "1.0rem",
    paddingTop: "2.0rem",
    paddingBottom: "1.0rem",
    backgroundColor: "white",
    borderRadius: "0.6rem",
    ...shadow,
  },
  text: {
    paddingVertical: "1rem",
    textAlign: "center",
  },
  button: {
    alignSelf: "flex-end",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
})

export const ErrorBox: React.FC<MessageBoxProps> = props => (
  <MessageBox backgroundColor={appTheme.secondaryColor} {...props} />
)
