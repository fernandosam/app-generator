import { createFileRoute } from '@tanstack/react-router'
import { RegistrationScreen } from '@/components/registration-screen'

export const Route = createFileRoute('/')({
  component: RegistrationScreen,
})
