import React from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, BlitzPage } from "blitz"
import createCalendar from "../../mutations/createCalendar"
import { CalendarForm, CalendarFormData } from "../../components/CalendarForm"

const NewCalendarPage: BlitzPage = () => {
  const router = useRouter()

  const onSubmit = async (data: CalendarFormData) => {
    try {
      const calendar = await createCalendar({ data })
      router.push("/calendars/[calendarId]", `/calendars/${calendar.id}`)
    } catch (error) {
      alert("Error creating calendar " + JSON.stringify(error, null, 2))
    }
  }

  return (
    <div>
      <Head>
        <title>New Calendar</title>
      </Head>

      <h1>Create New Calendar</h1>

      <CalendarForm onSubmit={onSubmit} />

      <p>
        <Link href="/calendars">
          <a>Calendars</a>
        </Link>
      </p>
    </div>
  )
}

NewCalendarPage.getLayout = (page) => <Layout title={"Create New Calendar"}>{page}</Layout>

export default NewCalendarPage
