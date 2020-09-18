import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import getCalendar from "app/calendars/queries/getCalendar"
import updateCalendar from "app/calendars/mutations/updateCalendar"
import CalendarForm from "app/calendars/components/CalendarForm"

export const EditCalendar = () => {
  const router = useRouter()
  const calendarId = useParam("calendarId", "number")
  const [calendar, { mutate }] = useQuery(getCalendar, { where: { id: calendarId } })

  return (
    <div>
      <h1>Edit Calendar {calendar.id}</h1>
      <pre>{JSON.stringify(calendar)}</pre>

      <CalendarForm
        initialValues={calendar}
        onSubmit={async () => {
          try {
            const updated = await updateCalendar({
              where: { id: calendar.id },
              data: { name: "MyNewName" },
            })
            mutate(updated)
            alert("Success!" + JSON.stringify(updated))
            router.push("/calendars/[calendarId]", `/calendars/${updated.id}`)
          } catch (error) {
            console.log(error)
            alert("Error creating calendar " + JSON.stringify(error, null, 2))
          }
        }}
      />
    </div>
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
          <Link href="/calendars">
            <a>Calendars</a>
          </Link>
        </p>
      </main>
    </div>
  )
}

EditCalendarPage.getLayout = (page) => <Layout title={"Edit Calendar"}>{page}</Layout>

export default EditCalendarPage
