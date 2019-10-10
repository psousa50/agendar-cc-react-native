import DateTimePicker from "@react-native-community/datetimepicker"
import { Button, Text, View } from "native-base"
import React, { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { appBackgroundImage } from "../assets/images/images"
import { AppScreen, AppScreenProps } from "../common/AppScreen"
import { DatePeriodView } from "../components/DatePeriodView"
import { SelectedLocationView } from "../components/SelectedLocationView"
import { SelectIrnServiceView } from "../components/SelectIrnServiceView"
import { TimePeriodView } from "../components/TimePeriodView"
import { useGlobalState } from "../GlobalStateProvider"
import { i18n } from "../localization/i18n"
import { IrnTableFilter, IrnTableRefineFilter } from "../state/models"
import { globalStateSelectors } from "../state/selectors"
import { dateFromTime } from "../utils/dates"
import { extractTime } from "../utils/formaters"
import { AppScreenName, navigate } from "./screens"

interface HomeScreenState {
  showStartTime: boolean
  showEndTime: boolean
}

export const HomeScreen: React.FunctionComponent<AppScreenProps> = props => {
  const [globalState, globalDispatch] = useGlobalState()
  const navigation = navigate(props.navigation)
  const stateSelectors = globalStateSelectors(globalState)

  const irnFilter = stateSelectors.getIrnTablesFilter
  const { serviceId, startTime, endTime } = irnFilter

  const initialState: HomeScreenState = {
    showStartTime: false,
    showEndTime: false,
  }
  const [state, setState] = useState(initialState)

  const mergeState = (newState: Partial<HomeScreenState>) => setState(oldState => ({ ...oldState, ...newState }))

  const updateGlobalFilter = (filter: Partial<IrnTableFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_FILTER",
      payload: { filter },
    })
  }

  const updateRefineFilter = (filter: Partial<IrnTableRefineFilter>) => {
    globalDispatch({
      type: "IRN_TABLES_SET_REFINE_FILTER",
      payload: { filter },
    })
  }

  useEffect(() => {
    updateGlobalFilter({
      region: "Continente",
      serviceId: 1,
      endDate: new Date("2019-10-04"),
      startDate: new Date("2019-10-12"),
      startTime: "11:35",
      endTime: "15:40",
    })
  }, [])

  const onSearch = () => {
    updateRefineFilter({})
    navigation.goTo("IrnTablesResultsScreen")
  }

  const onSelectFilter = (filterScreen: AppScreenName) => () => {
    updateRefineFilter({})
    navigation.goTo(filterScreen)
  }

  const onServiceIdChanged = (newServiceId: number) => {
    updateGlobalFilter({ ...irnFilter, serviceId: newServiceId })
  }

  const onClearDate = () => {
    updateGlobalFilter({ ...irnFilter, startDate: undefined, endDate: undefined })
  }

  const onEditDate = () => {
    navigation.goTo("SelectPeriodScreen")
  }

  const onClearTime = () => {
    updateGlobalFilter({ ...irnFilter, startTime: undefined, endTime: undefined })
  }

  const onEditTime = () => {
    mergeState({ showStartTime: true })
  }

  const onStartTimeChange = (_: any, date?: Date) => {
    const newStartTime = date && extractTime(date)
    mergeState({ showStartTime: false, showEndTime: true })
    updateGlobalFilter({ startTime: newStartTime })
  }

  const onEndTimeChange = (_: any, date?: Date) => {
    const newEndTime = date && extractTime(date)
    mergeState({ showEndTime: false })
    updateGlobalFilter({ endTime: newEndTime })
  }

  const renderTimePickers = () => {
    return (
      <>
        {state.showStartTime ? (
          <DateTimePicker
            value={dateFromTime(irnFilter.startTime, "08:00")}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={onStartTimeChange}
          />
        ) : null}
        {state.showEndTime ? (
          <DateTimePicker
            value={dateFromTime(endTime, startTime)}
            mode={"time"}
            is24Hour={true}
            display="default"
            onChange={onEndTimeChange}
          />
        ) : null}
      </>
    )
  }

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <InfoCard title={i18n.t("Service")}>
          <SelectIrnServiceView serviceId={serviceId} onServiceIdChanged={onServiceIdChanged} />
        </InfoCard>
        <InfoCard title={i18n.t("Where")}>
          <SelectedLocationView irnFilter={irnFilter} onSelect={onSelectFilter("SelectLocationScreen")} />
        </InfoCard>
        <InfoCard title={i18n.t("When")}>
          <DatePeriodView datePeriod={irnFilter} onClearDatePeriod={onClearDate} onEditDatePeriod={onEditDate} />
          <View style={{ borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 3 }}></View>
          <TimePeriodView timePeriod={irnFilter} onClearTimePeriod={onClearTime} onEditTimePeriod={onEditTime} />
        </InfoCard>
        <Button block success onPress={onSearch}>
          <Text>{"Pesquisar Horários"}</Text>
        </Button>
        {renderTimePickers()}
      </View>
    )
  }
  return (
    <AppScreen {...props} backgroundImage={appBackgroundImage}>
      {renderContent()}
    </AppScreen>
  )
}

interface InfoCardProps {
  title: string
}
const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <>
    <View style={styles.titleBar}>
      <Text style={styles.titleBarText}>{title}</Text>
    </View>
    <View style={styles.infoCard}>
      <View style={styles.infoCardContainer}>{children}</View>
    </View>
  </>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  infoCard: {
    backgroundColor: "transparent",
    marginLeft: 30,
  },
  infoCardContainer: {
    display: "flex",
    margin: 5,
    padding: 5,
    backgroundColor: "white",
  },
  titleBar: {
    backgroundColor: "#3171a8",
    padding: 10,
  },
  titleBarText: {
    color: "white",
    fontSize: 16,
  },
})
