import { Body, Card, CardItem, Text } from "native-base"
import React from "react"
import { StyleSheet } from "react-native"
import { IrnTableFilter } from "../state/models"
import { formatDateLocale, formatTimeSlot } from "../utils/formaters"

interface SelectedWhenViewProps {
  irnFilter: IrnTableFilter
  onSelect?: () => void
}
export const SelectedDateTimeView: React.FC<SelectedWhenViewProps> = ({
  irnFilter: { startDate, endDate, startTime, endTime, onlyOnSaturdays },
  onSelect,
}) => {
  const dates =
    startDate && endDate
      ? `No período entre ${formatDateLocale(startDate)} e ${formatDateLocale(endDate)}`
      : startDate
      ? `A partir do dia ${formatDateLocale(startDate)}`
      : endDate
      ? `até ao dia ${formatDateLocale(endDate)}`
      : "O mais depressa possível"

  return (
    <Card style={styles.card}>
      <CardItem button onPress={onSelect}>
        <Body>
          <Text>{dates}</Text>
          <Text>{formatTimeSlot(startTime)}</Text>
          <Text>{formatTimeSlot(endTime)}</Text>
          <Text>{onlyOnSaturdays ? "Só aos Sábados" : ""}</Text>
        </Body>
      </CardItem>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 0,
  },
})
