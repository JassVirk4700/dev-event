import { Schema, model, models, type Model, type Types, type InferSchemaType } from 'mongoose'
import { Event } from './event.model'

/* ----------------------------- Types ----------------------------- */

export interface IBooking extends Document {
  eventId: Types.ObjectId
  email: string
  createdAt: Date;
  updatedAt: Date;
}

/* ---------------------------- Schema ----------------------------- */

// Simple, robust email validation
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const bookingSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => EMAIL_PATTERN.test(email),
        message: 'Invalid booking email address.',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
)

/* --------------------------- Hooks --------------------------- */

bookingSchema.pre('save', async function () {
  // `this` is now correctly inferred
  if (!this.isModified('eventId')) return

  const eventExists = await Event.exists({ _id: this.eventId })
  if (!eventExists) {
    throw new Error('Cannot create booking for a non-existent event.')
  }
})

/* ---------------------------- Model ---------------------------- */

// Infer document type directly from schema (recommended)
export type BookingDocument = InferSchemaType<typeof bookingSchema>
export type BookingModel = Model<BookingDocument>

export const Booking =  models.Booking || model<BookingDocument, BookingModel>('Booking', bookingSchema)

export default Booking
