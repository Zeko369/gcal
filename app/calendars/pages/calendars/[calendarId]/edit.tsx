import React, { Suspense } from "react"
import { Head, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import { Flex, Heading, HStack, IconButton, VStack } from "@chakra-ui/react"

import Layout from "app/layouts/Layout"
import { CalendarForm, CalendarFormData } from "app/calendars/components/CalendarForm"
import getCalendar from "app/calendars/queries/getCalendar"
import updateCalendarFn from "app/calendars/mutations/updateCalendar"
import deleteCalendarFn from "app/calendars/mutations/deleteCalendar"
import archiveCalendarFn from "app/calendars/mutations/archiveCalendar"
import { DeleteIcon, EmailIcon, RepeatClockIcon } from "@chakra-ui/icons"

export const EditCalendar = () => {
  const router = useRouter()
  const calendarId = useParam("calendarId", "number")
  const [calendar, { mutate }] = useQuery(getCalendar, { where: { id: calendarId } })

  const [updateCalendar] = useMutation(updateCalendarFn)
  const [deleteCalendar] = useMutation(deleteCalendarFn)
  const [archiveCalendar] = useMutation(archiveCalendarFn)

  const onSubmit = async (data: CalendarFormData) => {
    try {
      const updated = await updateCalendar({ where: { id: calendar.id }, data })
      await mutate(updated)
      await router.push("/")
    } catch (error) {
      console.error(error)
    }
  }

  const onDelete = async () => {
    if (window.confirm("This calendar be deleted")) {
      await deleteCalendar({ where: { id: calendar.id } })
      await router.push("/")
    }
  }

  const onArchive = async () => {
    if (window.confirm(`This calendar will be ${calendar.archivedAt ? "un" : ""}archived`)) {
      await archiveCalendar({ where: { id: calendar.id } })
      await router.push("/")
    }
  }

  return (
    <VStack w="100%" align="flex-start">
      <Flex w="100%" justify="space-between">
        <Heading>Edit Calendar {calendar.id}</Heading>
        <HStack>
          <IconButton
            colorScheme="red"
            aria-label="delete"
            icon={<DeleteIcon />}
            onClick={onDelete}
          >
            Delete
          </IconButton>
          <IconButton
            colorScheme="orange"
            aria-label="archive"
            icon={calendar.archivedAt ? <RepeatClockIcon /> : <EmailIcon />}
            onClick={onArchive}
          >
            {calendar.archivedAt ? "UNArchive" : "Archive"}
          </IconButton>
        </HStack>
      </Flex>
      <CalendarForm initialValues={calendar} onSubmit={onSubmit} update />
    </VStack>
  )
}

const EditCalendarPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Edit Calendar</title>
      </Head>

      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <EditCalendar />
        </Suspense>
      </main>
    </div>
  )
}

EditCalendarPage.getLayout = (page) => <Layout title={"Edit Calendar"}>{page}</Layout>

export default EditCalendarPage
