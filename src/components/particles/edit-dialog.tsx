'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'

/** Based on coss UI p-dialog-1. Caller provides fields and a real submit action. */
export interface EditDialogProps {
  triggerLabel: string
  title: string
  description: string
  children: ReactNode
  onSubmit: (data: FormData) => void | Promise<void>
  submitLabel?: string
  cancelLabel?: string
  errorMessage?: string
}

export function EditDialog({
  triggerLabel,
  title,
  description,
  children,
  onSubmit,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  errorMessage = 'Não foi possível salvar as alterações.',
}: EditDialogProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const values = new FormData(event.currentTarget)
    setError(null)
    setPending(true)
    try {
      await onSubmit(values)
      setOpen(false)
    } catch {
      setError(errorMessage)
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!pending) { setOpen(next); if (!next) setError(null) } }}>
      <DialogTrigger render={<Button variant="outline" />}>{triggerLabel}</DialogTrigger>
      <DialogPopup className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form className="contents" onSubmit={(event) => void handleSubmit(event)}>
          <DialogPanel className="grid gap-4">{children}</DialogPanel>
          <DialogFooter>
            {error && <p role="alert" className="text-sm text-destructive-foreground">{error}</p>}
            <DialogClose disabled={pending} render={<Button variant="ghost" />}>{cancelLabel}</DialogClose>
            <Button type="submit" loading={pending} disabled={pending}>{submitLabel}</Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  )
}
