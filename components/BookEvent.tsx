'use client'

import React, { useState } from "react"
import { createBooking } from "../lib/actions/booking.acton";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string }) => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { success } = await createBooking({ eventId, slug, email });
        if (success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email });
        } else {
            console.log('Booking creation failed')
            posthog.captureException('Booking creation failed')
        }
    }

    return (
        <div className="flex justify-center min-h-20">
            <div className="w-full max-w-md rounded-2xl mt-0">
                {submitted ? (
                    <p className="text-sm text-emerald-300">
                        Thank you for booking! We have received your request.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-slate-200"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-xl border border-white/10 bg-[#0f2a2e] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl cursor-pointer bg-linear-to-r from-emerald-400 to-teal-400 py-3 text-sm font-semibold text-[#0D161A] text-shadow-green-800 transition hover:opacity-90"
                        >
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default BookEvent