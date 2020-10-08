import React, { Suspense, useCallback, useMemo, useReducer } from "react"
import { BlitzPage, GetServerSideProps, useQuery } from "blitz"
import {
  Spinner,
  Heading,
  Text,
  VStack,
  Flex,
  IconButton,
  HStack,
  SimpleGrid,
  Box,
  Select,
  Button,
  Grid,
  useBreakpointValue,
} from "@chakra-ui/core"
import { endOfWeek } from "date-fns"
import { Calendar } from "@prisma/client"
import { Link, LinkIconButton } from "chakra-next-link"
import { ArrowLeftIcon, DeleteIcon, EditIcon, ArrowRightIcon } from "@chakra-ui/icons"
import { parseCookies, setCookie } from "nookies"

import { initialState, reducer, setValueScale, StoreContext, Store } from "app/lib/reducer"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import Layout from "app/layouts/Layout"
import getCalendarsDB from "app/calendars/queries/getCalendars"
import getGoogleCalendarEvents from "app/queries/getGoogleCalendarEvents"
import { useStore, Scale, Scales, intervals } from "app/lib/reducer"
import { timeMin, timeMax } from "app/lib/time"
import { RestGoogleToken } from "app/components/RestGoogleToken"
import { cookieOptions } from "app/lib/cookie"

const format = (n: number) => Math.round(n * 100) / 100

const CalendarEvents: React.FC<{ calendar: Calendar }> = ({ calendar }) => {
  const { state } = useStore()
  const [{ data }] = useQuery(getGoogleCalendarEvents, {
    calendarId: calendar.uuid,
    timeMin: timeMin(state.date),
    timeMax: timeMax(state.date),
  })

  if (!data) {
    return (
      <>
        <Heading size="sm">Token probably wrong</Heading>
        <RestGoogleToken />
      </>
    )
  }

  return (
    <VStack align="flex-start" spacing="1">
      <Heading fontSize="lg">
        Hours:{" "}
        <strong>
          {format(data.soFar / 60)}h [{format(data.all / 60)}]
        </strong>
      </Heading>
      <Text>Count: {data.formatted.length}</Text>
    </VStack>
  )
}

const dFormat = (date: Date, scale: Scale) => {
  switch (scale) {
    case "day":
      return `Day: ${date.toDateString()}`
    case "week":
      const end = endOfWeek(date, { weekStartsOn: 1 })
      return `Week: ${date.toDateString()} - ${end.toDateString()}`
    case "month":
      const month = date
        .toDateString()
        .split(" ")
        .filter((_, i) => i % 2 === 1)
        .join(" ")
      return `Month: ${month}`
    case "year":
      return `Year: ${date.getFullYear()}`
  }
}

interface NavigationButtonProps {
  label: string
  Icon: React.ReactElement
  action: "val++" | "val--"
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ label, Icon, action }) => {
  const { dispatch } = useStore()
  const icon = useBreakpointValue({ base: 1, md: 0 })

  return icon ? (
    <IconButton
      colorScheme="blue"
      onClick={() => dispatch({ type: action })}
      icon={Icon}
      aria-label={label}
    />
  ) : (
    <Button colorScheme="blue" onClick={() => dispatch({ type: action })} leftIcon={Icon}>
      {label}
    </Button>
  )
}

const HomePage: React.FC = () => {
  const [{ calendars }] = useQuery(getCalendarsDB, {})
  const { dispatch, state } = useStore()

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const scale = e.target.value as Scale
      const value = intervals.find((i) => i.key === scale)!.value

      setValueScale(dispatch)(value, scale)
    },
    [dispatch]
  )

  const date = useMemo(() => dFormat(state.date.value, state.date.scale), [state])

  return (
    <Box>
      <Grid templateColumns="1fr 2fr 1fr" gap={3}>
        <NavigationButton label="Previous" Icon={<ArrowLeftIcon />} action="val--" />
        <Select mb="3" onChange={onChange} value={state.date.scale}>
          {intervals.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <NavigationButton label="Next" Icon={<ArrowRightIcon />} action="val++" />
      </Grid>
      <Flex justify="space-between">
        <Heading size="md" mb="2">
          {date}
        </Heading>
        <Button colorScheme="green" onClick={() => dispatch({ type: "reset" })}>
          Reset
        </Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
        {calendars.map((calendar) => (
          <VStack p="4" pt="2" shadow="md" borderWidth="1px" key={calendar.id} align="flex-start">
            <Flex justify="space-between" w="100%">
              <Link href="/calendars/[id]" nextAs={`/calendars/${calendar.id}`}>
                <Heading size="lg">{calendar.name}</Heading>
              </Link>
              <HStack>
                <LinkIconButton
                  size="xs"
                  colorScheme="green"
                  icon={<EditIcon />}
                  href="/calendars/[id]/edit"
                  nextAs={`/calendars/${calendar.id}/edit`}
                  aria-label="edit"
                />
                <IconButton size="xs" colorScheme="red" icon={<DeleteIcon />} aria-label="delete" />
              </HStack>
            </Flex>
            <Suspense fallback={<Spinner />}>
              <CalendarEvents calendar={calendar} />
            </Suspense>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  )
}

const Main: React.FC = () => {
  const [currentUser] = useCurrentUser()

  return currentUser ? (
    <HomePage />
  ) : (
    <>
      <Heading>Welcome to GCAL app</Heading>
      <Heading size="lg">Go login</Heading>
    </>
  )
}

interface HomeProps {
  date: Partial<{ value: string; scale: Scale }>
}

const init = (date: HomeProps["date"]): Store["state"] => {
  return {
    ...initialState,
    date: {
      scale: date.scale || initialState.date.scale,
      value: date.value ? new Date(date.value) : initialState.date.value,
    },
  }
}

const Home: BlitzPage<HomeProps> = ({ date }) => {
  const [state, dispatch] = useReducer<typeof reducer, HomeProps["date"]>(reducer, date, init)

  return (
    <StoreContext.Provider value={{ dispatch, state }}>
      <Suspense fallback={() => <Spinner />}>
        <Main />
      </Suspense>
    </StoreContext.Provider>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const cookies = parseCookies(ctx)
  const output: HomeProps["date"] = {}

  try {
    if (!cookies.value) {
      throw new Error("noCookie")
    }
    const value = new Date(cookies.value)
    output.value = value.toISOString()
  } catch (err) {
    if (!(err instanceof Error && err.message === "noCookie")) {
      console.error(err)
    }

    setCookie(ctx, "value", initialState.date.value.toISOString(), cookieOptions)
  }

  try {
    if (!cookies.scale) {
      throw new Error("noScale")
    }

    if (!Scales.includes(cookies.scale as Scale)) {
      throw new Error("Scale not found")
    }

    const scale = cookies.scale as Scale
    output.scale = scale
  } catch (err) {
    if (!(err instanceof Error && err.message === "noScale")) {
      console.error(err)
    }

    setCookie(ctx, "scale", initialState.date.scale, cookieOptions)
  }

  !cookies.scale && setCookie(ctx, "scale", initialState.date.scale, cookieOptions)

  return { props: { date: output } }
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
