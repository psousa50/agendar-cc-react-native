import { Body, Card, CardItem, Text } from "native-base"
import React from "react"
import { IrnTableFilterState } from "../state/models"
import { formatDateLocale } from "../utils/formaters"

interface SelectedWhenViewProps {
  irnFilter: IrnTableFilterState
  onSelect: () => void
}
export const SelectedDateTimeView: React.FC<SelectedWhenViewProps> = ({
  irnFilter: { startDate, endDate },
  onSelect,
}) => {
  const dates =
    startDate && endDate
      ? `No período entre ${formatDateLocale(startDate)} e ${formatDateLocale(endDate)}`
      : startDate
      ? `A partir do dia ${formatDateLocale(startDate)}`
      : "O mais depressa possível"

  return (
    <Card>
      <CardItem button onPress={onSelect}>
        <Body>
          <Text>{dates}</Text>
        </Body>
      </CardItem>
    </Card>
  )
}
