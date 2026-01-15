import ExploreBtn from '../components/ExploreBtn'
import EventCard from '../components/EventCard'
import { events } from '../lib/constants'

const Page = () => {
  return (
    <section>
      <h1 className="text-5xl font-bold text-center mt-20 pb-2">The Hub for Every Dev <br /> Event You Can't Miss. </h1>
      <p className="text-center">Hackathons, Meetups, and Conferences, All in one place.</p>

      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>
        {/* Featured events content goes here */}

        <ul className='events list-none' >
          {events.map((event) => (
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