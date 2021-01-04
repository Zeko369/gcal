import React, { Suspense } from "react"
import { Head, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import { Heading, IconButton } from "@chakra-ui/react"
import { Link } from "chakra-next-link"

import Layout from "app/layouts/Layout"
import { CalendarForm, CalendarFormData } from "app/calendars/components/CalendarForm"
import getCalendar from "app/calendars/queries/getCalendar"
import updateCalendarFn from "app/calendars/mutations/updateCalendar"
import deleteCalendarFn from "app/calendars/mutations/deleteCalendar"
import { DeleteIcon } from "@chakra-ui/icons"

export const EditCalendar = () => {
  const router = useRouter()
  const calendarId = useParam("calendarId", "number")
  const [calendar, { mutate }] = useQuery(getCalendar, { where: { id: calendarId } })

  const [updateCalendar] = useMutation(updateCalendarFn)
  const [deleteCalendar] = useMutation(deleteCalendarFn)

  const onSubmit = async (data: CalendarFormData) => {
    try {
      const updated = await updateCalendar({ where: { id: calendar.id }, data })
      await mutate(updated)
      await router.push("/")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Heading>Edit Calendar {calendar.id}</Heading>
      <IconButton
        colorScheme="red"
        aria-label="delete"
        icon={<DeleteIcon />}
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteCalendar({ where: { id: calendar.id } })
            await router.push("/")
          }
        }}
      >
        Delete
      </IconButton>
      <CalendarForm initialValues={calendar} onSubmit={onSubmit} update />
    </>
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

        <p>
          <Link href="/calendars">Calendars</Link>
        </p>
      </main>
    </div>
  )
}

EditCalendarPage.getLayout = (page) => <Layout title={"Edit Calendar"}>{page}</Layout>

export default EditCalendarPage
