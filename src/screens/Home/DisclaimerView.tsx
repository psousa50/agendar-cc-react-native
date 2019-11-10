import { Button, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { i18n } from "../../localization/i18n"
import { shadow } from "../../styles/shadows"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../utils/responsive"

interface DisclaimerViewProps {
  onDismiss: () => void
}
export const DisclaimerView: React.FC<DisclaimerViewProps> = ({ onDismiss }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("Disclaimer.Title")}</Text>
      <Text style={styles.paragraph}>{i18n.t("Disclaimer.P1")}</Text>
      <Text style={styles.paragraph}>{i18n.t("Disclaimer.P2")}</Text>
      <Text style={styles.paragraph}>{i18n.t("Disclaimer.P3")}</Text>
      <Text style={styles.paragraph}>{i18n.t("Disclaimer.P4")}</Text>
      <Text style={styles.footer}>{i18n.t("Disclaimer.Footer")}</Text>
      <Button small rounded style={styles.button} onPress={onDismiss}>
        <Text>{i18n.t("Disclaimer.Ok")}</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: rs(20),
    marginVertical: rs(20),
    paddingHorizontal: rs(20),
    paddingVertical: rs(20),
    backgroundColor: "white",
    borderRadius: rs(6),
    ...shadow,
  },
  title: {
    fontSize: rfs(24),
    textAlign: "center",
    marginBottom: rs(10),
  },
  paragraph: {
    marginTop: rs(20),
    fontSize: rfs(12),
    color: "#404040",
  },
  footer: {
    marginTop: rs(20),
    fontSize: rfs(16),
    color: "#202020",
    textAlign: "right",
  },
  button: {
    marginTop: rs(20),
    alignSelf: "flex-end",
  },
})
