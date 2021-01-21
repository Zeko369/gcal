import React, { createContext, useContext } from "react"
import { UseDisclosureReturn } from "@chakra-ui/hooks"
import { Calendar } from "@prisma/client"
import produce from "immer"
import { startOfDay, startOfWeek, startOfMonth, startOfYear } from "date-fns"
import { setCookie } from "nookies"

import { cookieOptions } from "./cookie"

export const Scales = ["day", "week", "month", "year"] as const
export type Scale = typeof Scales[number]
export type Action =
  | { type: "setValueScale"; payload: { value: Date; scale: Scale } }
  | { type: "reset" }
  | { type: "val++" }
  | { type: "val--" }
  | { type: "toggleArchived" }
  | { type: "togglePrice" }
  | { type: "setEvents"; payload: { events: any[]; calendar: Calendar } }

interface State {
  showPrice: boolean
  showArchived: boolean
  date: {
    scale: Scale
    value: Date
  }
  events: any[]
  calendar?: Calendar
}

export const intervals: { key: Scale; label: string; value: Date }[] = [
  { key: "day", label: "Day", value: startOfDay(new Date()) },
  { key: "week", label: "Week", value: startOfWeek(new Date(), { weekStartsOn: 1 }) },
  { key: "month", label: "Month", value: startOfMonth(new Date()) },
  { key: "year", label: "Year", value: startOfYear(new Date()) },
]

export type Store = { state: State; dispatch: React.Dispatch<Action> }

export const initialState: State = {
  showPrice: false,
  showArchived: false,
  date: {
    scale: "week",
    value: startOfWeek(new Date(), { weekStartsOn: 1 }),
  },
  events: [],
}

export const initialStore: Store = {
  state: initialState,
  dispatch: () => {},
}

export const StoreContext = createContext<Store & { modal?: UseDisclosureReturn }>(initialStore)
export const useStore = () => useContext(StoreContext)

export const day = (n = 1) => 1000 * 60 * 60 * 24 * n

type DT = React.Dispatch<Action>

export const setValueScale = (dispatch: DT) => (value: Date, scale: Scale) => {
  dispatch({ type: "setValueScale", payload: { value, scale } })
  setCookie(null, "scale", scale, cookieOptions)
  setCookie(null, "value", value.toISOString(), cookieOptions)
}

const reducerHelper = (state: State, action: Action): State => {
  const { date } = state

  switch (action.type) {
    case "toggleArchived":
      return { ...state, showArchived: !state.showArchived }
    case "togglePrice":
      return { ...state, showPrice: !state.showPrice }
    case "setValueScale":
      return produce(state, (draft) => {
        draft.date.value = action.payload.value
        draft.date.scale = action.payload.scale
      })
    case "reset":
      return {
        ...state,
        date: { ...date, value: intervals.find((i) => i.key === date.scale)!.value },
      }
    case "val++":
      switch (date.scale) {
        case "day":
          return { ...state, date: { ...date, value: new Date(date.value.getTime() + day(1)) } }
        case "week":
          return { ...state, date: { ...date, value: new Date(date.value.getTime() + day(7)) } }
        case "month": {
          let newDate = new Date(date.value)

          if (newDate.getMonth() === 11) {
            newDate.setMonth(0)
            newDate.setFullYear(newDate.getFullYear() + 1)
          } else {
            newDate.setMonth(newDate.getMonth() + 1)
          }

          return { ...state, date: { ...date, value: newDate } }
        }
        case "year": {
          let newDate = new Date(date.value)
          newDate.setFullYear(newDate.getFullYear() + 1)
          return { ...state, date: { ...date, value: newDate } }
        }
        default:
          return state
      }
    case "val--":
      switch (date.scale) {
        case "day":
          return { ...state, date: { ...date, value: new Date(date.value.getTime() - day()) } }
        case "week":
          return { ...state, date: { ...date, value: new Date(date.value.getTime() - day() * 7) } }
        case "month": {
          let newDate = new Date(date.value)

          if (newDate.getMonth() === 0) {
            newDate.setMonth(11)
            newDate.setFullYear(newDate.getFullYear() - 1)
          } else {
            newDate.setMonth(newDate.getMonth() - 1)
          }

          return { ...state, date: { ...date, value: newDate } }
        }
        case "year": {
          let newDate = new Date(date.value)
          newDate.setFullYear(newDate.getFullYear() - 1)
          return { ...state, date: { ...date, value: newDate } }
        }
        default:
          return state
      }
    case "setEvents":
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const reducer = (state: State, action: Action): State => {
  const newState = reducerHelper(state, action)

  if (state.date.value !== newState.date.value) {
    setCookie(null, "value", newState.date.value.toISOString(), cookieOptions)
  }

  return newState
}
