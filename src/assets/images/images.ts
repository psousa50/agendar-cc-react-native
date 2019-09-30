// tslint:disable no-var-requires
export const irnService1Image = require("./irnServices/IrnService1.png")
export const irnService2Image = require("./irnServices/IrnService2.png")
export const irnService3Image = require("./irnServices/IrnService3.png")
export const irnService4Image = require("./irnServices/IrnService4.png")

type TrnServiceImages = {
  [i: number]: any
}
export const irnServiceImages: TrnServiceImages = {
  [1]: irnService1Image,
  [2]: irnService2Image,
  [3]: irnService3Image,
  [4]: irnService4Image,
}
