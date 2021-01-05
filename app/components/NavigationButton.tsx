import React from "react"
import { useBreakpointValue, IconButton, Button } from "@chakra-ui/react"
import { useStore } from "app/lib/reducer"

interface NavigationButtonProps {
  label: string
  Icon: React.ReactElement
  action: "val++" | "val--"
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({ label, Icon, action }) => {
  const { dispatch } = useStore()
  const icon = useBreakpointValue({ base: 1, md: 0 })

  return icon ? (
    <IconButton
      colorScheme="blue"
      onClick={() => dispatch({ type: action })}
      icon={Icon}
      aria-label={label}
    />
  ) : (
    <Button colorScheme="blue" onClick={() => dispatch({ type: action })} leftIcon={Icon}>
      {label}
    </Button>
  )
}
