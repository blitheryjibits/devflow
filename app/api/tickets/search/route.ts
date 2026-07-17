import { NextRequest, NextResponse } from "next/server";
import tickets from "@/app/database";
import { filter } from "@mdxeditor/editor";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) return NextResponse.json(tickets);

  const filteredTickets = tickets.filter((ticket) =>
    ticket.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
  );

  return NextResponse.json(filteredTickets);
}
