import React, {
  forwardRef,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"
import { useQuery } from "blitz"
import { LinkIconButton } from "chakra-next-link"
import { Heading, VStack, useColorModeValue, Spinner, IconButton, Text } from "@chakra-ui/react"
import { EditIcon, ViewIcon, RepeatIcon } from "@chakra-ui/icons"
import { Calendar } from "@prisma/client"

import { useStore } from "app/lib/reducer"
import { timeMax, timeMin } from "app/lib/time"
import getGoogleCalendarEvents from "app/queries/getGoogleCalendarEvents"
import { RestGoogleToken } from "./RestGoogleToken"
import styled from "@emotion/styled"
import { CALENDAR_CARD_COLOR_VARIANT } from "app/constants/colors"
import splitbee from "@splitbee/web"

// just to make prettier play nicer with some long functions
type n = number
const format = (n: n) => Math.round(n * 100) / 100
export const formatTime = (curr: n, all: n) => `${format(curr / 60)}h [${format(all / 60)}]`
export const formatPriceRaw = (
  calendar: Pick<Calendar, "pricePerHour" | "currency" | "currencyBefore">
) => (curr: n, all: n): string => {
  const pph = calendar.pricePerHour
  const currencyBefore = calendar.currencyBefore ? calendar.currency || "Na" : ""
  const currencyAfter = calendar.currencyBefore ? "" : calendar.currency || "Na"

  if (!pph) {
    return "No PPH"
  }

  const done = `${currencyBefore}${format((curr / 60) * pph)}${currencyAfter}`
  const todo = `[${currencyBefore}${format((all / 60) * pph)}${currencyAfter}]`

  return `${done} ${todo}`
}

type CalendarEventsProps = { calendar: Calendar }
const CalendarEvents = forwardRef(({ calendar }: CalendarEventsProps, ref) => {
  const { state, dispatch } = useStore()

  const args = {
    calendarId: calendar.uuid,
    timeMin: timeMin(state.date),
    timeMax: timeMax(state.date),
  }

  const [{ data }, { refetch }] = useQuery(getGoogleCalendarEvents, args)
  const formatPrice = useCallback(formatPriceRaw(calendar), [calendar])

  useEffect(() => {
    dispatch({
      type: "addCalendarData",
      payload: {
        calendarId: calendar.id,
        done: data.soFar,
        all: data.all,
      },
    })
  }, [data])

  useImperativeHandle(ref, () => ({
    refetch,
    setEvents: () => dispatch({ type: "setEvents", payload: { calendar, events: data.formatted } }),
  }))

  if (!data) {
    return (
      <>
        <Heading size="sm">Token probably wrong</Heading>
        <RestGoogleToken />
      </>
    )
  }

  const opacity = state.showPrice ? (calendar.pricePerHour ? 1 : 0.6) : 1

  return (
    <VStack align="flex-start" spacing="1" opacity={opacity}>
      <Heading fontSize="lg" color="black">
        {state.showPrice ? (
          <strong>{formatPrice(data.soFar, data.all)}</strong>
        ) : (
          <strong>{formatTime(data.soFar, data.all)}</strong>
        )}
      </Heading>
      <Text color="black">Count: {data.formatted.length}</Text>
    </VStack>
  )
})

interface CalendarCardProps {
  calendar: Calendar
  openModal?: () => void
}

const buttonProps = {
  variant: "outline",
  colorScheme: "white",
  size: "xs",
}

const Card = styled(VStack)`
  #buttons {
    display: none;
  }

  &:hover {
    #buttons {
      display: flex;
    }
  }
`

export const CalendarCard: React.FC<CalendarCardProps> = ({ calendar, openModal }) => {
  const ref = useRef(null)

  const refetch = async () => {
    if (ref.current) {
      await (ref.current as any).refetch()
    }
  }

  const onView = () => {
    if (ref.current) {
      ;(ref.current as any).setEvents()
      openModal?.()
    }
  }

  const bg = useColorModeValue("gray.100", "gray.700")

  return (
    <Card
      p="4"
      pt="2"
      pos="relative"
      shadow="md"
      borderRadius="md"
      align="flex-start"
      bg={calendar.color ? `${calendar.color}.${CALENDAR_CARD_COLOR_VARIANT}` : bg}
      key={calendar.id}
    >
      <VStack align="left">
        <Heading size="lg" color="black">
          {calendar.name}
        </Heading>
        <Suspense fallback={<Spinner size="lg" />}>
          <CalendarEvents calendar={calendar} ref={ref} />
        </Suspense>
      </VStack>
      <VStack ml="2" pos="absolute" top="0" right="2" bottom="0" id="buttons">
        <LinkIconButton
          {...buttonProps}
          icon={<EditIcon />}
          aria-label="edit"
          href={`/calendars/${calendar.id}/edit`}
        />
        <IconButton
          {...buttonProps}
          icon={<ViewIcon />}
          aria-label="toggle show events"
          onClick={() => {
            onView()
            splitbee.track("calendar:view", { id: calendar.id })
          }}
        />
        <IconButton {...buttonProps} icon={<RepeatIcon />} aria-label="refresh" onClick={refetch} />
      </VStack>
    </Card>
  )
}
