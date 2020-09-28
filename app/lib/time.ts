import { Scale, day } from "./reducer"

interface TimeHelpers {
  week: (date?: Date) => Date
  month: (date?: Date) => Date
  year: (date?: Date) => Date
}

type DateSetObj = Partial<Record<"M" | "D" | "h" | "m" | "s" | "ms", number>>
export const set = (date: Date, { M, D, h, m, s, ms }: DateSetObj): Date => {
  let tmp = new Date(date)

  M && tmp.setMonth(M)
  D && tmp.setDate(D)
  h && tmp.setHours(h)
  m && tmp.setMinutes(m)
  s && tmp.setSeconds(s)
  ms && tmp.setMilliseconds(ms)

  return tmp
}

const beginning: TimeHelpers = {
  week: (date = new Date()) => {
    let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
    return new Date(date.setDate(diff) - (date.getTime() % (1000 * 60 * 60 * 24)))
  },
  month: (date = new Date()) => {
    return new Date(date.getTime() - (date.getDate() - 1) * (1000 * 60 * 60 * 24))
  },
  year: (date = new Date()) => {
    return set(date, { M: 0, D: 0, h: 0, m: 0, s: 0, ms: 0 })
  },
}

const end: TimeHelpers = {
  week: (date = new Date()) => {
    return new Date(beginning.week(date).getTime() + 1000 * 60 * 60 * 24 * 7)
  },
  month: (date = new Date()) => {
    let newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() === 11 ? 0 : newDate.getMonth() + 1)
    const firstOfNext = beginning.month(newDate).getTime() - 24 * 60 * 60 * 1000
    return new Date(firstOfNext)
  },
  year: (date = new Date()) => {
    const tmp = set(date, { M: 11, D: 31, h: 0, m: 0, s: 0, ms: 0 })
    tmp.setTime(tmp.getTime() + day())
    return tmp
  },
}

const timeMin = ({ scale, value }: { scale: Scale; value: Date }): Date | undefined => {
  switch (scale) {
    case "day": {
      const yesterday = set(value, { h: 0, m: 0, s: 0, ms: 0 })
      yesterday.setTime(yesterday.getTime() - 1)
      return yesterday
    }
    case "week":
    case "month":
    case "year":
      return beginning[scale](value)
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
    case "month":
    case "year":
      return end[scale](value)
  }
}

export { beginning, end, timeMin, timeMax }
