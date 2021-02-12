import React, { Suspense, useCallback, useMemo, useReducer } from "react"
import { BlitzPage, GetServerSideProps, useQuery } from "blitz"
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { endOfWeek } from "date-fns"
import { ParsedUrlQuery } from "querystring"
import { GetServerSidePropsContext } from "next"
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons"
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
import { cookieOptions } from "app/lib/cookie"
import { EventsModal } from "app/components/EventsModal"
import { CalendarCard } from "app/components/CalendarCard"
import { NavigationButton } from "app/components/NavigationButton"
import { LinkButton, LinkIconButton } from "chakra-next-link"
import homepageQuery from "app/queries/homepageQuery"
import {
  DATE_SCALE_COOKIE_NAME,
  DATE_VALUE_COOKIE_NAME,
  SHOW_ALL_COOKIE_NAME,
} from "app/constants/cookies"

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

const HomePage: React.FC = () => {
  const { dispatch, state, modal } = useStore()
  const [groups] = useQuery(homepageQuery, {
    showArchived: state.showArchived,
  })

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const scale = e.target.value as Scale
      const value = intervals.find((i) => i.key === scale)!.value

      setValueScale(dispatch)(value, scale)
    },
    [dispatch]
  )

  const date = useMemo(() => dFormat(state.date.value, state.date.scale), [state])
  const bg = useColorModeValue("gray.100", "gray.700")

  const filteredGroups = groups.filter((g) => (state.showAll ? true : g.default))

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
      <Flex justify={["flex-end", "space-between"]} align="center" flexWrap="wrap">
        <Heading size="md" mb="2" maxW="100%" wordBreak="break-word">
          {date}
        </Heading>
        <HStack>
          {groups.length > 1 && (
            <Button
              colorScheme="blue"
              variant={state.showAll ? "solid" : "ghost"}
              onClick={() => dispatch({ type: "toggleAll" })}
              size="sm"
            >
              {!state.showAll ? "Compact" : "All groups"}
            </Button>
          )}
          <Button
            colorScheme="blue"
            variant={state.showArchived ? "solid" : "ghost"}
            onClick={() => dispatch({ type: "toggleArchived" })}
            size="sm"
          >
            Archived
          </Button>
          <Button
            colorScheme="blue"
            variant={state.showPrice ? "solid" : "ghost"}
            onClick={() => dispatch({ type: "togglePrice" })}
            size="sm"
          >
            Price
          </Button>
          <Button colorScheme="green" onClick={() => dispatch({ type: "reset" })} size="sm">
            Now
          </Button>
        </HStack>
      </Flex>
      {groups.length === 0 ? (
        <Flex w="100%" justifyContent="center">
          <Box
            mt="4"
            p="8"
            shadow="md"
            borderRadius="md"
            alignItems="center"
            justifyContent="center"
            bg={bg}
          >
            <VStack>
              <Heading size="lg">Add your first calendar</Heading>
              <LinkIconButton
                href="/calendars/new"
                borderRadius="50%"
                icon={<AddIcon />}
                aria-label="Add calendar"
              />
            </VStack>
          </Box>
        </Flex>
      ) : (
        filteredGroups.map((group) => (
          <Box key={group.id} mb="4">
            {state.showAll && filteredGroups.length > 1 && (
              <Flex w="100%" justifyContent="space-between">
                <HStack>
                  <Heading>{group.name}</Heading>
                </HStack>
                <HStack>
                  <LinkButton size="sm" href={`/groups/${group.id}/edit`} colorScheme="green">
                    Edit
                  </LinkButton>
                </HStack>
              </Flex>
            )}

            <SimpleGrid columns={[1, 3, 3, 4]} spacing={3} mt="4">
              {group.calendars.map((calendar) => (
                <CalendarCard calendar={calendar} key={calendar.id} openModal={modal?.onOpen} />
              ))}
            </SimpleGrid>
          </Box>
        ))
      )}
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
  all?: boolean
}

const init = (props: HomeProps): Store["state"] => {
  return {
    ...initialState,
    showAll: !!props.all,
    date: {
      scale: props.date.scale || initialState.date.scale,
      value: props.date.value ? new Date(props.date.value) : initialState.date.value,
    },
  }
}

const Home: BlitzPage<HomeProps> = (props) => {
  const [state, dispatch] = useReducer<typeof reducer, HomeProps>(reducer, props, init)
  const modal = useDisclosure()

  return (
    <StoreContext.Provider value={{ dispatch, state, modal }}>
      <EventsModal modal={modal} />
      <Suspense fallback={<Spinner />}>
        <Main />
      </Suspense>
    </StoreContext.Provider>
  )
}

const handleCookie = (
  cookies: Record<string, string>,
  ctx: GetServerSidePropsContext<ParsedUrlQuery>
) => <T extends String | Scale | boolean>(
  key: string,
  handle: (val: any) => T,
  defaultValue: string | boolean
): T | undefined => {
  try {
    if (!cookies[key]) {
      throw new Error("noCookie")
    }

    const val = handle(cookies[key])
    setCookie(ctx, key, val.toString(), cookieOptions)

    if (val === true || val === false) {
      return val
    }

    // @ts-ignore
    return val.toString()
  } catch (err) {
    if (!(err instanceof Error && err.message === "noCookie")) {
      console.error(err)
    }

    setCookie(ctx, key, String(defaultValue), cookieOptions)

    // @ts-ignore
    return defaultValue
  }
}

const d = (val: string | Date) => new Date(val).toISOString()
export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const c = parseCookies(ctx)
  const cook = handleCookie(c, ctx)

  const value = cook(DATE_VALUE_COOKIE_NAME, (val) => d(val), d(initialState.date.value))
  const scale = cook(DATE_SCALE_COOKIE_NAME, (val) => val as Scale, initialState.date.scale)

  return {
    props: {
      all: cook(SHOW_ALL_COOKIE_NAME, (val) => val === "true", true),
      date: {
        value,
        scale,
      },
    },
  }
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
