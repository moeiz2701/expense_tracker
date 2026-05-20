import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { CATEGORIES, Category, Expense } from "@/types/expense";

export function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  if (category && !CATEGORIES.includes(category as Category)) 
    {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const rows = category
    ? (db.prepare("SELECT * FROM expenses WHERE category = ? ORDER BY date DESC").all(category) as Expense[])

    : (db.prepare("SELECT * FROM expenses ORDER BY date DESC").all() as Expense[]);

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") 
    {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { title, amount, category, date } = body as Record<string, unknown>;
  if (typeof title !== "string" )
  {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }
  if (typeof amount !== "number" || isNaN(amount) || amount <= 0)
    {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
  if (typeof category !== "string" || !CATEGORIES.includes(category as Category))
    {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
  if (typeof date !== "string" || isNaN(Date.parse(date))) 
    {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

 

  const expense: Expense = {
    id: randomUUID(),
    title: title,
    amount,
    category: category as Category,
    date,
    createdAt: new Date().toISOString(),
  };

  db.prepare(
    "INSERT INTO expenses (id, title, amount, category, date, createdAt) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(expense.id, expense.title, expense.amount, expense.category, expense.date, expense.createdAt);

  return NextResponse.json(expense, { status: 201 });
}
