import SiteLink from './SiteLink'
import { exploreLinks, serviceLinks } from '../data/links'
import { business, socialProfiles } from '../data/site'

const socialFooterLinks: { label: string; href: string }[] = [
  { label: 'Google Reviews', href: socialProfiles.googleBusiness },
  { label: 'Instagram', href: socialProfiles.instagram },
  { label: 'Facebook', href: socialProfiles.facebook },
].filter((link) => Boolean(link.href))

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#e6ff3d]/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[380px] w-[380px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-[420px] w-[420px] rounded-full bg-[#e6ff3d]/10 blur-3xl" />
      </div>
      <div className="relative px-4 pb-6 pt-14 sm:px-6 sm:pt-16 md:px-8 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
            <div className="w-full max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
                Sultan Motors, Brampton
              </p>
              {/*
                Deliberately not a heading: this is a closing tagline, and
                promoting it to <h3> would inject a content-free heading at the
                end of every page's outline.
              */}
              <p className="mt-5 text-[28px] font-black leading-[1.05] tracking-tight text-white sm:text-4xl md:text-[42px] lg:text-[46px]">
                Relax, we get you and
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                your vehicle sorted.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <SiteLink
                to="/contact"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#e6ff3d] px-7 py-4 text-[13px] font-semibold text-black transition hover:bg-white"
              >
                Book an appointment
              </SiteLink>
              <a
                href="tel:+19057991331"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#e6ff3d]/50 px-7 py-4 text-[13px] font-semibold text-[#e6ff3d] transition hover:bg-[#e6ff3d] hover:text-black"
              >
                Call (905) 799-1331
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-14 grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Explore
            </div>
            {/* py-1.5 lifts each link to a comfortable mobile tap target
                without changing the list's visual rhythm — the gap shrinks by
                the same amount the padding adds. */}
            <ul className="mt-4 space-y-0 text-[15px] font-medium text-white">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <SiteLink
                    to={link.to}
                    activeClassName="underline"
                    exact={link.to === '/'}
                    className="inline-block py-1.5 transition hover:text-white/60"
                  >
                    {link.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-6 lg:order-none">
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Services
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-0 text-[14px] font-medium text-white sm:grid-cols-2 lg:grid-cols-2">
              {serviceLinks.map((link) => (
                <li key={link.to} className="min-w-0">
                  <SiteLink
                    to={link.to}
                    className="block truncate py-1.5 transition hover:text-white/60"
                  >
                    {link.label.replace(' Brampton', '')}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Visit
            </div>
            {/*
              The name, address, and phone here must match the Google Business
              Profile listing character for character — inconsistent NAP across
              a site is one of the most common local-ranking problems.
            */}
            <address className="mt-5 space-y-2 text-[14px] font-medium not-italic text-white">
              <div>{business.streetAddress}</div>
              <div>
                {business.addressLocality}, {business.addressRegion}{' '}
                {business.postalCode}
              </div>
              <div className="pt-1">
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="underline-offset-4 transition hover:text-[#e6ff3d] hover:underline"
                >
                  {business.phoneDisplay}
                </a>
              </div>
            </address>
            <div className="mt-3 space-y-1 text-[14px] font-medium text-white/50">
              <div>Mon to Fri: 8am to 6pm</div>
              <div>Saturday: 9am to 3pm</div>
              <div>Sunday: Closed</div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-[12px] font-medium sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[#e6ff3d]" suppressHydrationWarning>
            © {new Date().getFullYear()} Sultan Motors. Auto repair in Brampton, Ontario.
          </div>
          {/*
            Only profiles configured in src/data/site.ts are linked. These were
            previously href="#", which crawls as a self-referential dead link on
            every page of the site.
          */}
          {socialFooterLinks.length > 0 && (
            <div className="flex flex-wrap gap-5 text-[#e6ff3d]">
              {socialFooterLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:opacity-70"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="mx-auto mt-4 max-w-7xl text-[12px] font-medium text-white/50 sm:mt-3 sm:text-right">
          Powered by{' '}
          <a
            href="https://www.skyboundscaling.com"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-sm text-[#e6ff3d] underline-offset-4 transition hover:underline hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e6ff3d]"
          >
            Skybound Scaling
          </a>
        </div>
        <div className="relative mt-6 select-none overflow-hidden">
          <div className="text-center font-black leading-[0.85] tracking-[-0.04em] text-[#e6ff3d] [font-size:clamp(5rem,22vw,20rem)]">
            SULTAN
          </div>
        </div>
      </div>
    </footer>
  )
}
