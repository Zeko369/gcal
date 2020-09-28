import React, { Suspense } from "react"
import { LinkIconButton } from "chakra-next-link"
import { Heading, IconButton, Spinner, Flex, HStack } from "@chakra-ui/core"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Head, useRouter, useQuery, useParam, BlitzPage } from "blitz"

import Layout from "app/layouts/Layout"
import getCalendar from "app/calendars/queries/getCalendar"
import deleteCalendar from "app/calendars/mutations/deleteCalendar"
import Table from "app/components/Table"
import getGoogleCalendarEvents from "app/queries/getGoogleCalendarEvents"

const EventData: React.FC<{ uuid: string }> = ({ uuid }) => {
  const [{ data }] = useQuery(getGoogleCalendarEvents, { calendarId: uuid })

  if (!data) {
    return (
      <Heading size="lg" color="red">
        Error reading gcal
      </Heading>
    )
  }

  if (data.formatted.length === 0) {
    return <Heading>No data</Heading>
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>
            <i className="material-icons">check</i>
          </th>
          <th className="summary">Summary</th>
          <th>Time</th>
          <th>When</th>
        </tr>
      </thead>
      <tbody>
        {data.formatted.map((item, index) => (
          <tr key={`${index}-item.summary`}>
            <td>
              <i className="material-icons">{`check_box${item.planned ? "_outline_blank" : ""}`}</i>
            </td>
            <td className="summary">{item.summary}</td>
            <td>{item.time / 60}h</td>
            <td>{new Date(item.start).toUTCString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export const Calendar = () => {
  const router = useRouter()
  const calendarId = useParam("calendarId", "number")
  const [calendar] = useQuery(getCalendar, { where: { id: calendarId } })

  return (
    <>
      <Flex justify="space-between">
        <Heading>{calendar.name}</Heading>
        <HStack>
          <IconButton
            colorScheme="red"
            aria-label="delete"
            icon={<DeleteIcon />}
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                await deleteCalendar({ where: { id: calendar.id } })
                router.push("/calendars")
              }
            }}
          >
            Delete
          </IconButton>
          <LinkIconButton
            colorScheme="green"
            href="/calendars/[calendarId]/edit"
            as={`/calendars/${calendar.id}/edit`}
            icon={<EditIcon />}
            aria-label="edit"
          />
        </HStack>
      </Flex>

      <Suspense fallback={<Spinner />}>
        <EventData uuid={calendar.uuid} />
      </Suspense>
    </>
  )
}

const ShowCalendarPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Calendar</title>
      </Head>

      <Suspense fallback={<div>Loading...</div>}>
        <Calendar />
      </Suspense>
    </>
  )
}

ShowCalendarPage.getLayout = (page) => <Layout title={"Calendar"}>{page}</Layout>

export default ShowCalendarPage
