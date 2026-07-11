import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  CheckCircle2,
  Mail,
  Phone,
  User as UserIcon,
  Building2,
  Hash,
  FileText,
  Paperclip,
  Clock,
} from 'lucide-react'
import { EventsService } from '../../../lib/services/eventService'
import type { Event } from '../../../types/event'
import type { RegistrationInput } from '../../../types/registration'
import { RegistrationService } from '../../../lib/services/registrationService'
import { ShiftService } from '../../../lib/services/shiftService'
import { UploadService } from '../../../lib/services/uploadService'
import { SettingsService } from '../../../lib/services/settingService'
import type { ShiftCapacityResponse } from '../../../types/Shift'
interface RegisterLoaderData {
  event: Event
  paymentQrList: { url: string; alternativeText?: string | null }[]
  shiftCapacities: Record<string, ShiftCapacityResponse>
}

export const Route = createFileRoute('/events/$id/register')({
  loader: async ({ params }): Promise<RegisterLoaderData> => {
    const [event, settings] = await Promise.all([
      EventsService.getEventById(params.id),
      SettingsService.getSettings(),
    ])

    const shifts = (event as Event)?.shifts ?? []
    const capacityEntries = await Promise.all(
      shifts.map(async (shift) => [
        shift.documentId,
        await ShiftService.getShiftCapacity(shift.documentId),
      ] as const)
    )

    return {
      event: event as Event,
      paymentQrList: settings?.paymentQr ?? [],
      shiftCapacities: Object.fromEntries(capacityEntries),
    }
  },
  component: RouteComponent,
  pendingComponent: RegisterSkeleton,
  errorComponent: RegisterErrorState,
})

function isPastEvent(event: Event) {
  if (event.status_event === 'completed' || event.status_event === 'cancelled') return true
  if (!event.status_event) {
    return event.startDate ? new Date(event.startDate).getTime() < Date.now() : false
  }
  return false
}

// Formats a Strapi "time" string (HH:mm:ss.SSS) into a readable 12-hour time
function formatTime(time?: string) {
  if (!time) return null
  const [hoursStr, minutesStr] = time.split(':')
  const hours = Number(hoursStr)
  const minutes = Number(minutesStr)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// ---- File upload constraints ----
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const ALLOWED_FILE_EXT_LABEL = 'PDF, JPG, or PNG'

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File must be smaller than ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return `Only ${ALLOWED_FILE_EXT_LABEL} files are allowed.`
  }
  return null
}

// Form values as edited in the UI (phone stays a string here; we convert on submit)
type RegisterFormValues = {
  fullName: string
  email: string
  phone: string
  Institution: string
  rollNumber: string
  notes: string
  shift: string
}

const defaultValues: RegisterFormValues = {
  fullName: '',
  email: '',
  phone: '',
  Institution: '',
  rollNumber: '',
  notes: '',
  shift: '',
}

