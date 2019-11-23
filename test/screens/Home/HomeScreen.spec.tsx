import { fireEvent, render } from "@testing-library/react-native"
import { flatten, mergeAll } from "ramda"
import React from "react"
import { DeepPartial } from "redux"
import { i18n } from "../../../src/localization/i18n"
import { HomeScreen } from "../../../src/screens/Home/HomeScreen"
import { IrnServiceId } from "../../../src/state/models"
import { RootState } from "../../../src/state/rootReducer"
import { appTheme } from "../../../src/utils/appTheme"
import { defaultEnv, defaultState } from "../../helpers/defaults"
import { withEnvAndStore } from "../../helpers/wrappers"

const mergeAllStyles = (styles: any) => mergeAll(flatten(styles))

describe("HomeScreen", () => {
  it("Renders disclaimer only on first render", () => {
    const WrappedHome = withEnvAndStore(defaultEnv)(HomeScreen)
    const { getByText, queryByText } = render(<WrappedHome navigation={{} as any} />)

    expect(getByText(i18n.t("Disclaimer.Title"))).toBeDefined()

    fireEvent.press(getByText("Ok"))

    expect(queryByText(i18n.t("Disclaimer.Title"))).toBeNull()
  })

  describe("Select Service", () => {
    describe("Renders", () => {
      const serviceElementsText = [
        i18n.t("Service.Get_renew"),
        i18n.t("Service.Pickup"),
        i18n.t("CitizenCard"),
        i18n.t("Passport"),
      ]

      const activeServiceElementsForHomeWith = (serviceId: IrnServiceId) => {
        const state: DeepPartial<RootState> = {
          ...defaultState,
          irnTablesData: {
            filter: {
              serviceId,
            },
          },
        }
        const WrappedHome = withEnvAndStore(defaultEnv, state)(HomeScreen)
        const { getByText } = render(<WrappedHome navigation={{} as any} />)

        const activeElements = serviceElementsText.filter(
          e => mergeAllStyles(getByText(e).getProp("style")).color === appTheme.secondaryText,
        )

        return activeElements
      }

      it("for a get CC service", () => {
        expect(activeServiceElementsForHomeWith(IrnServiceId.getCC)).toEqual([
          i18n.t("Service.Get_renew"),
          i18n.t("CitizenCard"),
        ])
      })

      it("for a pickup CC service", () => {
        expect(activeServiceElementsForHomeWith(IrnServiceId.pickCC)).toEqual([
          i18n.t("Service.Pickup"),
          i18n.t("CitizenCard"),
        ])
      })

      it("for a get Passport service", () => {
        expect(activeServiceElementsForHomeWith(IrnServiceId.getPassport)).toEqual([
          i18n.t("Service.Get_renew"),
          i18n.t("Passport"),
        ])
      })

      it("for a pickup Passport service", () => {
        expect(activeServiceElementsForHomeWith(IrnServiceId.pickPassport)).toEqual([
          i18n.t("Service.Pickup"),
          i18n.t("Passport"),
        ])
      })

      it("Changes serviceId on callback", () => {
        const state: DeepPartial<RootState> = {
          ...defaultState,
        }

        const WrappedHome = withEnvAndStore(defaultEnv, state)(HomeScreen)
        const { getByLabelText, getByText } = render(<WrappedHome navigation={{} as any} />)

        fireEvent.press(getByLabelText(i18n.t("Service.Pickup")))
        fireEvent.press(getByLabelText(i18n.t("Passport")))

        const activeElements1 = serviceElementsText.filter(
          e => mergeAllStyles(getByText(e).getProp("style")).color === appTheme.secondaryText,
        )

        expect(activeElements1).toEqual([i18n.t("Service.Pickup"), i18n.t("Passport")])

        fireEvent.press(getByLabelText(i18n.t("CitizenCard")))

        const activeElements2 = serviceElementsText.filter(
          e => mergeAllStyles(getByText(e).getProp("style")).color === appTheme.secondaryText,
        )

        expect(activeElements2).toEqual([i18n.t("Service.Pickup"), i18n.t("CitizenCard")])
      })
    })
  })

  describe("Location", () => {
    it("Renders all locations filter elements", () => {
      const districtId = 10
      const districtName = "Some District"
      const countyId = 20
      const countyName = "Some County"
      const placeName = "Some Place"
      const state: DeepPartial<RootState> = {
        ...defaultState,
        referenceData: {
          districts: [{ districtId, name: districtName }],
          counties: [{ countyId, name: countyName }],
        },
        irnPlacesData: {
          irnPlaces: [{ name: placeName }],
        },
        irnTablesData: {
          filter: {
            region: "Continente",
            districtId,
            countyId,
            placeName,
            distanceRadiusKm: 100,
          },
        },
      }

      const WrappedHome = withEnvAndStore(defaultEnv, state)(HomeScreen)
      const { getByText } = render(<WrappedHome navigation={{} as any} />)

      expect(getByText(`${districtName} - ${countyName}`)).toBeDefined()
      expect(getByText(placeName)).toBeDefined()
      expect(getByText(/100Km/i)).toBeDefined()
    })
  })
})
