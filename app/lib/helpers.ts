export const monday = (date = new Date()) => {
  let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
  return new Date(date.setDate(diff) - (date.getTime() % (1000 * 60 * 60 * 24)))
}

export const firstOfMonth = (date = new Date()) => {
  let diff = date.getDate()
  return new Date(date.getTime() - (diff - 1) * (1000 * 60 * 60 * 24))
}

export const endOfWeek = (date = new Date()) => {
  return new Date(monday(date).getTime() + 1000 * 60 * 60 * 24 * 7)
}

export const endOfMonth = (date = new Date()) => {
  let newDate = new Date(date)

  newDate.setMonth(newDate.getMonth() === 11 ? 0 : newDate.getMonth() + 1)

  const firstOfNext = firstOfMonth(newDate).getTime() - 24 * 60 * 60 * 1000

  return new Date(firstOfNext)
}
