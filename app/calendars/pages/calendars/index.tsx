import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import getCalendars from "app/calendars/queries/getCalendars"

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
    <div>
      <ul>
        {calendars.map((calendar) => (
          <li key={calendar.id}>
            <Link href="/calendars/[calendarId]" as={`/calendars/${calendar.id}`}>
              <a>{calendar.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const CalendarsPage: BlitzPage = () => {
  return (
    <div>
      <Head>
        <title>Calendars</title>
      </Head>

      <main>
        <h1>Calendars</h1>

        <p>
          <Link href="/calendars/new">
            <a>Create Calendar</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <CalendarsList />
        </Suspense>
      </main>
    </div>
  )
}

CalendarsPage.getLayout = (page) => <Layout title={"Calendars"}>{page}</Layout>

export default CalendarsPage
