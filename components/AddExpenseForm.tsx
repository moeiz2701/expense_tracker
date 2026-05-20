"use client";

import { useState } from "react";
import styles from "./AddExpenseForm.module.css";
import { Expense, Category, CATEGORIES } from "@/types/expense";

export default function AddExpenseForm({ onAdd }: { onAdd: (e: Expense) => void }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to add expense");
      return;
    }

    const expense: Expense = await res.json();
    onAdd(expense);

    setTitle("");
    setAmount("");
    setCategory("food");
    setDate(new Date().toISOString().slice(0, 10));
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.subheading}>Add Expense</h2>

      <input
        className={styles.input}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        className={styles.input}
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        className={styles.input}
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input
        className={styles.input}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button className={styles.button} type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
