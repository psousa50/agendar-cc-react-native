import React from "react"
// import { StyleSheet } from "react-native"
// import { Dropdown } from "react-native-material-dropdown"
import RNPickerSelect from "react-native-picker-select"
import { IrnServices } from "../../../irnTables/models"
import { serviceName } from "../../../utils/names"
// import { responsiveFontScale as rfs, responsiveScale as rs } from "../../../utils/responsive"

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
  // <Dropdown
  //   label=""
  //   onChangeText={value => onServiceIdChanged(Number(value))}
  //   value={serviceId ? serviceId.toString() : ""}
  //   data={services.map(service => ({ label: serviceName(service.serviceId), value: service.serviceId.toString() }))}
  //   itemCount={5}
  //   fontSize={rfs(14)}
  //   itemTextStyle={styles.itemTextStyle}
  //   containerStyle={styles.containerStyle}
  //   overlayStyle={styles.overlayStyle}
  // />
  <RNPickerSelect
    value={serviceId}
    onValueChange={value => onServiceIdChanged(value)}
    items={services.map(service => ({ label: serviceName(service.serviceId), value: service.serviceId }))}
    placeholder={{}}
  />
)

// const styles = StyleSheet.create({
//   itemTextStyle: {},
//   overlayStyle: {},
//   containerStyle: {
//     marginTop: -rs(30),
//   },
// })
