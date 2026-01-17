import { notFound } from "next/navigation";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>; }) => {
    const { slug } = await params;
    const request = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
        { cache: "no-store" }
    );

    if (!request.ok) return notFound(); // Handle 4xx/5xx responses by showing 404 page

    const event = await request.json();

    return (
        <section id="event-details">
            <h1>Event Details</h1>
            <h2>{event.data.title}</h2>
        </section>
    )
}

export default EventDetailsPage