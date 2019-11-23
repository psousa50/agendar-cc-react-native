import { render } from "@testing-library/react-native"
import { flatten, mergeAll } from "ramda"
import React from "react"
import { DeepPartial } from "redux"
import { Environment } from "../../../src/environment/main"
import { i18n } from "../../../src/localization/i18n"
import { HomeScreen } from "../../../src/screens/Home/HomeScreen"
import { IrnServiceId } from "../../../src/state/models"
import { RootState } from "../../../src/state/rootReducer"
import { appTheme } from "../../../src/utils/appTheme"
import { withEnvAndStore } from "../../helpers/wrappers"

const irnApiStub = {
  fetchIrnPlaces: jest.fn(),
  fetchReferenceData: jest.fn(),
  fetchIrnTableMatch: jest.fn(),
}
const defaultEnv: Environment = {
  irnApi: irnApiStub,
}

const defaultState: DeepPartial<RootState> = {
  userData: {
    disclaimerShown: true,
  },
}

const mergeAllStyles = (styles: any) => mergeAll(flatten(styles))

describe("HomeScreen", () => {
  describe("Renders Select Service", () => {
    const getSelectedStylesFor = (serviceId: IrnServiceId) => {
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

      const elementsText = [
        i18n.t("Service.Get_renew"),
        i18n.t("Service.Pickup"),
        i18n.t("CitizenCard"),
        i18n.t("Passport"),
      ]
      const activeElements = elementsText.filter(
        e => mergeAllStyles(getByText(e).getProp("style")).color === appTheme.secondaryText,
      )

      return activeElements
    }
    it("for a get CC service", () => {
      expect(getSelectedStylesFor(IrnServiceId.getCC)).toEqual([i18n.t("Service.Get_renew"), i18n.t("CitizenCard")])
    })
    it("for a pickup CC service", () => {
      expect(getSelectedStylesFor(IrnServiceId.pickCC)).toEqual([i18n.t("Service.Pickup"), i18n.t("CitizenCard")])
    })
    it("for a get Passport service", () => {
      expect(getSelectedStylesFor(IrnServiceId.getPassport)).toEqual([i18n.t("Service.Get_renew"), i18n.t("Passport")])
    })
    it("for a pickup Passport service", () => {
      expect(getSelectedStylesFor(IrnServiceId.pickPassport)).toEqual([i18n.t("Service.Pickup"), i18n.t("Passport")])
    })
  })

  it("Renders Location", () => {
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
