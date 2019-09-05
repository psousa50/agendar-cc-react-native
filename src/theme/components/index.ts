import _ from "lodash"
import { variable } from "./../variables/platform"
import { theme as badgeTheme } from "./Badge"
import { theme as bodyTheme } from "./Body"
import { theme as buttonTheme } from "./Button"
import { theme as cardTheme } from "./Card"
import { theme as cardItemTheme } from "./CardItem"
import { theme as checkBoxTheme } from "./CheckBox"
import { theme as containerTheme } from "./Container"
import { theme as contentTheme } from "./Content"
import { theme as fabTheme } from "./Fab"
import { theme as footerTheme } from "./Footer"
import { theme as footerTabTheme } from "./FooterTab"
import { theme as formTheme } from "./Form"
import { theme as h1Theme } from "./H1"
import { theme as h2Theme } from "./H2"
import { theme as h3Theme } from "./H3"
import { theme as headerTheme } from "./Header"
import { theme as iconTheme } from "./Icon"
import { theme as inputTheme } from "./Input"
import { theme as inputGroupTheme } from "./InputGroup"
import { theme as itemTheme } from "./Item"
import { theme as labelTheme } from "./Label"
import { theme as leftTheme } from "./Left"
import { theme as listItemTheme } from "./ListItem"
import { theme as radioTheme } from "./Radio"
import { theme as rightTheme } from "./Right"
import { theme as segmentTheme } from "./Segment"
import { theme as separatorTheme } from "./Separator"
import { theme as spinnerTheme } from "./Spinner"
import { theme as subtitleTheme } from "./Subtitle"
import { theme as swipeRowTheme } from "./SwipeRow"
import { theme as switchTheme } from "./Switch"
import { theme as tabTheme } from "./Tab"
import { theme as tabBarTheme } from "./TabBar"
import { theme as tabContainerTheme } from "./TabContainer"
import { theme as tabHeadingTheme } from "./TabHeading"
import { theme as textTheme } from "./Text"
import { theme as textAreaTheme } from "./Textarea"
import { theme as thumbnailTheme } from "./Thumbnail"
import { theme as titleTheme } from "./Title"
import { theme as toastTheme } from "./Toast"
import { theme as viewTheme } from "./View"

export const getTheme = (variables = variable) => {
  const theme = {
    variables,
    "NativeBase.Left": {
      ...leftTheme(variables),
    },
    "NativeBase.Right": {
      ...rightTheme(variables),
    },
    "NativeBase.Body": {
      ...bodyTheme(variables),
    },

    "NativeBase.Header": {
      ...headerTheme(variables),
    },

    "NativeBase.Button": {
      ...buttonTheme(variables),
    },

    "NativeBase.Title": {
      ...titleTheme(variables),
    },
    "NativeBase.Subtitle": {
      ...subtitleTheme(variables),
    },

    "NativeBase.InputGroup": {
      ...inputGroupTheme(variables),
    },

    "NativeBase.Input": {
      ...inputTheme(variables),
    },

    "NativeBase.Badge": {
      ...badgeTheme(variables),
    },

    "NativeBase.CheckBox": {
      ...checkBoxTheme(variables),
    },

    "NativeBase.Radio": {
      ...radioTheme(variables),
    },

    "NativeBase.Card": {
      ...cardTheme(),
    },

    "NativeBase.CardItem": {
      ...cardItemTheme(variables),
    },

    "NativeBase.Toast": {
      ...toastTheme(variables),
    },

    "NativeBase.H1": {
      ...h1Theme(variables),
    },
    "NativeBase.H2": {
      ...h2Theme(variables),
    },
    "NativeBase.H3": {
      ...h3Theme(variables),
    },
    "NativeBase.Form": {
      ...formTheme(variables),
    },

    "NativeBase.Container": {
      ...containerTheme(variables),
    },
    "NativeBase.Content": {
      ...contentTheme(variables),
    },

    "NativeBase.Footer": {
      ...footerTheme(variables),
    },

    "NativeBase.Tabs": {
      flex: 1,
    },

    "NativeBase.FooterTab": {
      ...footerTabTheme(variables),
    },

    "NativeBase.ListItem": {
      ...listItemTheme(variables),
    },

    "NativeBase.ListItem1": {
      ...listItemTheme(variables),
    },

    "NativeBase.Icon": {
      ...iconTheme(variables),
    },
    "NativeBase.IconNB": {
      ...iconTheme(variables),
    },
    "NativeBase.Text": {
      ...textTheme(variables),
    },
    "NativeBase.Spinner": {
      ...spinnerTheme(variables),
    },

    "NativeBase.Fab": {
      ...fabTheme(variables),
    },

    "NativeBase.Item": {
      ...itemTheme(variables),
    },

    "NativeBase.Label": {
      ...labelTheme(variables),
    },

    "NativeBase.Textarea": {
      ...textAreaTheme(variables),
    },

    "NativeBase.PickerNB": {
      "NativeBase.Button": {
        "NativeBase.Text": {},
      },
    },

    "NativeBase.Tab": {
      ...tabTheme(variables),
    },

    "NativeBase.Segment": {
      ...segmentTheme(variables),
    },

    "NativeBase.TabBar": {
      ...tabBarTheme(variables),
    },
    "NativeBase.ViewNB": {
      ...viewTheme(variables),
    },
    "NativeBase.TabHeading": {
      ...tabHeadingTheme(variables),
    },
    "NativeBase.TabContainer": {
      ...tabContainerTheme(variables),
    },
    "NativeBase.Switch": {
      ...switchTheme(variables),
    },
    "NativeBase.Separator": {
      ...separatorTheme(variables),
    },
    "NativeBase.SwipeRow": {
      ...swipeRowTheme(variables),
    },
    "NativeBase.Thumbnail": {
      ...thumbnailTheme(variables),
    },
  }

  const cssifyTheme = (grandparent: any, parent: any, parentKey: any) => {
    _.forEach(parent, (style: any, styleName: any) => {
      if (styleName.indexOf(".") === 0 && parentKey && parentKey.indexOf(".") === 0) {
        if (grandparent) {
          if (!grandparent[styleName]) {
            grandparent[styleName] = {}
          } else {
            grandparent[styleName][parentKey] = style
          }
        }
      }
      if (style && typeof style === "object" && styleName !== "fontVariant") {
        cssifyTheme(parent, style, styleName)
      }
    })
  }

  cssifyTheme(null, theme, null)

  return theme
}
