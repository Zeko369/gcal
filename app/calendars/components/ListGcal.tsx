import React, { useCallback } from "react"
import { useQuery } from "blitz"
import { Heading, ListItem, UnorderedList, Text } from "@chakra-ui/react"
import getGoogleCalendars from "app/queries/getGoogleCalendars"
import getCalendars from "app/calendars/queries/getCalendars"
import { RestGoogleToken } from "app/components/RestGoogleToken"

interface ListGcalProps {
  select: (id: string | null | undefined) => () => void
  selectedId: string | null
}

export const ListGcal: React.FC<ListGcalProps> = ({ select, selectedId }) => {
  const [googleCalendars] = useQuery(getGoogleCalendars, {})
  const [dbCalendars] = useQuery(getCalendars, {})

  const notExistsFilter = useCallback(
    (googleCal) => !dbCalendars.calendars.find((dbCal) => dbCal.uuid === googleCal.id),
    [dbCalendars]
  )

  if (!googleCalendars.ok) {
    return (
      <>
        <Heading size="sm">Token probably wrong</Heading>
        <RestGoogleToken redirect="/calendars/new" />
      </>
    )
  }

  const calendars = googleCalendars.data?.data.items

  return (
    <>
      <Heading size="sm">Calendars from google: </Heading>
      <UnorderedList>
        {calendars?.filter(notExistsFilter).map((calendar) => (
          <ListItem
            key={calendar.id}
            onClick={select(calendar.id)}
            cursor="pointer"
            opacity={selectedId && selectedId !== calendar.id ? 0.7 : 1}
          >
            <Text
              fontWeight={selectedId === calendar.id ? "bold" : undefined}
              bg={calendar.backgroundColor || undefined}
              p="1"
            >
              {calendar.summary}
            </Text>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  )
}
