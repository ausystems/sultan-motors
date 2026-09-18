import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { useSubmit } from '@formspree/react'
import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { SkipToContent, Main } from '../components/PageShell'
import { pageSeo, breadcrumbTrails } from '../data/seo'
import { business, openingHours, FORMSPREE_FORM_ID } from '../data/site'
import { useHeroReveal } from '../motion/useHeroReveal'
import { useReveal } from '../motion/useReveal'

/**
 * Practical detail for anyone about to book. This is the page's only body copy
 * besides the form itself.
 */
const bookingNotes = [
  {
    title: 'Bring your ownership and VIN',
    body: 'Your registration and VIN let us pull the exact service schedule and parts catalogue for your model year, so the estimate reflects your car and not a generic average.',
  },
  {
    title: 'Describe the symptom, not the fix',
    body: 'Tell us what you hear, feel or smell and when it happens. Noise on cold starts and noise under braking point at different systems, and the detail saves diagnostic time you would otherwise pay for.',
  },
  {
    title: 'Nothing is approved until you approve it',
    body: 'We inspect first, then send a written estimate covering parts, labour and timeline. No work begins and no charge is incurred until you say yes to that quote.',
  },
  {
    title: 'A drop off time, not a completion time',
    body: 'The time you choose is when you drop the vehicle off. We confirm a realistic pickup window once a technician has seen it, and we call you rather than leaving you to chase us.',
  },
]

