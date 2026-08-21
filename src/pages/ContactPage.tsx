import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { SkipToContent, Main } from '../components/PageShell'
import { pageSeo, breadcrumbTrails } from '../data/seo'
import { business } from '../data/site'

/**
 * Practical detail for anyone about to book. This is the page's only body copy
 * besides the form itself, which otherwise leaves it far thinner than every
 * other indexable page on the site.
 */
const bookingNotes = [
  {
    title: 'Bring your ownership and VIN',
    body: 'Your vehicle registration and VIN let us pull the exact service schedule and parts catalogue for your model year, so the estimate reflects your car and not a generic average.',
  },
  {
    title: 'Describe the symptom, not the fix',
    body: 'Tell us what you hear, feel, or smell and when it happens. Noise on cold starts and noise under braking point at completely different systems, and the detail saves diagnostic time you would otherwise pay for.',
  },
  {
    title: 'Nothing is approved until you approve it',
    body: 'We inspect first, then send a written estimate covering parts, labour, and timeline. No work begins and no charge is incurred until you say yes to that quote.',
  },
  {
    title: 'Booking a slot, not a completion time',
    body: 'The time you choose is your drop off. We confirm a realistic pickup window once a technician has seen the vehicle, and we call you rather than making you chase us for updates.',
  },
]

const serviceOptions = [
  { id: 'oil-change', label: 'Oil Change' },
  { id: 'tire-service', label: 'Tire Service' },
  { id: 'brake-service', label: 'Brake Service' },
  { id: 'diagnostics', label: 'Diagnostics' },
  { id: 'engine-repair', label: 'Engine Repair' },
  { id: 'other', label: 'Other' },
]

const bookingSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your full name').max(100),
  phone: z.string().trim().min(7, 'Enter a valid phone number').max(30),
  email: z.string().trim().email('Enter a valid email').max(255).optional().or(z.literal('')),
  vehicleYear: z.string().trim().regex(/^\d{4}$/, 'Enter a 4 digit year'),
  vehicleMake: z.string().trim().min(1, 'Enter the make').max(50),
  vehicleModel: z.string().trim().min(1, 'Enter the model').max(50),
  licensePlate: z.string().trim().max(15).optional().or(z.literal('')),
  service: z.string().min(1, 'Choose a service'),
  otherService: z.string().trim().max(120).optional().or(z.literal('')),
  date: z.string().min(1, 'Choose a drop off date'),
  time: z.string().min(1, 'Choose a time slot'),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
})

type BookingForm = Partial<z.infer<typeof bookingSchema>>
type Booking = z.infer<typeof bookingSchema>
type FieldErrors = Record<string, string>
type BookedSlots = Record<string, string[]>

const STORAGE_KEY = 'sultan_motors_bookings_v1'

