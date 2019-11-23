import { Text, View } from "native-base"
import React from "react"
import { Image, StyleSheet, TouchableOpacity } from "react-native"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { ccImage, passportImage } from "../../../assets/images/images"
import { i18n } from "../../../localization/i18n"
import { IrnServiceId } from "../../../state/models"
import { appTheme } from "../../../utils/appTheme"
import { responsiveFontScale as rfs, responsiveScale as rs } from "../../../utils/responsive"

const colorSecondary = appTheme.brandSecondary
const colorSecondaryText = appTheme.secondaryText

interface SelectIrnServiceViewProps {
  serviceId?: number
  onServiceIdChanged: (serviceId: number) => void
}

export const getServices = [IrnServiceId.getCC, IrnServiceId.getPassport]
export const pickServices = [IrnServiceId.pickCC, IrnServiceId.pickPassport]
export const ccServices = [IrnServiceId.getCC, IrnServiceId.pickCC]
export const passportServices = [IrnServiceId.getPassport, IrnServiceId.pickPassport]

export const SelectIrnServiceView: React.FC<SelectIrnServiceViewProps> = ({ serviceId, onServiceIdChanged }) => {
  const onTabPress = (index: number) => {
    const oldServiceId = serviceId || 1
    const newServiceId =
      index === 0 && pickServices.includes(oldServiceId)
        ? oldServiceId - 1
        : index === 1 && getServices.includes(oldServiceId)
        ? oldServiceId + 1
        : oldServiceId
    onServiceIdChanged(newServiceId)
  }

  const onImagePress = (index: number) => {
    const oldServiceId = serviceId || IrnServiceId.getCC
    const newServiceId =
      index === 0 && passportServices.includes(oldServiceId)
        ? oldServiceId - 2
        : index === 1 && ccServices.includes(oldServiceId)
        ? oldServiceId + 2
        : oldServiceId
    onServiceIdChanged(newServiceId)
  }

  const serviceIsForCitizenCard = ccServices.includes(serviceId || IrnServiceId.getCC)
  const serviceIsForPassport = passportServices.includes(serviceId || IrnServiceId.getCC)
  return (
    <View>
      <SegmentedControlTab
        activeTabStyle={styles.activeTabStyle}
        activeTabTextStyle={styles.activeTabTextStyle}
        tabStyle={styles.tabStyle}
        tabTextStyle={styles.tabTextStyle}
        values={[i18n.t("Service.Get_renew"), i18n.t("Service.Pickup")]}
        selectedIndex={getServices.includes(serviceId || 1) ? 0 : 1}
        onTabPress={onTabPress}
      />
      <View style={styles.serviceImages}>
        <TouchableOpacity
          style={[styles.serviceImageTouch, serviceIsForCitizenCard ? styles.selectedCard : {}]}
          onPress={() => onImagePress(0)}
        >
          <Image style={styles.serviceImage} source={ccImage} />
          <Text style={[styles.cardText, serviceIsForCitizenCard ? styles.cardSelectedText : {}]}>
            {i18n.t("CitizenCard")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.serviceImageTouch, serviceIsForPassport ? styles.selectedCard : {}]}
          onPress={() => onImagePress(1)}
        >
          <Image style={styles.serviceImage} source={passportImage} />
          <Text style={[styles.cardText, serviceIsForPassport ? styles.cardSelectedText : {}]}>
            {i18n.t("Passport")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  serviceImages: {
    flexDirection: "row",
    paddingTop: rs(10),
  },
  serviceImageTouch: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    paddingHorizontal: rs(12),
  },
  serviceImage: {
    width: rs(50),
    height: rs(50),
  },
  cardText: {
    flex: 1,
    textAlign: "center",
    marginTop: rs(5),
    marginLeft: rs(5),
    fontSize: rfs(10),
    flexWrap: "wrap",
  },
  cardSelectedText: {
    color: colorSecondaryText,
    fontWeight: "bold",
  },
  selectedCard: {
    backgroundColor: colorSecondary,
  },
  activeTabStyle: {
    backgroundColor: colorSecondary,
  },
  activeTabTextStyle: {
    color: colorSecondaryText,
    fontWeight: "bold",
  },
  tabStyle: {
    borderColor: colorSecondary,
  },
  tabTextStyle: {
    fontSize: rfs(14),
  },
})
