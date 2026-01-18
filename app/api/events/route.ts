// External modules
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Internal modules
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const formData = await req.formData();

        let event;
        try {
            event = Object.fromEntries(formData.entries())
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format.' }, { status: 400 });
        }

        /* ------------------------------- Tags and Agenda ------------------------------- */
        let tags: string[] = JSON.parse(formData.get('tags') as string);
        let agenda: string[] = JSON.parse(formData.get('agenda') as string);

        const agendaText = agenda.join(' ');
        const tagsText = tags.join(' ');


        /* ------------------------------- Image Handling ------------------------------- */
        const imageField = formData.get('image');
        if (!imageField) {
            return NextResponse.json({ message: 'Image is required (file or URL).' }, { status: 400 });
        }

        // If imageField is a File (file upload)
        if (typeof imageField === 'object' && typeof (imageField as any).arrayBuffer === 'function') {
            const arrayBuffer = await (imageField as File).arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }).end(buffer);
            });

            event.image = (uploadResult as { secure_url: string }).secure_url;
        }
        // If imageField is a URL string (robust check)
        else if (typeof imageField === 'string' && imageField.trim().toLowerCase().startsWith('http')) {
            event.image = imageField.trim();
        } else {
            return NextResponse.json({ message: 'Image must be a file upload or a valid URL.' }, { status: 400 });
        }


        /* ------------------------------- Event Creation ------------------------------- */
        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
            agendaText,
            tagsText
        });

        return NextResponse.json({ message: 'Event Created Successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknow' }, { status: 500 })
    }

}

export async function GET() {
    try {
        await connectToDatabase();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ events }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to fetch events', error: e instanceof Error ? e.message : 'Unknow' }, { status: 500 })
    }
}

