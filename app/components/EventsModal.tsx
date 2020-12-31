import React from "react"
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
} from "@chakra-ui/react"
import { useStore } from "app/lib/reducer"

interface EventModalProps {
  modal: UseDisclosureReturn
}

const CheckIcon: React.FC<{ value: boolean }> = ({ value }) => {
  return <i className="material-icons">{`check_box${value ? "_outline_blank" : ""}`}</i>
}

export const EventsModal: React.FC<EventModalProps> = ({ modal }) => {
  const { state } = useStore()

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
                {state.events.map((event) => (
                  <ListItem d="flex" key={event.id}>
                    <ListIcon as={() => <CheckIcon value={event.planned} />} color="green.500" />
                    {`${new Date(event.start).toDateString()} => [${event.time / 60}h]`}
                    <br />
                    {event.summary}
                  </ListItem>
                ))}
              </List>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={modal.onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        ) : (
          <ModalHeader>Error </ModalHeader>
        )}
      </ModalContent>
    </Modal>
  )
}
