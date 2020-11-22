import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import { Link } from "chakra-next-link"
import getCalendar from "app/calendars/queries/getCalendar"
import updateCalendar from "app/calendars/mutations/updateCalendar"
import { CalendarForm, CalendarFormData } from "app/calendars/components/CalendarForm"
import { Heading } from "@chakra-ui/react"

export const EditCalendar = () => {
  const router = useRouter()
  const calendarId = useParam("calendarId", "number")
  const [calendar, { mutate }] = useQuery(getCalendar, { where: { id: calendarId } })

  const onSubmit = async (data: CalendarFormData) => {
    try {
      const updated = await updateCalendar({
        where: { id: calendar.id },
        data,
      })
      await mutate(updated)
      await router.push("/calendars/[calendarId]", `/calendars/${updated.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Heading>Edit Calendar {calendar.id}</Heading>
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
