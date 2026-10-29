import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export interface EmptyStateAction {
  label: string
  onClick: () => void
}

/** Based on coss UI p-empty-1. Descriptions and actions are caller-provided. */
export interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
}

export function EmptyState({ title, description, icon, action, secondaryAction }: EmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {(action || secondaryAction) && (
        <EmptyContent>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {action && <Button size="sm" onClick={action.onClick}>{action.label}</Button>}
            {secondaryAction && <Button size="sm" variant="outline" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
          </div>
        </EmptyContent>
      )}
    </Empty>
  )
}
