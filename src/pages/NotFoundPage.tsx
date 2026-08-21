import SiteLink from '../components/SiteLink'
import SiteNavbar from '../components/SiteNavbar'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import { SkipToContent, Main } from '../components/PageShell'
import { backgroundImageSet } from '../components/SitePhoto'
import { notFoundSeo } from '../data/seo'
import { serviceLinks } from '../data/links'
import { photo } from '../data/photos'
import { business } from '../data/site'
import { ArrowUpRightIcon } from '../components/icons'

const shortcuts = [
  {
    to: '/auto-repair-brampton',
    label: 'Auto Repair',
    copy: 'Diagnostics, engines, brakes and everything mechanical, under one roof.',
  },
  {
    to: '/collision-repair-brampton',
    label: 'Collision Repair',
    copy: 'Frame straightening, structural work and colour matched refinishing.',
  },
  {
    to: '/safety-standards-certificate-brampton',
    label: 'Safety Certificate',
    copy: 'Ontario safety inspections for transfers and registration.',
  },
  {
    to: '/contact',
    label: 'Book an Appointment',
    copy: 'Pick a service, choose a drop off time and reserve your bay online.',
  },
]

export default function NotFoundPage() {
  const backdrop = photo('home.visit')

  return (
    <div className="min-h-screen bg-[#0d0e10] font-sans">
      <Seo {...notFoundSeo} />
      <SkipToContent />
      <Main>
      <SiteNavbar theme="dark" />

      <section className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-28 md:px-8 md:pt-16">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{ backgroundImage: backgroundImageSet(backdrop) }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0d0e10]/70 via-[#0d0e10]/85 to-[#0d0e10]" />
        <div
          className="pointer-events-none absolute -left-40 top-10 h-[460px] w-[460px] rounded-full bg-[#e6ff3d]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.24em] text-[#e6ff3d] sm:text-[11px]">
            ERROR 404 — PAGE NOT FOUND
          </p>

          <div className="mt-6 select-none leading-[0.8]" aria-hidden="true">
            <span className="block bg-gradient-to-b from-white/95 to-white/25 bg-clip-text font-black tracking-[-0.05em] text-transparent [font-size:clamp(6rem,26vw,18rem)]">
              404
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl text-[2rem] font-extrabold leading-[1.03] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            THIS PAGE TOOK A WRONG TURN.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            The page you were looking for has been moved, renamed, or never
            existed. Nothing is wrong with your vehicle — just this link. Pick a
            service below, head back to the homepage, or call the shop and we
            will point you the right way.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <SiteLink
              to="/"
              className="rounded-full bg-[#e6ff3d] px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white"
            >
              Back to homepage
            </SiteLink>
            <a
              href={`tel:${business.phoneRaw}`}
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Call {business.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-[#111214] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.24em] text-white/60 sm:text-[11px]">
            POPULAR DESTINATIONS
          </p>
          <h2 className="mt-4 max-w-3xl text-2xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-3xl md:text-4xl">
            WHERE MOST BRAMPTON DRIVERS WERE HEADING.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {shortcuts.map((item) => (
              <SiteLink
                key={item.to}
                to={item.to}
                className="group flex items-start justify-between gap-5 rounded-2xl border border-white/10 bg-[#1a1b1f] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#e6ff3d]/40 hover:bg-[#222328] sm:p-7"
              >
                <span className="min-w-0">
                  <span className="block text-lg font-extrabold tracking-tight text-white sm:text-xl">
                    {item.label}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-white/60">
                    {item.copy}
                  </span>
                </span>
                <ArrowUpRightIcon className="mt-1 h-5 w-5 shrink-0 text-white/40 transition group-hover:text-[#e6ff3d]" />
              </SiteLink>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d0e10] px-4 pb-20 sm:px-6 sm:pb-24 md:px-8 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.24em] text-white/60 sm:text-[11px]">
            EVERY SERVICE WE OFFER
          </p>
          <h2 className="mt-4 max-w-3xl text-2xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-3xl md:text-4xl">
            BROWSE THE FULL SULTAN MOTORS SERVICE LIST.
          </h2>

          <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {serviceLinks.map((link) => (
              <li key={link.to}>
                <SiteLink
                  to={link.to}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-white transition hover:border-[#e6ff3d]/40 hover:bg-white/[0.07]"
                >
                  {link.label}
                  <span aria-hidden="true" className="text-white/35">
                    →
                  </span>
                </SiteLink>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-white/10 bg-[#1a1b1f] p-6 sm:p-8">
            <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
              Still cannot find it?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
              Sultan Motors is at {business.streetAddress},{' '}
              {business.addressLocality}, {business.addressRegion}{' '}
              {business.postalCode}. Call{' '}
              <a
                href={`tel:${business.phoneRaw}`}
                className="font-semibold text-[#e6ff3d] underline-offset-4 hover:underline"
              >
                {business.phoneDisplay}
              </a>{' '}
              during shop hours and a technician will help you find what you
              need.
            </p>
          </div>
        </div>
      </section>

        </Main>

      <SiteFooter />
    </div>
  )
}
