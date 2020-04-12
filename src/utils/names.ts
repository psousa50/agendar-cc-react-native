import { i18n } from "../localization/i18n"

export const serviceName = (serviceId: number) => i18n.t(`Services.${serviceId}`)
