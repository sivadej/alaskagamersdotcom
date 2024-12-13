import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 },
      );
    }

    let twilioResponse;
    // Send confirmation message using Twilio
    const messageBody = {
      body: 'You are now receiving AlaskaGamers event reminders! Reply STOP at any time to opt out.',
      from: twilioPhoneNumber, // Your Twilio phone number
      to: phoneNumber,
      // to: '+15005550006', // Twilio test number fail
      // to: '+15005550001', // Twilio test number success
    };
    try {
      twilioResponse = await twilioClient.messages.create(messageBody);
    } catch (twilioError) {
      console.error('Error sending Twilio message:', twilioError);
      twilioResponse = twilioError;
    }

    // Log the Twilio API request and response
    const { error: logError } = await supabaseClient
      .from('twilio_logs')
      .insert([
        {
          api_request: messageBody,
          api_response: twilioResponse,
        },
      ]);

    if (logError) {
      console.error('Error logging Twilio API request/response:', logError);
    }

    const { error: dbError } = await supabaseClient.from('sms_capture').insert([
      {
        phone_number: phoneNumber,
        // confirmation_sent: res?.
      },
    ]);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json(
      { message: 'Phone number saved successfully' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
