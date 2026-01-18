'use server';

import connectToDatabase from "../mongodb";
import { Event } from "@/database";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();

        const event = await Event.findOne({ slug });
        // debug
        console.log("Event found:", event);
        console.log("Event tags:", event?.tags, typeof event?.tags);

        const total = await Event.countDocuments();
        console.log("Total events:", total);

        // last debug
        const all = await Event.find({}, { slug: 1, tags: 1 }).lean();
        console.log(JSON.stringify(all, null, 2));




        return await Event.find({ _id: { $ne: event?._id }, tags: { $in: event?.tags } }).lean();
    } catch (error) {

    }
}