'use client'

import { toastManager } from '@/components/ui/toast'

/** Based on coss UI p-toast-2. Mount ToastProvider once at the application root. */
export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface NotificationOptions {
  type: NotificationType
  title: string
  description?: string
}

export function notify({ type, title, description }: NotificationOptions): void {
  toastManager.add({ type, title, description })
}
