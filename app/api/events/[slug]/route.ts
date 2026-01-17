import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Event, type EventDocument } from '@/database';

// Allowed slug pattern to guard against obviously invalid input.
const SLUG_PATTERN = /^[a-z0-9-]+$/;

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug: rawSlug } = await params;

    // Basic validation for presence and shape of slug.
    if (typeof rawSlug !== 'string' || rawSlug.trim().length === 0) {
      return NextResponse.json(
        { error: 'New Missing or empty slug parameter.' },
        { status: 400 },
      );
    }

    const slug = rawSlug.trim().toLowerCase();

    if (!SLUG_PATTERN.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format.' },
        { status: 400 },
      );
    }

    // Ensure a single shared DB connection is established.
    await connectToDatabase();

    // Fetch the event from DB by slug.
    const event: EventDocument | null = await Event.findOne({ slug }).lean<EventDocument | null>();

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 },
      );
    }

    // Return the normalized event payload.
    return NextResponse.json(
      { message: "Event fetched successfully.", data: event },
      { status: 200 },
    );
  } catch (error) {
    // Log the error server-side for observability, but avoid leaking internals to clients.
    console.error('Error fetching event by slug:', error);

    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the event.' },
      { status: 500 },
    );
  }
}
