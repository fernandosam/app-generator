'use client'

import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

/** Based on coss UI p-form-2. Validation and submit are supplied by the caller. */
export interface FormField {
  name: string
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'number' | 'password'
  required?: boolean
}

export interface ValidatedFormProps<T> {
  fields: readonly FormField[]
  schema: z.ZodType<T>
  onSubmit: (data: T) => void | Promise<void>
  submitLabel: string
  errorMessage?: string
  className?: string
}

export function ValidatedForm<T>({
  fields,
  schema,
  onSubmit,
  submitLabel,
  errorMessage = 'Não foi possível enviar o formulário.',
  className,
}: ValidatedFormProps<T>) {
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const result = schema.safeParse(Object.fromEntries(new FormData(event.currentTarget)))
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors as Record<string, string[]>)
      setSubmitError(null)
      return
    }
    setErrors({})
    setSubmitError(null)
    setPending(true)
    try {
      await onSubmit(result.data)
    } catch {
      setSubmitError(errorMessage)
    } finally {
      setPending(false)
    }
  }

  return (
    <Form className={className ?? 'flex w-full flex-col gap-4'} errors={errors} onSubmit={(event) => void handleSubmit(event)}>
      {fields.map((field) => (
        <Field key={field.name} name={field.name}>
          <FieldLabel>{field.label}</FieldLabel>
          <Input
            name={field.name}
            type={field.type ?? 'text'}
            placeholder={field.placeholder}
            aria-required={field.required || undefined}
            disabled={pending}
          />
          <FieldError />
        </Field>
      ))}
      {submitError && <p role="alert" className="text-sm text-destructive-foreground">{submitError}</p>}
      <Button type="submit" loading={pending} disabled={pending}>{submitLabel}</Button>
    </Form>
  )
}
