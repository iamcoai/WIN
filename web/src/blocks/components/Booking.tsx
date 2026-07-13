import type { BookingBlok } from '@/payload-types'
import { BookingWidget } from './BookingWidget'

export function Booking({ intro }: BookingBlok) {
  return (
    <section className="py-20 md:py-24 bg-win-cream">
      <div className="max-w-2xl mx-auto px-6">
        {intro && (
          <p className="mb-10 max-w-xl mx-auto text-center text-lg md:text-xl text-win-charcoal/80 leading-relaxed">
            {intro}
          </p>
        )}
        <BookingWidget />
      </div>
    </section>
  )
}
