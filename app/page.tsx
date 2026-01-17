import ExploreBtn from '../components/ExploreBtn'
import EventCard from '../components/EventCard'
import { IEvent } from '@/database/event.model'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


const Page = async () => {
  console.log('BASE_URL:', BASE_URL);
  const response = await fetch(`${BASE_URL}/api/events`)
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-5xl font-bold text-center mt-20 pb-2">The Hub for Every Dev <br /> Event You Can't Miss. </h1>
      <p className="text-center">Hackathons, Meetups, and Conferences, All in one place.</p>
      <ExploreBtn />

{/* ------------------------------- Featured Events ------------------------------- */}
      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>
        <ul className='events list-none' >
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page