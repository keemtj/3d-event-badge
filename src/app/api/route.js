// app/api/sendMessage/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { message } = await req.json();
  const webhookUrl = process.env.SLACK_WEBHOOK_URL_STAFF;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Slack Webhook URL is not set" },
      { status: 500 }
    );
  }

  try {
    await axios.post(webhookUrl, {
      text: message,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message to Slack" },
      { status: 500 }
    );
  }
}
