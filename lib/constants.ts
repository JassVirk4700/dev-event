export type EventItem = {
    slug: string,
    image: string,
    location: string,
    title: string,
    date: string,
    time: string,
}

export const events = [
    {
        image: "/images/event1.png",
        title: "React Conf 2026",
        slug: "react-conf-2026",
        location: "Las Vegas, NV",
        date: "March 15, 2026",
        time: "9:00 AM - 6:00 PM"
    },
    {
        image: "/images/event2.png",
        title: "Google I/O 2026",
        slug: "google-io-2026",
        location: "Mountain View, CA",
        date: "May 20, 2026",
        time: "10:00 AM - 5:00 PM"
    },
    {
        image: "/images/event3.png",
        title: "WWDC 2026",
        slug: "wwdc-2026",
        location: "Cupertino, CA",
        date: "June 10, 2026",
        time: "10:00 AM - 4:00 PM"
    },
    {
        image: "/images/event4.png",
        title: "Major League Hacking Hackathon",
        slug: "mlh-hackathon-2026",
        location: "New York, NY",
        date: "April 5, 2026",
        time: "8:00 AM - 8:00 PM"
    },
    {
        image: "/images/event5.png",
        title: "JavaScript Meetup NYC",
        slug: "js-meetup-nyc-2026",
        location: "New York, NY",
        date: "February 20, 2026",
        time: "6:00 PM - 9:00 PM"
    },
    {
        image: "/images/event6.png",
        title: "PyCon US 2026",
        slug: "pycon-us-2026",
        location: "Pittsburgh, PA",
        date: "May 15, 2026",
        time: "9:00 AM - 6:00 PM"
    }
];