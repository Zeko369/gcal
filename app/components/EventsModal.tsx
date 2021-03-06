import React, { useEffect, useState } from "react"
import {
  UseDisclosureReturn,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalFooter,
  List,
  ListItem,
  ListIcon,
  Button,
  HStack,
  useBoolean,
} from "@chakra-ui/react"
import { useStore, Store } from "app/lib/reducer"

interface EventModalProps {
  modal: UseDisclosureReturn
}

const CheckIcon: React.FC<{ value: boolean }> = ({ value }) => {
  return <i className="material-icons">{`check_box${value ? "_outline_blank" : ""}`}</i>
}

export const EventsModal: React.FC<EventModalProps> = ({ modal }) => {
  const [combine, { toggle, off }] = useBoolean(false)
  const { state } = useStore()

  // config for this
  useEffect(off, [modal.isOpen, off])

  const events = combine
    ? state.events.reduce((data, curr) => {
        const foundIndex = data.findIndex(
          (event) => event.summary?.toUpperCase() === curr.summary?.toUpperCase()
        )
        if (foundIndex !== -1) {
          return data.map((event, index) =>
            index === foundIndex ? { ...event, time: event.time + curr.time } : event
          )
        }

        return [...data, curr]
      }, [] as Store["state"]["events"])
    : state.events

  return (
    <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
      <ModalOverlay />
      <ModalContent>
        {state.calendar ? (
          <>
            <ModalHeader>{state.calendar.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <List spacing={2}>
                {events.map((event) => (
                  <ListItem d="flex" key={event.id}>
                    <ListIcon as={() => <CheckIcon value={event.planned} />} color="green.500" />
                    {`${new Date(event.start).toDateString()} => [${event.time / 60}h]`}
                    <br />
                    {event.summary || "[NO_NAME]"}
                  </ListItem>
                ))}
              </List>
            </ModalBody>

            <ModalFooter>
              <HStack>
                <Button onClick={toggle}>{combine ? "Each event" : "Combine"}</Button>
                <Button colorScheme="blue" mr={3} onClick={modal.onClose}>
                  Close
                </Button>
              </HStack>
            </ModalFooter>
          </>
        ) : (
          <ModalHeader>Error </ModalHeader>
        )}
      </ModalContent>
    </Modal>
  )
}
