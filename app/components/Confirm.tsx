import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react"
import React, { useState, useRef } from "react"

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)

  return { isOpen, open, close }
}

type UseConfirmOutput = ReturnType<typeof useConfirm>

interface ConfirmProps {
  confirmProps: UseConfirmOutput
  cancelRef?: React.RefObject<HTMLButtonElement>
  text: {
    title: string
    body?: string
  }
  primaryButton?: {
    text: string
    color?: string
  }
  onConfirm?: () => void
}

export const Confirm: React.FC<ConfirmProps> = (props) => {
  const {
    text,
    children,
    onConfirm,
    confirmProps: { isOpen, close },
  } = props
  let { cancelRef } = props

  const ref = useRef<HTMLButtonElement>(null)

  if (!cancelRef) {
    cancelRef = ref
  }

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={close}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {text.title}
          </AlertDialogHeader>

          <AlertDialogBody>{text.body || children}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={close}>
              Cancel
            </Button>
            <Button
              colorScheme={props.primaryButton?.color || "red"}
              onClick={() => {
                close()
                onConfirm && onConfirm()
              }}
              ml={3}
            >
              {props.primaryButton?.text || "Yes"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
