import { createFileRoute } from '@tanstack/react-router'
import { DashboardScreen } from '@/components/dashboard-screen'

export const Route = createFileRoute('/dashboard')({ component: DashboardScreen })
