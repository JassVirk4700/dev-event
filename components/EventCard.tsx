import Link from "next/link"
import Image from "next/image"

interface Props {
    image: string,
    title: string,
    slug: string,
    location: string,
    date: string,
    time: string,
}

const EventCard = ({ slug, image, title, location, date, time }: Props) => {
    return (
        <Link href={`/events/${slug}`} id="event-card">

{/* ------------------------------- Image section ------------------------------- */}
            <Image src={image} alt={title} width={410} height={300} className="poster" />
{/* ------------------------------- Bottom section ------------------------------- */}
            <div className="flex flex-row gap-2">
                <Image src="/icons/pin.svg" alt="location: " width={16} height={16}/>
                <p className="location">{location}</p>
            </div>
            <h2 className="title text-2xl">{title}</h2>
            <div className="datetime mr-0">
                <Image src="/icons/calendar.svg" alt="date: " width={16} height={16}/>
                <span className="date">{date} &ensp; |</span>
                <Image src="/icons/clock.svg" alt="date: " width={16} height={16}/>
                <span className="date">{time}</span>
            </div>
        </Link>
    )
}

export default EventCard