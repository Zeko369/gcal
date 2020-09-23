import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import getCalendars from "app/calendars/queries/getCalendars"
import { Box, Button, Flex, Heading, UnorderedList, ListItem } from "@chakra-ui/core"
import { AddIcon } from "@chakra-ui/icons"
import { Link, LinkIconButton } from "chakra-next-link"
const ITEMS_PER_PAGE = 100

export const CalendarsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ calendars, hasMore }] = usePaginatedQuery(getCalendars, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <UnorderedList my="4">
        {calendars.map((calendar) => (
          <ListItem key={calendar.id}>
            <Link href="/calendars/[calendarId]" as={`/calendars/${calendar.id}`}>
              {calendar.name}
            </Link>
          </ListItem>
        ))}
      </UnorderedList>

      <Button isDisabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </Button>
      <Button isDisabled={!hasMore} onClick={goToNextPage}>
        Next
      </Button>
    </>
  )
}

const CalendarsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Calendars</title>
      </Head>

      <Flex justify="space-between">
        <Heading>Calendars</Heading>
        <Box>
          <LinkIconButton href="/calendars/new" icon={<AddIcon />} aria-label="new calendar" />
        </Box>
      </Flex>

      <Suspense fallback={<div>Loading...</div>}>
        <CalendarsList />
      </Suspense>
    </>
  )
}

CalendarsPage.getLayout = (page) => <Layout title={"Calendars"}>{page}</Layout>

export default CalendarsPage
