import React, { Suspense, useCallback, useMemo, useReducer } from "react"
import { BlitzPage, GetServerSideProps, useQuery } from "blitz"
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Select,
  SimpleGrid,
  Spinner,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { endOfWeek } from "date-fns"
import { ParsedUrlQuery } from "querystring"
import { GetServerSidePropsContext } from "next"
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons"
import { parseCookies, setCookie } from "nookies"

import {
  initialState,
  intervals,
  reducer,
  Scale,
  setValueScale,
  Store,
  StoreContext,
  useStore,
} from "app/lib/reducer"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import Layout from "app/layouts/Layout"
import getCalendarsDB from "app/calendars/queries/getCalendars"
import { cookieOptions } from "app/lib/cookie"
import { EventsModal } from "app/components/EventsModal"
import { CalendarCard } from "app/components/CalendarCard"

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
  const { dispatch, state, modal } = useStore()

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
      <Grid templateColumns={"1fr 2fr 1fr"} gap={3}>
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
      <Flex justify="space-between" align="center">
        <Heading size="md" mb="2">
          {date}
        </Heading>
        <Button colorScheme="green" onClick={() => dispatch({ type: "reset" })} size="sm">
          Now
        </Button>
      </Flex>
      <SimpleGrid columns={[1, 3, 3, 4]} spacing={3} mt="4">
        {calendars.map((calendar) => (
          <CalendarCard calendar={calendar} key={calendar.id} openModal={modal?.onOpen} />
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
  const modal = useDisclosure()

  return (
    <StoreContext.Provider value={{ dispatch, state, modal }}>
      <EventsModal modal={modal} />
      <Suspense fallback={() => <Spinner />}>
        <Main />
      </Suspense>
    </StoreContext.Provider>
  )
}

const handleCookie = <T extends String | Scale>(
  cookies: Record<string, string>,
  ctx: GetServerSidePropsContext<ParsedUrlQuery>,
  key: string,
  handle: (val: any) => T,
  defaultValue: string
): T | undefined => {
  try {
    if (!cookies[key]) {
      throw new Error("noCookie")
    }

    const val = handle(cookies[key])
    setCookie(ctx, key, val.toString(), cookieOptions)

    // @ts-ignore
    return val.toString()
  } catch (err) {
    if (!(err instanceof Error && err.message === "noCookie")) {
      console.error(err)
    }

    setCookie(ctx, key, defaultValue, cookieOptions)

    // @ts-ignore
    return defaultValue
  }
}

const d = (val: string | Date) => new Date(val).toISOString()
export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const c = parseCookies(ctx)
  const output: HomeProps["date"] = {}

  output.value = handleCookie(c, ctx, "value", (val) => d(val), d(initialState.date.value))
  output.scale = handleCookie(c, ctx, "scale", (val) => val as Scale, initialState.date.scale)

  return { props: { date: output } }
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
