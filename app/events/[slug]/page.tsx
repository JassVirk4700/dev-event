import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "../../../components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { IEvent } from '@/database'
import EventCard from "../../../components/EventCard";

// Explicitly making this page dynamic
export const dynamic = 'force-dynamic';


{/* ------------------------------- Components ------------------------------- */ }
const EventDetailItem = ({ icon, alt, label, data }: { icon: string, alt: string, label: string, data: string }) => (
    <div className="flex items-center gap-2 my-2">
        <Image src={icon} alt={alt} width={20} height={20} />
        <div className="flex-col items-center">
            <span>{label}</span>
            <span>{data}</span>
        </div>
    </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div>
        <h2 className="mb-2">Agenda</h2>
        <ul className="agenda">
            {agendaItems.map((item: string, index: number) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: { tags: string[] }) => {
    return (
        <div className="flex flex-row flex-wrap gap-2 my-4  ">
            {tags.map((tag: string, index: number) => (
                <span
                    key={index}
                    className="tag bg-[#0D161A] text-white p-4 rounded-md cursor-pointer">
                    {tag.replace(/\b\w/g, c => c.toUpperCase())}
                </span>
            ))}
        </div>
    )
}

{/* ------------------------------- Main Page ------------------------------- */ }
const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }>; }) => {
    const { slug } = await params;
    const request = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
        { cache: "no-store" }
    );

    if (!request.ok) return notFound(); // Handle 4xx/5xx responses by showing 404 page

    const rawEvent = await request.json(); // Parse the JSON response
    const event = rawEvent.data; // Extract the event data
    const {
        title,
        description,
        overview,
        image,
        venue,
        location,
        date,
        time,
        mode,
        audience,
        agenda,
        organizer,
        tags } = event;

    let bookings = 50; // Example static value for available bookings    

    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

    return (
        <section id="event" className="mx-10">
            {/* ------------------------------- Event Header ------------------------------- */}
            <div className="header mt-10">
                <h1 className="">{title}</h1>
                <p>{description}</p>
            </div>

            <div className="details">
                {/* ------------------------------- Event Left Side ------------------------D------- */}
                <div className="content">
                    {/* Image */}
                    <Image src={image} alt={title} width={800} height={400} className="w-full h-auto rounded-xl object-cover sm:max-w-[420px] md:max-w-[600px] lg:max-w-[800px] mx-auto lg:mx-1" />

                    {/* Overview */}
                    <section className="flex-col gap-2 px-0">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    {/* Details */}
                    <section className="flex-col gap-3">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="📅" label="Date : " data={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="⏰" label="Time : " data={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="📍" label="Location : " data={venue + ", " + location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="📱" label="Mode : " data={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="👥" label="Audience : " data={audience} />
                    </section>

                    {/* Agenda */}
                    <section>
                        <EventAgenda agendaItems={agenda} />
                    </section>

                    {/* Organizer */}
                    <section className="flex-col gap-2  ">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    {/* Tags */}
                    <section>
                        <EventTags tags={tags} />
                    </section>
                </div>

                {/* ------------------------------- Event Right Side ------------------------------- */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2 className="text-2xl font-bold">Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className="mb-0">
                                Hurry! Only <span className="font-bold">{bookings}</span> spots left.
                            </p>) : (
                            <p className="text-red-500 font-bold">
                                Be the first to book this event!
                            </p>
                        )}
                        <BookEvent eventId={event._id} slug={event.slug} />
                    </div>
                </aside>
            </div>

            {/* ------------------------------- Similar Events ------------------------------- */}
            <section className="similar-events my-10">
                <h2 className="mb-4">Similar Events You May Like</h2>
                <div className="similar-events-list flex overflow-x-auto gap-4 pb-4">
                    {similarEvents.length > 0 ? similarEvents.map((simEvent: IEvent, key: number) => (
                        <EventCard key={simEvent._id.toString()} {...simEvent} />
                    )) : (
                        <p>No similar events found.</p>
                    )}
                </div>
            </section>
        </section>
    )
}

export default EventDetailsPage