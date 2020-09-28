import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from "date-fns"
import { Scale, day } from "./reducer"

type DateSetObj = Record<"M" | "D" | "h" | "m" | "s" | "ms", number>
export const set = (date: Date, { M, D, h, m, s, ms }: Partial<DateSetObj>): Date => {
  let tmp = new Date(date)

  M && tmp.setMonth(M)
  D && tmp.setDate(D)
  h && tmp.setHours(h)
  m && tmp.setMinutes(m)
  s && tmp.setSeconds(s)
  ms && tmp.setMilliseconds(ms)

  return tmp
}

const timeMin = ({ scale, value }: { scale: Scale; value: Date }): Date | undefined => {
  switch (scale) {
    case "day": {
      const yesterday = set(value, { h: 0, m: 0, s: 0, ms: 0 })
      yesterday.setTime(yesterday.getTime() - 1)
      return yesterday
    }
    case "week":
      return startOfWeek(value, { weekStartsOn: 1 })
    case "month":
      return startOfMonth(value)
    case "year":
      return startOfYear(value)
  }
}

const timeMax = ({ scale, value }: { scale: Scale; value: Date }): Date | undefined => {
  switch (scale) {
    case "day": {
      const tomorrow = set(value, { h: 0, m: 0, s: 0, ms: 0 })
      tomorrow.setTime(tomorrow.getTime() + day() + 1)
      return tomorrow
    }
    case "week":
      return endOfWeek(value, { weekStartsOn: 1 })
    case "month":
      return endOfMonth(value)
    case "year":
      return endOfYear(value)
  }
}

export { timeMin, timeMax }
