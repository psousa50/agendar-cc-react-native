import { Radio, Text, View } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"

interface RadioButtonProps {
  id: string
  label: string
  selected: boolean
  onSelected: (id: string) => void
}
export const RadioButton: React.FC<RadioButtonProps> = ({ id, label, selected, onSelected }) => (
  <View style={styles.container}>
    <Radio selected={selected} onPress={() => onSelected(id)} />
    <Text style={styles.label}>{label}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  label: {
    paddingLeft: 5,
  },
})
