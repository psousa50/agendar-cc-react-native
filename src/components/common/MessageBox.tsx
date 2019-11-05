import { Button, Text, View } from "native-base"
import React from "react"
import { ActivityIndicator, Dimensions, StyleSheet } from "react-native"
import { shadow } from "../../styles/shadows"
import { appTheme } from "../../utils/appTheme"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"

export interface MessageBoxProps {
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

export const ErrorBox: React.FC<MessageBoxProps> = props => (
  <MessageBox backgroundColor={appTheme.secondaryColor} {...props} />
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  message: {
    flexDirection: "column",
    paddingHorizontal: rs(12),
    paddingVertical: rs(24),
    backgroundColor: "white",
    borderRadius: rfs(8),
    ...shadow,
  },
  text: {
    paddingVertical: rs(12),
    textAlign: "center",
  },
  button: {
    alignSelf: "flex-end",
    paddingTop: rs(12),
    paddingBottom: rs(12),
    marginTop: rs(12),
    marginBottom: rs(12),
  },
})
