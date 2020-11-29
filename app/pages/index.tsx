import React, {
  Suspense,
  useCallback,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from "react"
import { BlitzPage, GetServerSideProps, useQuery } from "blitz"
import {
  Box,
  Button,
  Flex,
  forwardRef,
  Grid,
  Heading,
  HStack,
  IconButton,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useBreakpointValue,
  VStack,
  useDisclosure,
  UseDisclosureReturn,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react"
import { endOfWeek } from "date-fns"
import { Calendar } from "@prisma/client"
import { Link } from "chakra-next-link"
import { ParsedUrlQuery } from "querystring"
import { GetServerSidePropsContext } from "next"
import { ArrowLeftIcon, ArrowRightIcon, RepeatIcon, ViewIcon } from "@chakra-ui/icons"
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
import getGoogleCalendarEvents from "app/queries/getGoogleCalendarEvents"
import { timeMax, timeMin } from "app/lib/time"
import { RestGoogleToken } from "app/components/RestGoogleToken"
import { cookieOptions } from "app/lib/cookie"

const format = (n: number) => Math.round(n * 100) / 100

interface EventModalProps {
  modal: UseDisclosureReturn
}

const CheckIcon: React.FC<{ value: boolean }> = ({ value }) => {
  return <i className="material-icons">{`check_box${value ? "_outline_blank" : ""}`}</i>
}

const EventsModal: React.FC<EventModalProps> = ({ modal }) => {
  const { state } = useStore()

  console.log(state)

  return (
    <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
      <ModalOverlay />
      <ModalContent>
        {state.calendar ? (
          <>
            <ModalHeader>{state.calendar.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <List spacing={2}>
                {state.events.map((event) => (
                  <ListItem d="flex">
                    <ListIcon as={() => <CheckIcon value={event.planned} />} color="green.500" />
                    {`${new Date(event.start).toDateString()} => [${event.time / 60}h]`}
                    <br />
                    {event.summary}
                  </ListItem>
                ))}
              </List>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={modal.onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        ) : (
          <ModalHeader>Error </ModalHeader>
        )}
      </ModalContent>
    </Modal>
  )
}

type CalendarEventsProps = { calendar: Calendar }
const CalendarEvents = forwardRef(({ calendar }: CalendarEventsProps, ref) => {
  const { state, dispatch } = useStore()

  const [{ data }, { refetch }] = useQuery(getGoogleCalendarEvents, {
    calendarId: calendar.uuid,
    timeMin: timeMin(state.date),
    timeMax: timeMax(state.date),
  })

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

  return (
    <VStack align="flex-start" spacing="1">
      <Heading fontSize="lg" color="black">
        Hours:{" "}
        <strong>
          {format(data.soFar / 60)}h [{format(data.all / 60)}]
        </strong>
      </Heading>
      <Text color="black">Count: {data.formatted.length}</Text>
    </VStack>
  )
})

interface CalendarCardProps {
  calendar: Calendar
  openModal?: () => void
}

const CalendarCard: React.FC<CalendarCardProps> = ({ calendar, openModal }) => {
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

  return (
    <VStack
      p="4"
      pt="2"
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      align="flex-start"
      bg={calendar.color ? `${calendar.color}.300` : undefined}
      key={calendar.id}
    >
      <Flex justify="space-between" w="100%">
        <Link href="/calendars/[id]" nextAs={`/calendars/${calendar.id}`}>
          <Heading size="lg" color="black">
            {calendar.name}
          </Heading>
        </Link>
        <HStack ml="2">
          <IconButton
            size="xs"
            icon={<ViewIcon />}
            aria-label="toggle show events"
            onClick={onView}
          />
          <IconButton size="xs" icon={<RepeatIcon />} aria-label="refresh" onClick={refetch} />
        </HStack>
      </Flex>

      <Suspense fallback={<Spinner />}>
        <CalendarEvents calendar={calendar} ref={ref} />
      </Suspense>
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
      <Flex justify="space-between" align="center">
        <Heading size="md" mb="2">
          {date}
        </Heading>
        <Button colorScheme="green" onClick={() => dispatch({ type: "reset" })}>
          Reset
        </Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mt="4">
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

const handleCookie = <T extends Date | String | Scale>(
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

    return val
  } catch (err) {
    if (!(err instanceof Error && err.message === "noCookie")) {
      console.error(err)
    }

    setCookie(ctx, key, defaultValue, cookieOptions)
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