function loadBookings(): BookedSlots {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveBooking(date: string, time: string) {
  const bookings = loadBookings()
  bookings[date] = [...(bookings[date] || []), time]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
}

function slotsForDate(date: Date): string[] {
  const day = date.getDay()
  if (day === 0) return []
  const close = day === 6 ? 15 : 18
  const open = day === 6 ? 9 : 8
  const slots: string[] = []
  for (let hour = open; hour < close; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return slots
}

function formatTime(value: string): string {
  const [hour, minute] = value.split(':').map(Number)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  return `${hour % 12 === 0 ? 12 : hour % 12}:${minute.toString().padStart(2, '0')} ${suffix}`
}

function formatDate(value: string): string {
  return new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`
}

export default function ContactPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<BookingForm>({})
  const [errors, setErrors] = useState<FieldErrors>({})
  const [confirmed, setConfirmed] = useState<Booking | null>(null)
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [booked, setBooked] = useState<BookedSlots>({})

  useEffect(() => {
    setBooked(loadBookings())
  }, [])

  const setField = (field: keyof Booking, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev
      return rest
    })
  }

  const validateStep = (current: number) => {
    const next: FieldErrors = {}
    if (current === 1) {
      if (!form.service) next.service = 'Choose a service'
      if (form.service === 'other' && !form.otherService?.trim())
        next.otherService = 'Describe the service'
      if (!form.vehicleYear || !/^\d{4}$/.test(form.vehicleYear))
        next.vehicleYear = 'Enter a 4 digit year'
      if (!form.vehicleMake?.trim()) next.vehicleMake = 'Enter the make'
      if (!form.vehicleModel?.trim()) next.vehicleModel = 'Enter the model'
    }
    if (current === 2) {
      if (!form.date) next.date = 'Choose a date'
      if (!form.time) next.time = 'Choose a time'
    }
    if (current === 3) {
      if (!form.name?.trim()) next.name = 'Enter your name'
      if (!form.phone || form.phone.length < 7) next.phone = 'Enter a valid phone'
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        next.email = 'Enter a valid email'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (validateStep(step)) setStep((s) => (s < 5 ? s + 1 : s))
  }
  const goBack = () => setStep((s) => (s > 1 ? s - 1 : s))

  const submit = () => {
    const result = bookingSchema.safeParse(form)
    if (!result.success) {
      const next: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message
      })
      setErrors(next)
      return
    }
    saveBooking(result.data.date, result.data.time)
    setBooked(loadBookings())
    setConfirmed(result.data)
    setStep(5)
  }

  const reset = () => {
    setForm({})
    setErrors({})
    setConfirmed(null)
    setStep(1)
  }

  const inputCls =
    'w-full rounded-xl border border-white/15 bg-black px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#e6ff3d] focus:ring-2 focus:ring-[#e6ff3d]/30'
  const labelCls = 'mb-2 block text-[11px] font-bold tracking-[0.2em] text-[#e6ff3d]'

  return (
    <div className="min-h-screen bg-black font-sans">
      <Seo {...pageSeo['contact']} />
      <SkipToContent />
      <Main>
      <SiteNavbar theme="dark" />
      <section className="bg-black px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs trail={breadcrumbTrails['contact']} theme="dark" className="mb-6" />
          <h1 className="max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl">
            BOOK AN AUTO REPAIR APPOINTMENT IN BRAMPTON
          </h1>
          <p className="mt-6 mb-10 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base md:mb-14">
            Choose the service you need, pick a drop off date and time, and
            reserve a bay at Sultan Motors, {business.streetAddress},{' '}
            {business.addressLocality}. Prefer to talk it through? Call{' '}
            <a
              href={`tel:${business.phoneRaw}`}
              className="font-semibold text-[#e6ff3d] underline-offset-4 hover:underline"
            >
              {business.phoneDisplay}
            </a>{' '}
            during shop hours.
          </p>
          <div className="mb-10 flex flex-wrap items-center gap-2 sm:gap-3">
            {['Service', 'Date & Time', 'Details', 'Review', 'Confirmed'].map((label, i) => {
              const num = i + 1
              const current = step === num
              const done = step > num
              return (
                <div key={label} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold transition sm:h-9 sm:w-9 ${
                      done
                        ? 'border-[#e6ff3d] bg-[#e6ff3d] text-black'
                        : current
                          ? 'border-[#e6ff3d] bg-black text-[#e6ff3d]'
                          : 'border-white/20 bg-black text-white/40'
                    }`}
                  >
                    {done ? '✓' : num}
                  </div>
                  <span
                    className={`hidden text-[11px] font-bold tracking-[0.2em] sm:inline ${
                      current ? 'text-white' : done ? 'text-white/70' : 'text-white/40'
                    }`}
                  >
                    {label.toUpperCase()}
                  </span>
                  {i < 4 && <span className="hidden h-px w-8 bg-white/10 sm:inline-block md:w-12" />}
                </div>
              )
            })}
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#111214] shadow-[0_0_60px_-15px_rgba(230,255,61,0.15)] sm:p-8 md:p-10">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-[#e6ff3d]" />
            {/*
              A real <form>, so the controls are grouped for assistive tech,
              autofill can populate name/phone/email, and Enter advances the
              wizard instead of doing nothing. Every button that is not the
              final submit needs an explicit type="button" — inside a form the
              default type is "submit".
            */}
            <form
              className="p-6 sm:p-0"
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                if (step < 4) goNext()
                else submit()
              }}
            >
              <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6ff3d] text-black">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-bold tracking-[0.2em] text-[#e6ff3d]">
                    BOOKING FORM
                  </div>
                  <div className="text-sm font-semibold text-white/70">
                    Complete all steps to reserve your bay
                  </div>
                </div>
              </div>
              {step === 1 && (
                <StepService form={form} setField={setField} errors={errors} inputCls={inputCls} labelCls={labelCls} />
              )}
              {step === 2 && (
                <StepDateTime
                  form={form}
                  setField={setField}
                  errors={errors}
                  calMonth={calMonth}
                  setCalMonth={setCalMonth}
                  booked={booked}
                />
              )}
              {step === 3 && (
                <StepDetails form={form} setField={setField} errors={errors} inputCls={inputCls} labelCls={labelCls} />
              )}
              {step === 4 && <StepReview form={form} />}
              {step === 5 && confirmed && <StepConfirmed booking={confirmed} onReset={reset} />}
              {step < 5 && (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 1}
                    className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#e6ff3d] px-8 py-3 text-sm font-bold text-black transition hover:bg-white"
                  >
                    {step < 4 ? 'Continue' : 'Book Appointment'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
      <section className="bg-black px-4 pb-16 sm:px-6 sm:pb-20 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-5 md:mb-6">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#e6ff3d] sm:text-[11px]">
              BEFORE YOU DROP OFF
            </span>
          </div>
          <h2 className="mb-8 text-2xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-3xl md:text-4xl">
            WHAT TO EXPECT WHEN YOU BOOK WITH SULTAN MOTORS.
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {bookingNotes.map((note, i) => (
              <div
                key={note.title}
                className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-7"
              >
                <div className="text-[11px] font-bold tracking-[0.2em] text-white/40">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-3 text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  {note.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{note.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-black px-4 pb-20 sm:px-6 sm:pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 md:mb-6">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#e6ff3d] sm:text-[11px]">
              FIND US IN BRAMPTON
            </span>
          </div>
          <h2 className="mb-8 text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            VISIT SULTAN MOTORS IN BRAMPTON.
          </h2>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-white/10 sm:rounded-3xl">
              <iframe
                title="Sultan Motors location map"
                src="https://maps.google.com/maps?q=5%20Melanie%20Dr%20Unit%202%20Brampton%20ON%20L6T%204K8&t=&z=15&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                className="h-[320px] w-full sm:h-[440px] md:h-[560px]"
                style={{ border: 0 }}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8">
                <h3 className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[#e6ff3d]">
                  CALL
                </h3>
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="block text-2xl font-extrabold text-white hover:text-[#e6ff3d]"
                >
                  {business.phoneDisplay}
                </a>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8">
                <h3 className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[#e6ff3d]">
                  VISIT
                </h3>
                <address className="not-italic">
                  <p className="text-lg font-extrabold text-white">
                    {business.streetAddress}
                  </p>
                  <p className="text-lg font-extrabold text-white">
                    {business.addressLocality}, {business.addressRegion}{' '}
                    {business.postalCode}
                  </p>
                </address>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8">
                <h3 className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[#e6ff3d]">
                  HOURS
                </h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-white">
                    <span>Mon to Fri</span>
                    <span className="font-semibold">8am to 6pm</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Saturday</span>
                    <span className="font-semibold">9am to 3pm</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </Main>
      <SiteFooter />
    </div>
  )
}

interface StepFieldProps {
  form: BookingForm
  setField: (field: keyof Booking, value: string) => void
  errors: FieldErrors
  inputCls: string
  labelCls: string
}

interface TextFieldProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  inputCls: string
  labelCls: string
  error?: string
  placeholder?: string
  type?: string
  autoComplete?: string
  inputMode?: 'numeric' | 'text' | 'tel' | 'email'
  maxLength?: number
  rows?: number
  optional?: boolean
}

/**
 * A labelled form control.
 *
 * The label is tied to the control with htmlFor/id, and the error message is
 * tied to it with aria-describedby. Without that pairing a screen reader
 * announces these inputs as unlabelled — the placeholder is not a label, and it
 * disappears as soon as the user types.
 */
function TextField({
  id,
  name,
  label,
  value,
  onChange,
  inputCls,
  labelCls,
  error,
  placeholder,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength,
  rows,
  optional,
}: TextFieldProps) {
  const errorId = `${id}-error`
  const shared = {
    id,
    name,
    value,
    placeholder,
    autoComplete,
    maxLength,
    className: inputCls,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? errorId : undefined,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(e.target.value),
  }

  return (
    <div>
      <label className={labelCls} htmlFor={id}>
        {label}
        {optional && <span className="ml-1 font-normal text-white/40">(optional)</span>}
      </label>
      {rows ? (
        <textarea {...shared} rows={rows} />
      ) : (
        <input {...shared} type={type} inputMode={inputMode} />
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

function StepService({ form, setField, errors, inputCls, labelCls }: StepFieldProps) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <span className="text-[11px] font-bold tracking-[0.25em] text-white/60">STEP 1</span>
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#e6ff3d]">
          SERVICE &amp; VEHICLE
        </span>
      </div>
      <div className={labelCls}>SELECT A SERVICE</div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {serviceOptions.map((option) => {
          const selected = form.service === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setField('service', option.id)}
              className={`group rounded-2xl border p-4 text-left transition ${
                selected
                  ? 'border-[#e6ff3d] bg-[#e6ff3d]/10'
                  : 'border-white/15 bg-black hover:border-white/40'
              }`}
            >
              <div
                className={`text-[11px] font-bold tracking-[0.2em] ${
                  selected ? 'text-[#e6ff3d]' : 'text-white/40'
                }`}
              >
                {selected ? 'SELECTED' : 'SERVICE'}
              </div>
              <div className="mt-2 text-base font-extrabold text-white">{option.label}</div>
            </button>
          )
        })}
      </div>
      {errors.service && <p className="mt-2 text-xs text-red-400">{errors.service}</p>}
      {form.service === 'other' && (
        <div className="mt-6">
          <TextField
            id="other-service"
            name="otherService"
            label="DESCRIBE THE SERVICE"
            placeholder="What do you need help with?"
            value={form.otherService || ''}
            onChange={(v) => setField('otherService', v)}
            error={errors.otherService}
            inputCls={inputCls}
            labelCls={labelCls}
          />
        </div>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <TextField
          id="vehicle-year"
          name="vehicleYear"
          label="YEAR"
          placeholder="2020"
          inputMode="numeric"
          maxLength={4}
          value={form.vehicleYear || ''}
          onChange={(v) => setField('vehicleYear', v.replace(/\D/g, ''))}
          error={errors.vehicleYear}
          inputCls={inputCls}
          labelCls={labelCls}
        />
        <TextField
          id="vehicle-make"
          name="vehicleMake"
          label="MAKE"
          placeholder="Toyota"
          value={form.vehicleMake || ''}
          onChange={(v) => setField('vehicleMake', v)}
          error={errors.vehicleMake}
          inputCls={inputCls}
          labelCls={labelCls}
        />
        <TextField
          id="vehicle-model"
          name="vehicleModel"
          label="MODEL"
          placeholder="Camry"
          value={form.vehicleModel || ''}
          onChange={(v) => setField('vehicleModel', v)}
          error={errors.vehicleModel}
          inputCls={inputCls}
          labelCls={labelCls}
        />
      </div>
      <div className="mt-4">
        <TextField
          id="license-plate"
          name="licensePlate"
          label="LICENSE PLATE"
          optional
          placeholder="ABCD 123"
          value={form.licensePlate || ''}
          onChange={(v) => setField('licensePlate', v.toUpperCase())}
          inputCls={inputCls}
          labelCls={labelCls}
        />
      </div>
    </div>
  )
}

interface StepDateTimeProps {
  form: BookingForm
  setField: (field: keyof Booking, value: string) => void
  errors: FieldErrors
  calMonth: Date
  setCalMonth: (date: Date) => void
  booked: BookedSlots
}

function StepDateTime({ form, setField, errors, calMonth, setCalMonth, booked }: StepDateTimeProps) {
  const today = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }, [])
  const monthLabel = calMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstOfMonth = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1)
  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate()
  const leadingBlanks = firstOfMonth.getDay()
  const cells: (Date | null)[] = []
  for (let i = 0; i < leadingBlanks; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++)
    cells.push(new Date(calMonth.getFullYear(), calMonth.getMonth(), day))

  const selectedDate = form.date ? new Date(form.date + 'T00:00:00') : null
  const slots = selectedDate ? slotsForDate(selectedDate) : []
  const bookedTimes = (form.date && booked[form.date]) || []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <span className="text-[11px] font-bold tracking-[0.25em] text-white/60">STEP 2</span>
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#e6ff3d]">
          DROP OFF DATE &amp; TIME
        </span>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const prev = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1)
                if (
                  prev.getFullYear() < today.getFullYear() ||
                  (prev.getFullYear() === today.getFullYear() && prev.getMonth() < today.getMonth())
                )
                  return
                setCalMonth(prev)
              }}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-white transition hover:border-[#e6ff3d] hover:text-[#e6ff3d]"
            >
              ← Prev
            </button>
            <div className="text-sm font-extrabold uppercase tracking-[0.2em] text-white">
              {monthLabel}
            </div>
            <button
              type="button"
              onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-white transition hover:border-[#e6ff3d] hover:text-[#e6ff3d]"
            >
              Next →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold tracking-[0.15em] text-white/40">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={i} className="aspect-square" />
              const key = toDateKey(date)
              const past = date < today
              const sunday = date.getDay() === 0
              const disabled = past || sunday
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setField('date', key)
                    setField('time', '')
                  }}
                  className={`aspect-square rounded-lg text-sm font-semibold transition ${
                    form.date === key
                      ? 'bg-[#e6ff3d] text-black'
                      : disabled
                        ? 'cursor-not-allowed text-white/20'
                        : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
          {errors.date && <p className="mt-2 text-xs text-red-400">{errors.date}</p>}
          <p className="mt-4 text-[11px] text-white/40">
            Closed on Sundays. Past dates are unavailable.
          </p>
        </div>
        <div>
          <div className="mb-4 text-[11px] font-bold tracking-[0.25em] text-[#e6ff3d]">
            {form.date ? 'AVAILABLE TIMES' : 'PICK A DATE FIRST'}
          </div>
          {!form.date && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/40 p-8 text-center text-sm text-white/40">
              Select a date to see available drop off times.
            </div>
          )}
          {form.date && slots.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/40 p-8 text-center text-sm text-white/40">
              This day is closed. Choose another date.
            </div>
          )}
          {form.date && slots.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const taken = bookedTimes.includes(slot)
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={taken}
                    onClick={() => setField('time', slot)}
                    className={`rounded-xl border px-2 py-3 text-xs font-bold transition ${
                      form.time === slot
                        ? 'border-[#e6ff3d] bg-[#e6ff3d] text-black'
                        : taken
                          ? 'cursor-not-allowed border-white/5 bg-black text-white/20 line-through'
                          : 'border-white/15 bg-black text-white hover:border-[#e6ff3d] hover:text-[#e6ff3d]'
                    }`}
                  >
                    {formatTime(slot)}
                  </button>
                )
              })}
            </div>
          )}
          {errors.time && <p className="mt-2 text-xs text-red-400">{errors.time}</p>}
        </div>
      </div>
    </div>
  )
}

function StepDetails({ form, setField, errors, inputCls, labelCls }: StepFieldProps) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <span className="text-[11px] font-bold tracking-[0.25em] text-white/60">STEP 3</span>
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#e6ff3d]">YOUR DETAILS</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="customer-name"
          name="name"
          label="FULL NAME"
          autoComplete="name"
          placeholder="Your full name"
          value={form.name || ''}
          onChange={(v) => setField('name', v)}
          error={errors.name}
          inputCls={inputCls}
          labelCls={labelCls}
        />
        <TextField
          id="customer-phone"
          name="phone"
          label="PHONE"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(905) 555 0100"
          value={form.phone || ''}
          onChange={(v) => setField('phone', v)}
          error={errors.phone}
          inputCls={inputCls}
          labelCls={labelCls}
        />
        <div className="sm:col-span-2">
          <TextField
            id="customer-email"
            name="email"
            label="EMAIL"
            optional
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email || ''}
            onChange={(v) => setField('email', v)}
            error={errors.email}
            inputCls={inputCls}
            labelCls={labelCls}
          />
        </div>
        <div className="sm:col-span-2">
          <TextField
            id="customer-notes"
            name="notes"
            label="ADDITIONAL NOTES"
            optional
            rows={5}
            maxLength={1000}
            placeholder="Describe the issue, symptoms, or anything we should know"
            value={form.notes || ''}
            onChange={(v) => setField('notes', v)}
            inputCls={inputCls}
            labelCls={labelCls}
          />
        </div>
      </div>
    </div>
  )
}

function StepReview({ form }: { form: BookingForm }) {
  const serviceLabel =
    form.service === 'other'
      ? `Other: ${form.otherService}`
      : serviceOptions.find((option) => option.id === form.service)?.label || form.service
  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <span className="text-[11px] font-bold tracking-[0.25em] text-white/60">STEP 4</span>
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#e6ff3d]">REVIEW</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ReviewItem label="Service" value={serviceLabel} />
        <ReviewItem
          label="Vehicle"
          value={`${form.vehicleYear || ''} ${form.vehicleMake || ''} ${form.vehicleModel || ''}`.trim()}
        />
        <ReviewItem label="License Plate" value={form.licensePlate || 'Not provided'} />
        <ReviewItem
          label="Drop Off"
          value={`${form.date ? formatDate(form.date) : ''} at ${form.time ? formatTime(form.time) : ''}`}
        />
        <ReviewItem label="Name" value={form.name || ''} />
        <ReviewItem label="Phone" value={form.phone || ''} />
        <ReviewItem label="Email" value={form.email || 'Not provided'} />
        <ReviewItem label="Notes" value={form.notes || 'None'} full />
      </div>
    </div>
  )
}

function ReviewItem({ label, value, full }: { label: string; value?: string; full?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-black p-4 ${full ? 'sm:col-span-2' : ''}`}>
      <div className="text-[10px] font-bold tracking-[0.25em] text-[#e6ff3d]">
        {label.toUpperCase()}
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-white">{value || '—'}</div>
    </div>
  )
}

function StepConfirmed({ booking, onReset }: { booking: Booking; onReset: () => void }) {
  const serviceLabel =
    booking.service === 'other'
      ? `Other: ${booking.otherService}`
      : serviceOptions.find((option) => option.id === booking.service)?.label || booking.service
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6ff3d] text-3xl font-black text-black">
        ✓
      </div>
      <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
        APPOINTMENT CONFIRMED
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
        Thanks {booking.name.split(' ')[0]}. We have reserved your slot and will call {booking.phone} to confirm the details.
      </p>
      <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
        <ReviewItem label="Service" value={serviceLabel} />
        <ReviewItem
          label="Vehicle"
          value={`${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel}`}
        />
        <ReviewItem label="Drop Off Date" value={formatDate(booking.date)} />
        <ReviewItem label="Drop Off Time" value={formatTime(booking.time)} />
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={`tel:${business.phoneRaw}`}
          className="rounded-full border border-[#e6ff3d]/50 px-7 py-3 text-sm font-bold text-[#e6ff3d] transition hover:bg-[#e6ff3d] hover:text-black"
        >
          Call the shop
        </a>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-[#e6ff3d] px-7 py-3 text-sm font-bold text-black transition hover:bg-white"
        >
          Book another appointment
        </button>
      </div>
    </div>
  )
}
