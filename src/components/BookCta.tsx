import SiteLink from './SiteLink'

export default function BookCta({ className = '' }: { className?: string }) {
  return (
    <SiteLink
      to="/contact"
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#e6ff3d] px-7 py-4 text-[13px] font-semibold text-black shadow-lg shadow-[#e6ff3d]/20 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl ${className}`}
    >
      Book an appointment
    </SiteLink>
  )
}
