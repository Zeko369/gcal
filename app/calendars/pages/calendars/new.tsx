import React from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, BlitzPage } from "blitz"
import createCalendar from "app/calendars/mutations/createCalendar"
import CalendarForm from "app/calendars/components/CalendarForm"

const NewCalendarPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>New Calendar</title>
      </Head>

      <main>
        <h1>Create New Calendar</h1>

        <CalendarForm
          initialValues={{}}
          onSubmit={async () => {
            try {
              const calendar = await createCalendar({ data: { name: "MyName" } })
              alert("Success!" + JSON.stringify(calendar))
              router.push("/calendars/[calendarId]", `/calendars/${calendar.id}`)
            } catch (error) {
              alert("Error creating calendar " + JSON.stringify(error, null, 2))
            }
          }}
        />

        <p>
          <Link href="/calendars">
            <a>Calendars</a>
          </Link>
        </p>
      </main>
    </div>
  )
}

NewCalendarPage.getLayout = (page) => <Layout title={"Create New Calendar"}>{page}</Layout>

export default NewCalendarPage