const serviceOptions = [
  { id: 'oil-change', label: 'Oil change' },
  { id: 'tire-service', label: 'Tire service' },
  { id: 'brake-service', label: 'Brake service' },
  { id: 'diagnostics', label: 'Diagnostics' },
  { id: 'engine-repair', label: 'Engine repair' },
  { id: 'other', label: 'Something else' },
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

/** Human label for the chosen service, including the free-text "other" case. */
function serviceLabelFor(booking: BookingForm): string {
  if (booking.service === 'other') {
    return `Other: ${booking.otherService ?? ''}`.trim()
  }
  return (
    serviceOptions.find((option) => option.id === booking.service)?.label ??
    booking.service ??
    ''
  )
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`
}

const steps = ['Service', 'Date and time', 'Details', 'Review', 'Sent']

export default function ContactPage() {
  const hero = useRef<HTMLElement>(null)
  const page = useRef<HTMLDivElement>(null)
  useHeroReveal(hero)
  useReveal(page)

  const [step, setStep] = useState(1)
  const [form, setForm] = useState<BookingForm>({})
  const [errors, setErrors] = useState<FieldErrors>({})
  const [confirmed, setConfirmed] = useState<Booking | null>(null)
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [booked, setBooked] = useState<BookedSlots>({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const sendBooking = useSubmit(FORMSPREE_FORM_ID)

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

  /**
   * Sends the booking to Formspree, then confirms.
   *
   * Nothing is confirmed and no slot is reserved until Formspree has accepted
   * the submission. A customer must never be told a request went through when
   * it never left the browser.
   */
  const submit = async () => {
    const result = bookingSchema.safeParse(form)
    if (!result.success) {
      const next: FieldErrors = {}
      result.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message
      })
      setErrors(next)
      return
    }

    setSending(true)
    setSendError(null)

    const booking = result.data
    const outcome = await sendBooking({
      // Formspree renders these keys as the labels in the notification email,
      // so they are written for whoever reads it at the shop, not for code.
      _subject: `New booking, ${serviceLabelFor(booking)}, ${booking.name}, ${formatDate(booking.date)} ${formatTime(booking.time)}`,
      // A field named "email" sets the reply-to, so a reply reaches the customer.
      email: booking.email || '',
      Name: booking.name,
      Phone: booking.phone,
      'Email address': booking.email || 'Not provided',
      Service: serviceLabelFor(booking),
      Vehicle: `${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel}`,
      'License plate': booking.licensePlate || 'Not provided',
      'Drop off': `${formatDate(booking.date)} at ${formatTime(booking.time)}`,
      Notes: booking.notes || 'None',
      // Spam trap. Formspree discards any submission where this is filled.
      _gotcha: honeypot,
    })

    setSending(false)

    if (outcome.kind === 'error') {
      const [first] = outcome.getFormErrors()
      setSendError(
        first?.message ??
          'We could not send your request just now. Please check your connection and try again, or call the shop.',
      )
      return
    }

    saveBooking(booking.date, booking.time)
    setBooked(loadBookings())
    setConfirmed(booking)
    setStep(5)
  }

  const reset = () => {
    setForm({})
    setErrors({})
    setConfirmed(null)
    setSendError(null)
    setHoneypot('')
    setStep(1)
  }

  return (
    <div className="bg-ink text-paper">
      <Seo {...pageSeo['contact']} />
      <SkipToContent />
      <Main>
        <div ref={page}>
          <section ref={hero}>
            <SiteNavbar theme="dark" />
            <div className="wrap pt-4">
              <Breadcrumbs trail={breadcrumbTrails['contact']} theme="dark" />
              <div className="grid-12 items-end gap-y-8 pb-14 pt-14 md:pb-20 md:pt-20">
                <h1 data-hero-title className="t-h1 col-span-12 max-w-[14ch] lg:col-span-8">
                  Book an auto repair appointment in Brampton
                </h1>
                <p data-hero-rest className="t-lead col-span-12 max-w-[44ch] text-paper/70 lg:col-span-4">
                  Choose the service, pick a drop off time and reserve a bay. Prefer to talk it
                  through? Call{' '}
                  <a href={`tel:${business.phoneRaw}`} className="link-ul text-paper">
                    {business.phoneDisplay}
                  </a>{' '}
                  during shop hours.
                </p>
              </div>
            </div>
          </section>

          {/* The wizard. One column of type on the black surface, no box. */}
          <section className="wrap pb-[var(--spacing-section)]">
            <ol className="rule-dark flex flex-wrap gap-x-8 gap-y-2 pt-6" aria-label="Booking steps">
              {steps.map((label, i) => {
                const num = i + 1
                const current = step === num
                const done = step > num
                return (
                  <li
                    key={label}
                    aria-current={current ? 'step' : undefined}
                    className={`t-index flex items-baseline gap-2.5 transition-colors duration-300 ${
                      current ? 'text-accent' : done ? 'text-paper/70' : 'text-paper/35'
                    }`}
                  >
                    <span className="tnum">{String(num).padStart(2, '0')}</span>
                    <span>{label}</span>
                  </li>
                )
              })}
            </ol>

            <form
              className="grid-12 mt-12 md:mt-16"
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                if (step < 4) goNext()
                else submit()
              }}
            >
              <div className="col-span-12 lg:col-span-8 lg:col-start-3">
                {step === 1 && <StepService form={form} setField={setField} errors={errors} />}
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
                {step === 3 && <StepDetails form={form} setField={setField} errors={errors} />}
                {step === 4 && <StepReview form={form} />}
                {step === 5 && confirmed && <StepConfirmed booking={confirmed} onReset={reset} />}

                {step < 5 && (
                  <div className="rule-dark mt-12 pt-8">
                    {sendError && (
                      <div role="alert" className="mb-8 max-w-[56ch] border-l-2 border-red-400 pl-5">
                        <p className="font-medium">We could not send your request.</p>
                        <p className="t-body mt-1 text-paper/70">{sendError}</p>
                        <p className="t-body mt-2 text-paper/70">
                          Your details are still filled in, so you can try again. If it keeps
                          failing, call{' '}
                          <a href={`tel:${business.phoneRaw}`} className="link-ul text-paper">
                            {business.phoneDisplay}
                          </a>{' '}
                          and we will book you in over the phone.
                        </p>
                      </div>
                    )}
                    {/*
                      Spam trap. Formspree discards any submission where _gotcha is
                      filled. Hidden from sight and assistive tech, and out of the tab
                      order, so only a bot ever fills it.
                    */}
                    <input
                      type="text"
                      name="_gotcha"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[-9999px] h-px w-px opacity-0"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={step === 1 || sending}
                        className="link-ul t-body text-paper/70 hover:text-paper disabled:pointer-events-none disabled:opacity-0"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={sending}
                        aria-busy={sending}
                        className="btn btn-accent disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {step < 4 ? 'Continue' : sending ? 'Sending' : 'Send booking request'}
                        {step < 4 && (
                          <span className="arrow" aria-hidden="true">
                            →
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </section>

          {/* Before you drop off. */}
          <section className="section-y bg-ink-2">
            <div className="wrap grid-12 gap-y-12">
              <h2 data-reveal className="t-h2 col-span-12 max-w-[12ch] lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
                What to expect when you book.
              </h2>
              <ol data-reveal data-reveal-group className="col-span-12 lg:col-span-7 lg:col-start-6">
                {bookingNotes.map((note, i) => (
                  <li key={note.title} className="rule-dark grid grid-cols-[2.5rem_1fr] gap-x-4 py-7">
                    <span className="t-index tnum pt-1.5 text-paper/35">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="t-h3 text-[1.25rem] md:text-[1.375rem]">{note.title}</h3>
                      <p className="t-body mt-2 max-w-[52ch] text-paper/60">{note.body}</p>
                    </div>
                  </li>
                ))}
                <li className="rule-dark" aria-hidden="true" />
              </ol>
            </div>
          </section>

          <section className="section-y">
            <div className="wrap">
              <div className="grid-12 gap-y-10">
                <h2 data-reveal className="t-h2 col-span-12 max-w-[14ch] lg:col-span-7">
                  {business.streetAddress}, {business.addressLocality}.
                </h2>
                <dl
                  data-reveal
                  className="col-span-12 grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 self-end text-paper/60 lg:col-span-4 lg:col-start-9"
                >
                  {openingHours.map((block) => (
                    <div key={block.label} className="contents">
                      <dt>{block.label}</dt>
                      <dd className="tnum text-paper">{block.display}</dd>
                    </div>
                  ))}
                  <dt>Sunday</dt>
                  <dd className="text-paper">Closed</dd>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${business.phoneRaw}`} className="link-ul text-paper">
                      {business.phoneDisplay}
                    </a>
                  </dd>
                </dl>
              </div>
              <div data-reveal className="mt-14 overflow-hidden bg-ink-3">
                <iframe
                  title="Sultan Motors location map"
                  src="https://maps.google.com/maps?q=5%20Melanie%20Dr%20Unit%202%20Brampton%20ON%20L6T%204K8&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  className="h-[320px] w-full grayscale invert-[0.92] hue-rotate-180 sm:h-[420px] md:h-[520px]"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </section>
        </div>
      </Main>
      <SiteFooter />
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Steps                                                                     */
/* ------------------------------------------------------------------------ */

interface StepProps {
  form: BookingForm
  setField: (field: keyof Booking, value: string) => void
  errors: FieldErrors
}

function StepHeading({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="t-index tnum text-paper/40">{String(index).padStart(2, '0')}</span>
      <h2 className="t-h3">{title}</h2>
    </div>
  )
}

function StepService({ form, setField, errors }: StepProps) {
  return (
    <div>
      <StepHeading index={1} title="What does the vehicle need?" />
      <fieldset className="mt-8">
        <legend className="t-index text-paper/55">Service</legend>
        <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
          {serviceOptions.map((option) => {
            const selected = form.service === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setField('service', option.id)}
                aria-pressed={selected}
                className={`rule-dark group flex items-center gap-4 py-4 text-left transition-colors duration-300 ${
                  selected ? 'text-accent' : 'text-paper/85 hover:text-paper'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`block h-2.5 w-2.5 shrink-0 border transition-colors duration-300 ${
                    selected ? 'border-accent bg-accent' : 'border-paper/40 group-hover:border-paper'
                  }`}
                />
                <span className="t-body">{option.label}</span>
              </button>
            )
          })}
        </div>
        {errors.service && (
          <p role="alert" className="t-small mt-3 text-red-300">
            {errors.service}
          </p>
        )}
      </fieldset>

      {form.service === 'other' && (
        <div className="mt-8">
          <TextField
            id="other-service"
            name="otherService"
            label="Describe the service"
            placeholder="What do you need help with?"
            value={form.otherService || ''}
            onChange={(v) => setField('otherService', v)}
            error={errors.otherService}
          />
        </div>
      )}

      <div className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-3">
        <TextField
          id="vehicle-year"
          name="vehicleYear"
          label="Year"
          placeholder="2020"
          inputMode="numeric"
          maxLength={4}
          value={form.vehicleYear || ''}
          onChange={(v) => setField('vehicleYear', v.replace(/\D/g, ''))}
          error={errors.vehicleYear}
        />
        <TextField
          id="vehicle-make"
          name="vehicleMake"
          label="Make"
          placeholder="Toyota"
          value={form.vehicleMake || ''}
          onChange={(v) => setField('vehicleMake', v)}
          error={errors.vehicleMake}
        />
        <TextField
          id="vehicle-model"
          name="vehicleModel"
          label="Model"
          placeholder="Camry"
          value={form.vehicleModel || ''}
          onChange={(v) => setField('vehicleModel', v)}
          error={errors.vehicleModel}
        />
      </div>
      <div className="mt-6 sm:max-w-[50%]">
        <TextField
          id="license-plate"
          name="licensePlate"
          label="License plate"
          optional
          placeholder="ABCD 123"
          value={form.licensePlate || ''}
          onChange={(v) => setField('licensePlate', v.toUpperCase())}
        />
      </div>
    </div>
  )
}

interface StepDateTimeProps extends StepProps {
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
  const atCurrentMonth =
    calMonth.getFullYear() === today.getFullYear() && calMonth.getMonth() === today.getMonth()

  return (
    <div>
      <StepHeading index={2} title="When would you like to drop it off?" />
      <div className="mt-10 grid gap-x-12 gap-y-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={atCurrentMonth}
              onClick={() =>
                setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))
              }
              aria-label="Previous month"
              className="link-ul t-small text-paper/70 hover:text-paper disabled:pointer-events-none disabled:opacity-25"
            >
              ← Prev
            </button>
            <p className="t-index text-paper" aria-live="polite">
              {monthLabel}
            </p>
            <button
              type="button"
              onClick={() =>
                setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))
              }
              aria-label="Next month"
              className="link-ul t-small text-paper/70 hover:text-paper"
            >
              Next →
            </button>
          </div>
          <div className="t-index mt-6 grid grid-cols-7 text-center text-paper/35">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={i} className="aspect-square" />
              const key = toDateKey(date)
              const disabled = date < today || date.getDay() === 0
              const selected = form.date === key
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  aria-label={date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                  onClick={() => {
                    setField('date', key)
                    setField('time', '')
                  }}
                  className={`tnum aspect-square text-sm transition-colors duration-200 ${
                    selected
                      ? 'bg-accent text-ink'
                      : disabled
                        ? 'cursor-not-allowed text-paper/20'
                        : 'text-paper hover:bg-paper/10'
                  }`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
          {errors.date && (
            <p role="alert" className="t-small mt-3 text-red-300">
              {errors.date}
            </p>
          )}
          <p className="t-small mt-4 text-paper/40">Closed on Sundays.</p>
        </div>

        <div>
          <p className="t-index text-paper/55">{form.date ? 'Available times' : 'Pick a date first'}</p>
          {!form.date && (
            <p className="t-body mt-4 max-w-[30ch] text-paper/40">
              Select a date to see drop off times.
            </p>
          )}
          {form.date && slots.length === 0 && (
            <p className="t-body mt-4 text-paper/40">This day is closed. Choose another date.</p>
          )}
          {form.date && slots.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const taken = bookedTimes.includes(slot)
                const selected = form.time === slot
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={taken}
                    aria-pressed={selected}
                    onClick={() => setField('time', slot)}
                    className={`tnum border px-2 py-2.5 text-sm transition-colors duration-200 ${
                      selected
                        ? 'border-accent bg-accent text-ink'
                        : taken
                          ? 'cursor-not-allowed border-paper/10 text-paper/20 line-through'
                          : 'border-paper/20 text-paper hover:border-paper'
                    }`}
                  >
                    {formatTime(slot)}
                  </button>
                )
              })}
            </div>
          )}
          {errors.time && (
            <p role="alert" className="t-small mt-3 text-red-300">
              {errors.time}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function StepDetails({ form, setField, errors }: StepProps) {
  return (
    <div>
      <StepHeading index={3} title="How do we reach you?" />
      <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <TextField
          id="customer-name"
          name="name"
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
          value={form.name || ''}
          onChange={(v) => setField('name', v)}
          error={errors.name}
        />
        <TextField
          id="customer-phone"
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(905) 555 0100"
          value={form.phone || ''}
          onChange={(v) => setField('phone', v)}
          error={errors.phone}
        />
        <div className="sm:col-span-2">
          <TextField
            id="customer-email"
            name="email"
            label="Email"
            optional
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email || ''}
            onChange={(v) => setField('email', v)}
            error={errors.email}
          />
        </div>
        <div className="sm:col-span-2">
          <TextField
            id="customer-notes"
            name="notes"
            label="Notes"
            optional
            rows={4}
            maxLength={1000}
            placeholder="Describe the issue, the symptoms, or anything we should know"
            value={form.notes || ''}
            onChange={(v) => setField('notes', v)}
          />
        </div>
      </div>
    </div>
  )
}

function StepReview({ form }: { form: BookingForm }) {
  return (
    <div>
      <StepHeading index={4} title="Everything look right?" />
      <dl className="mt-8">
        <ReviewItem label="Service" value={serviceLabelFor(form)} />
        <ReviewItem
          label="Vehicle"
          value={`${form.vehicleYear || ''} ${form.vehicleMake || ''} ${form.vehicleModel || ''}`.trim()}
        />
        <ReviewItem label="License plate" value={form.licensePlate || 'Not provided'} />
        <ReviewItem
          label="Drop off"
          value={`${form.date ? formatDate(form.date) : ''} at ${form.time ? formatTime(form.time) : ''}`}
        />
        <ReviewItem label="Name" value={form.name || ''} />
        <ReviewItem label="Phone" value={form.phone || ''} />
        <ReviewItem label="Email" value={form.email || 'Not provided'} />
        <ReviewItem label="Notes" value={form.notes || 'None'} />
      </dl>
    </div>
  )
}

function ReviewItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rule-dark grid grid-cols-[7rem_1fr] gap-x-6 py-4 sm:grid-cols-[10rem_1fr]">
      <dt className="t-index pt-1 text-paper/45">{label}</dt>
      <dd className="t-body break-words text-paper">{value || 'None'}</dd>
    </div>
  )
}

/**
 * The end state. Formspree has accepted the request and the shop has been
 * emailed. It is a request until someone at the shop calls back, and the copy
 * says so; it does not claim a confirmed appointment.
 */
function StepConfirmed({ booking, onReset }: { booking: Booking; onReset: () => void }) {
  return (
    <div>
      <p className="t-index text-accent">Request sent</p>
      <h2 className="t-h2 mt-5 max-w-[16ch]">
        Thanks {booking.name.split(' ')[0]}. We have your request.
      </h2>
      <p className="t-body mt-6 max-w-[48ch] text-paper/70">
        A technician will call {booking.phone} to confirm the drop off and answer any questions
        before the day.
      </p>
      <dl className="mt-10">
        <ReviewItem label="Service" value={serviceLabelFor(booking)} />
        <ReviewItem
          label="Vehicle"
          value={`${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel}`}
        />
        <ReviewItem label="Drop off" value={`${formatDate(booking.date)} at ${formatTime(booking.time)}`} />
      </dl>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <a href={`tel:${business.phoneRaw}`} className="btn btn-ghost-dark">
          Call the shop
        </a>
        <button type="button" onClick={onReset} className="link-ul text-paper/70 hover:text-paper">
          Book another vehicle
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* Field                                                                     */
/* ------------------------------------------------------------------------ */

interface TextFieldProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (value: string) => void
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
 * A labelled control on a baseline. The label is tied to the control with
 * htmlFor/id and the error with aria-describedby, so assistive technology
 * announces both; the placeholder is a hint, never the label.
 */
function TextField({
  id,
  name,
  label,
  value,
  onChange,
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
    className: 'field',
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? errorId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
  }

  return (
    <div>
      <label className="t-index block text-paper/55" htmlFor={id}>
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-paper/35">optional</span>}
      </label>
      {rows ? (
        <textarea {...shared} rows={rows} />
      ) : (
        <input {...shared} type={type} inputMode={inputMode} />
      )}
      {error && (
        <p id={errorId} role="alert" className="t-small mt-2 text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
