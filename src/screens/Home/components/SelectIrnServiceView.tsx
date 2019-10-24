import { Text, View } from "native-base"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import EStyleSheet from "react-native-extended-stylesheet"
import SegmentedControlTab from "react-native-segmented-control-tab"
import { ccImage, passportImage } from "../../../assets/images/images"
import { i18n } from "../../../localization/i18n"
import { appTheme } from "../../../utils/appTheme"

const colorSecondary = appTheme.brandSecondary
const colorSecondaryText = appTheme.secondaryText

interface SelectIrnServiceViewProps {
  serviceId?: number
  onServiceIdChanged: (serviceId: number) => void
}

export const SelectIrnServiceView: React.FC<SelectIrnServiceViewProps> = ({ serviceId, onServiceIdChanged }) => {
  const onTabPress = (index: number) => {
    const oldServiceId = serviceId || 1
    const newServiceId =
      index === 0 && [2, 4].includes(oldServiceId)
        ? oldServiceId - 1
        : index === 1 && [1, 3].includes(oldServiceId)
        ? oldServiceId + 1
        : oldServiceId
    onServiceIdChanged(newServiceId)
  }

  const onImagePress = (index: number) => {
    const oldServiceId = serviceId || 1
    const newServiceId =
      index === 0 && [3, 4].includes(oldServiceId)
        ? oldServiceId - 2
        : index === 1 && [1, 2].includes(oldServiceId)
        ? oldServiceId + 2
        : oldServiceId
    onServiceIdChanged(newServiceId)
  }

  const serviceIsForCitizenCard = [1, 2].includes(serviceId || 1)
  const serviceIsForPassport = [3, 4].includes(serviceId || 1)
  return (
    <View>
      <SegmentedControlTab
        activeTabStyle={styles.activeTabStyle}
        activeTabTextStyle={styles.activeTabTextStyle}
        tabStyle={styles.tabStyle}
        tabTextStyle={styles.tabTextStyle}
        values={[i18n.t("Service.Get_renew"), i18n.t("Service.Pickup")]}
        selectedIndex={[1, 3].includes(serviceId || 1) ? 0 : 1}
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

const styles = EStyleSheet.create({
  serviceImages: {
    flexDirection: "row",
    paddingTop: 10,
  },
  serviceImageTouch: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    paddingHorizontal: "0.5rem",
  },
  serviceImage: {
    width: "3rem",
    height: "3rem",
  },
  cardText: {
    flex: 1,
    marginTop: 5,
    fontSize: "0.8rem",
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
    fontSize: "0.9rem",
  },
})
