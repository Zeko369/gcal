import React, { Suspense, useState } from "react"
import { Head, useRouter, BlitzPage, useMutation } from "blitz"
import { Spinner, Heading } from "@chakra-ui/react"
import Layout from "app/layouts/Layout"
import { ListGcal } from "app/calendars/components/ListGcal"
import { CalendarForm, CalendarFormData } from "../../components/CalendarForm"
import createCalendar from "../../mutations/createCalendar"
import { Link } from "chakra-next-link"

const NewCalendarPage: BlitzPage = () => {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [createCalendarMutation] = useMutation(createCalendar)

  const onSubmit = async (data: CalendarFormData) => {
    try {
      if (!selectedId) {
        return
      }

      const calendar = await createCalendarMutation({ data: { ...data, uuid: selectedId } })
      router.push("/calendars/[calendarId]", `/calendars/${calendar.id}`)
    } catch (error) {
      alert("Error creating calendar " + JSON.stringify(error, null, 2))
    }
  }

  const select = (id: string | undefined | null) => {
    return () => {
      id && setSelectedId((curr) => (curr === id ? null : id))
    }
  }

  return (
    <div>
      <Head>
        <title>New Calendar</title>
      </Head>

      <Heading>Create New Calendar</Heading>

      <Link href="/calendars">Calendars</Link>

      <CalendarForm onSubmit={onSubmit} disabled={!selectedId}>
        <Suspense fallback={<Spinner />}>
          <ListGcal selectedId={selectedId} select={select} />
        </Suspense>
      </CalendarForm>
    </div>
  )
}

NewCalendarPage.getLayout = (page) => <Layout title={"Create New Calendar"}>{page}</Layout>

export default NewCalendarPage
