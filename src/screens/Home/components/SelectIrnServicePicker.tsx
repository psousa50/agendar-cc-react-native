import React from "react"
import RNPickerSelect from "react-native-picker-select"
import { IrnServices } from "../../../irnTables/models"
import { serviceName } from "../../../utils/names"

interface SelectIrnServicePickerProps {
  services: IrnServices
  serviceId?: number
  onServiceIdChanged: (serviceId: number) => void
}

export const SelectIrnServicePicker: React.FC<SelectIrnServicePickerProps> = ({
  services,
  serviceId,
  onServiceIdChanged,
}) => (
  <RNPickerSelect
    value={serviceId}
    onValueChange={value => onServiceIdChanged(value)}
    items={services.map(service => ({ label: serviceName(service.serviceId), value: service.serviceId }))}
    placeholder={{}}
  />
)
