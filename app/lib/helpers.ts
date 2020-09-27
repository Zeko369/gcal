import { Scale, day } from "./reducer"

export function firstOfWeek(date = new Date()) {
  let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
  return new Date(date.setDate(diff) - (date.getTime() % (1000 * 60 * 60 * 24)))
}

export const firstOfMonth = (date = new Date()) => {
  let diff = date.getDate()
  return new Date(date.getTime() - (diff - 1) * (1000 * 60 * 60 * 24))
}

export const firstOfYear = (date = new Date()) => {
  let tmp = new Date(date)

  tmp.setMonth(0)
  tmp.setDate(0)
  tmp.setHours(0)
  tmp.setMinutes(0)
  tmp.setSeconds(0)
  tmp.setMilliseconds(0)

  return tmp
}

export const endOfWeek = (date = new Date()) => {
  return new Date(firstOfWeek(date).getTime() + 1000 * 60 * 60 * 24 * 7)
}

export const endOfMonth = (date = new Date()) => {
  let newDate = new Date(date)

  newDate.setMonth(newDate.getMonth() === 11 ? 0 : newDate.getMonth() + 1)

  const firstOfNext = firstOfMonth(newDate).getTime() - 24 * 60 * 60 * 1000

  return new Date(firstOfNext)
}

export const endOfYear = (date = new Date()) => {
  let tmp = new Date(date)

  tmp.setMonth(11)
  tmp.setDate(31)
  tmp.setMonth(0)
  tmp.setDate(0)
  tmp.setHours(0)
  tmp.setMinutes(0)
  tmp.setSeconds(0)
  tmp.setMilliseconds(0)

  tmp.setTime(tmp.getTime() + day())

  return tmp
}

export const timeMin = ({ scale, value }: { scale: Scale; value: Date }): Date | undefined => {
  switch (scale) {
    case "day": {
      const yesterday = new Date(value)
      yesterday.setHours(0)
      yesterday.setMinutes(0)
      yesterday.setSeconds(0)
      yesterday.setMilliseconds(0)
      yesterday.setTime(yesterday.getTime() - 1)
      return yesterday
    }
    case "week":
      return firstOfWeek(value)
    case "month":
      return firstOfMonth(value)
    case "year":
      return firstOfYear(value)
  }
}

export const timeMax = ({ scale, value }: { scale: Scale; value: Date }): Date | undefined => {
  switch (scale) {
    case "day": {
      const tomorrow = new Date(value)
      tomorrow.setHours(0)
      tomorrow.setMinutes(0)
      tomorrow.setSeconds(0)
      tomorrow.setMilliseconds(0)
      tomorrow.setTime(tomorrow.getTime() + day() + 1)
      return tomorrow
    }
    case "week":
      return endOfWeek(value)
    case "month":
      return endOfMonth(value)
    case "year":
      return endOfYear(value)
  }
}
