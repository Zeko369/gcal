import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/core"
import React, { useState, useRef } from "react"

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)

  return { isOpen, open, close }
}

type UseConfirmOutput = ReturnType<typeof useConfirm>

interface ConfirmProps extends UseConfirmOutput {
  cancelRef?: React.RefObject<HTMLButtonElement>
  text: {
    title: string
    body?: string
  }
  primaryButton?: {
    text: string
    color?: string
  }
  onConfirm: () => void
}

export const Confirm: React.FC<ConfirmProps> = (props) => {
  const ref = useRef<HTMLButtonElement>(null)

  const { isOpen, close, text, children, onConfirm } = props
  let { cancelRef } = props

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
                onConfirm()
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