function RouteComponent() {
  const { event, paymentQrList, shiftCapacities } = Route.useLoaderData() as RegisterLoaderData
  const navigate = useNavigate()

  const resolveUrl = (url: string) =>
    url.startsWith('http') ? url : `${import.meta.env.VITE_BACKEND_URL}${url}`

  const qrImages = paymentQrList.length > 0
    ? paymentQrList.map((m) => ({ url: resolveUrl(m.url), alt: m.alternativeText || 'Payment QR code' }))
    : [{ url: '/esewa-qr.jpeg', alt: 'eSewa QR code for payment' }] // static fallback

  // Shift is now a real relation (Event.shifts), not an embedded component.
  const shifts = event.shifts ?? []

  const past = isPastEvent(event)
  

  // ---- Form state via react-hook-form (validation rules inline, no schema lib) ----
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({ defaultValues, mode: 'onBlur' })

  const selectedShift = watch('shift')

  // ---- File upload state ----
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{ id: number; url: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const uploadedForFileRef = useRef<File | null>(null) // which File object the cached result belongs to

  const [status, setStatus] = useState<'idle' | 'success'>('idle')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  // Abort in-flight requests if the user navigates away mid-submit
  const abortControllerRef = useRef<AbortController | null>(null)
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const onFileSelected = (selected: File | null) => {
    setFileError(null)
    if (!selected) {
      setFile(null)
      return
    }
    const validationError = validateFile(selected)
    if (validationError) {
      setFileError(validationError)
      setFile(null)
      return
    }
    // A different file was picked: any previously uploaded result is stale
    if (uploadedForFileRef.current !== selected) {
      setUploadedFile(null)
      uploadedForFileRef.current = null
    }
    setFile(selected)
  }

  // Uploads the selected file, skipping re-upload if we already have a result for this exact file.
  const ensureFileUploaded = async (
    signal: AbortSignal
  ): Promise<{ id: number; url: string } | null> => {
    if (!file) return null
    if (uploadedFile && uploadedForFileRef.current === file) {
      return uploadedFile // already uploaded, avoid duplicate upload on retry
    }
    setUploading(true)
    try {
      const result = await UploadService.uploadFile(file, { signal } as unknown as never)
      setUploadedFile(result)
      uploadedForFileRef.current = file
      return result
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Unknown error.'
      throw new Error(`Could not upload your file: ${detail}`)
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null)

    // Bail out early if a previously selected file failed validation
    if (fileError) {
      return
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      let uploaded: { id: number; url: string } | null = null
      try {
        uploaded = await ensureFileUploaded(controller.signal)
      } catch (uploadErr) {
        setFormError(uploadErr instanceof Error ? uploadErr.message : 'File upload failed.')
        return
      }

      const payload: RegistrationInput = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone ? Number(values.phone) : undefined,
        Institution: values.Institution,
        rollNumber: values.rollNumber,
        notes: values.notes,
        event: event.documentId,
        venue: event.venue?.documentId,
        // Links the uploaded file to the `payment` media relation field on the
        // Registration content type in Strapi.
        ...(uploaded ? { payment: uploaded.id } : {}),
        // documentId of the selected Shift (Shift is now a proper relation on Registration).
        ...(shifts.length > 0 && values.shift ? { shift: values.shift } : {}),
      }

      await RegistrationService.registerForEvent(event.documentId, payload, {
        signal: controller.signal,
      } as unknown as never)

      setSubmittedEmail(values.email)
      setStatus('success')
    } catch (err) {
      if (controller.signal.aborted) return

      const message = err instanceof Error ? err.message : 'Something went wrong.'

      // Surface capacity-specific errors distinctly, since availability can change
      // between page load and submit.
      if (/full|capacity|sold out/i.test(message)) {
        setFormError('This event just reached capacity. Please check back or contact the organizers.')
      } else if (/email/i.test(message)) {
        setError('email', { message })
      } else {
        setFormError(message)
      }
    }
  }

  const formattedDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const formattedTime = event.startDate
    ? new Date(event.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null

  if (past) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">This event has ended</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Registration for {event.title} is no longer open.
        </p>
        <Link
          to="/events/archive"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 mt-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Past Events
        </Link>
      </div>
    )
  }

 

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
        <h1 className="text-xl font-bold text-foreground mt-4">You're registered!</h1>
        <p className="text-sm text-muted-foreground mt-2">
          A confirmation for {event.title} will be sent to {submittedEmail}.
        </p>
        <Link
          to="/events/$id"
          params={{ id: event.documentId }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 mt-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Event
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/events/$id"
        params={{ id: event.documentId }}
        onClick={(e) => {
          e.preventDefault()
          navigate({ to: '/events/$id', params: { id: event.documentId } })
        }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Event
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold text-foreground">Register</h1>
        <p className="text-sm text-muted-foreground mt-1">{event.title}</p>

        <div className="space-y-3 text-sm mt-4 pb-5 border-b border-border">
          {formattedDate && (
            <div className="flex items-start gap-3">
              <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <p className="text-foreground">
                {formattedDate}
                {formattedTime ? ` · ${formattedTime}` : ''}
              </p>
            </div>
          )}
          {event.venue?.name && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <p className="text-foreground">{event.venue.name}</p>
            </div>
          )}
          
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shifts.length > 0 && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Select Shift <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {shifts.map((shift) => {
  const shiftValue = shift.documentId
  const start = formatTime(shift.startTime)
  const end = formatTime(shift.endTime)
  const isSelected = selectedShift === shiftValue
  const shiftCap = shiftCapacities[shift.documentId]
  const shiftSpotsLeft = shiftCap?.spotsLeft ?? null
  const shiftFull = shiftCap?.isFull ?? false
  return (
    <label
      key={shiftValue}
      htmlFor={`shift-${shiftValue}`}
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
        shiftFull
          ? 'border-border bg-muted/20 opacity-60 cursor-not-allowed'
          : isSelected
          ? 'border-primary bg-primary/5 cursor-pointer'
          : 'border-border bg-background hover:bg-muted/40 cursor-pointer'
      }`}
    >
      <input
        id={`shift-${shiftValue}`}
        type="radio"
        value={shiftValue}
        disabled={shiftFull}
        className="mt-1 accent-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-invalid={!!errors.shift}
        aria-describedby={errors.shift ? 'shift-error' : undefined}
        {...register('shift', {
          required: 'Please select a shift.',
        })}
      />
      <div className="flex-1 text-sm">
        <p className="text-foreground font-medium">
          {shift.label || 'Shift'}
        </p>
        {(start || end) && (
          <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="h-3 w-3 flex-shrink-0" />
            {start}
            {start && end && ' – '}
            {end}
          </p>
        )}
        {shiftSpotsLeft !== null && (
          <p
            className={`flex items-center gap-1 mt-0.5 ${
              shiftFull ? 'text-destructive font-medium' : 'text-muted-foreground'
            }`}
          >
            <Users className="h-3 w-3 flex-shrink-0" />
            {shiftFull ? 'Full' : `${shiftSpotsLeft} spots left`}
          </p>
        )}
      </div>
    </label>
  )
})}
                </div>
                {errors.shift && (
                  <p id="shift-error" role="alert" className="text-xs text-destructive mt-1">
                    {errors.shift.message}
                  </p>
                )}
              </div>
            )}

            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="fullName"
                  placeholder="Your full name"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('fullName', {
                    required: 'Please enter your full name.',
                    minLength: { value: 2, message: 'Name looks too short.' },
                    maxLength: { value: 100, message: 'Name is too long.' },
                  })}
                />
              </div>
              {errors.fullName && (
                <p id="fullName-error" className="text-xs text-destructive mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('email', {
                    required: 'Please enter your email.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address.',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="98XXXXXXXX"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('phone', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, '')
                    },
                    pattern: {
                      value: /^\d{7,10}$/,
                      message: 'Enter a valid phone number (7-10 digits).',
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="text-xs text-destructive mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="Institution" className="block text-sm font-medium text-foreground mb-1.5">
                Institution
              </label>
              <div className="relative">
                <Building2 className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="Institution"
                  placeholder="Pulchowk Campus, IOE"
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('Institution', { maxLength: { value: 150, message: 'Too long.' } })}
                />
              </div>
              {errors.Institution && (
                <p className="text-xs text-destructive mt-1">{errors.Institution.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-foreground mb-1.5">
                Roll Number
              </label>
              <div className="relative">
                <Hash className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="rollNumber"
                  placeholder="078BEX000"
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('rollNumber', { maxLength: { value: 30, message: 'Too long.' } })}
                />
              </div>
              {errors.rollNumber && (
                <p className="text-xs text-destructive mt-1">{errors.rollNumber.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1.5">
                Notes (optional)
              </label>
              <div className="relative">
                <FileText className="h-4 w-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Dietary restrictions, accessibility needs, questions..."
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  {...register('notes', { maxLength: { value: 1000, message: 'Notes are too long (max 1000 characters).' } })}
                />
              </div>
              {errors.notes && <p className="text-xs text-destructive mt-1">{errors.notes.message}</p>}
            </div>
          </div>

          {(event.fee ?? 0) > 0 && (
            <div className="sm:col-span-2 mt-4">
              <label
                htmlFor="payment"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Payment Receipt <span className="text-red-500">*</span>
              </label>

              <p className="text-xs text-muted-foreground mb-2">
                Event Fee: <strong>Rs. {event.fee}</strong>
              </p>

              <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 mb-3">
                <div className="flex flex-wrap justify-center gap-3">
                  {qrImages.map((qr, i) => (
                    <img
                      key={i}
                      src={qr.url}
                      alt={qr.alt}
                      className="h-40 w-40 rounded-md border border-border object-contain bg-white"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Scan any QR above with your payment app, then upload your receipt below.
                </p>
              </div>

              <div className="relative">
                <Paperclip className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="payment"
                  type="file"
                  accept={ALLOWED_FILE_TYPES.join(',')}
                  aria-describedby="payment-hint"
                  onChange={(e) => onFileSelected(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
                />
              </div>

              <p id="payment-hint" className="text-xs text-muted-foreground mt-1">
                Upload your payment receipt ({ALLOWED_FILE_EXT_LABEL}, up to{" "}
                {MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB).
              </p>

              {file && !fileError && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {file.name}
                </p>
              )}

              {fileError && (
                <p className="text-xs text-destructive mt-1">{fileError}</p>
              )}

              {uploading && (
                <p className="text-xs text-blue-500 mt-1">Uploading...</p>
              )}

              {uploadedFile && !uploading && (
                <a
                  href={uploadedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline mt-1 inline-block"
                >
                  View uploaded file
                </a>
              )}
            </div>
          )}

          {formError && (
            <p role="alert" className="text-sm text-destructive mt-4">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || uploading || !!fileError}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Registration'}
          </button>
        </form>
      </div>
    </div>
  )
}

function RegisterSkeleton() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-24 bg-muted rounded-sm mb-6" />
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="h-6 w-32 bg-muted rounded-md" />
        <div className="h-4 w-48 bg-muted rounded-sm" />
        <div className="h-16 bg-muted rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 col-span-2 bg-muted rounded-lg" />
          <div className="h-10 bg-muted rounded-lg" />
          <div className="h-10 bg-muted rounded-lg" />
          <div className="h-10 bg-muted rounded-lg" />
          <div className="h-10 bg-muted rounded-lg" />
          <div className="h-20 col-span-2 bg-muted rounded-lg" />
        </div>
        <div className="h-10 w-full bg-muted rounded-lg" />
      </div>
    </div>
  )
}

function RegisterErrorState({ error }: { error: Error }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-5 border rounded-lg max-w-2xl mx-auto bg-destructive/10 border-destructive/30 shadow-sm">
        <h3 className="font-bold text-xl text-destructive tracking-tight">
          Could not load this event
        </h3>
        <p className="text-sm mt-1 text-foreground/80">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <Link
          to="/events"
          className="inline-block mt-4 text-sm font-medium text-primary hover:text-primary/80 underline"
        >
          Back to Events
        </Link>
      </div>
    </div>
  )
}