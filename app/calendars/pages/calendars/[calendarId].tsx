import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import getCalendar from "app/calendars/queries/getCalendar"
import deleteCalendar from "app/calendars/mutations/deleteCalendar"

export const Calendar = () => {
  const router = useRouter()
  const calendarId = useParam("calendarId", "number")
  const [calendar] = useQuery(getCalendar, { where: { id: calendarId } })

  return (
    <div>
      <h1>Calendar {calendar.id}</h1>
      <pre>{JSON.stringify(calendar, null, 2)}</pre>

      <Link href="/calendars/[calendarId]/edit" as={`/calendars/${calendar.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteCalendar({ where: { id: calendar.id } })
            router.push("/calendars")
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

const ShowCalendarPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Calendar</title>
      </Head>

      <main>
        <p>
          <Link href="/calendars">
            <a>Calendars</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <Calendar />
        </Suspense>
      </main>
    </div>
  )
}

ShowCalendarPage.getLayout = (page) => <Layout title={"Calendar"}>{page}</Layout>

export default ShowCalendarPage
