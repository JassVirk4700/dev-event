import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";

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
    } catch (e) {
        console.error(e);
        return NextResponse.json({message : 'Event Creation Failed', error : e instanceof Error ? e.message : 'Unknow'}, { status: 400 })
    }

}