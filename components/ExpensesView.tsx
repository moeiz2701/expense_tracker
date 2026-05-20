"use client";

import { useState } from "react";
import AddExpenseForm from "./AddExpenseForm";
import styles from "./ExpensesView.module.css";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
};

const CATEGORIES = ["stay", "food", "transport", "other"] as const;

export default function ExpensesView({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<"all" | (typeof CATEGORIES)[number]>("all");

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  async function changeFilter(value: "all" | (typeof CATEGORIES)[number]) {
    setFilter(value);
    const url = value === "all" ? "/api/expenses" : `/api/expenses?category=${value}`;
    const res = await fetch(url);
    if (res.ok) 
      {
      setExpenses(await res.json());

    }
  }

  async function handleDelete(id: string) {
    const prev = expenses;
    setExpenses(expenses.filter((e) => e.id !== id));

    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (!res.ok) 
      {
      setExpenses(prev);
    }
  }

  function handleAdd(expense: Expense) {
    setExpenses([expense, ...expenses]);
  }

  return (
    <>
      <div className={styles.total}>Total: ${total}</div>

      <select
        className={styles.filter}
        value={filter}
        onChange={(e) => changeFilter(e.target.value as "all" | (typeof CATEGORIES)[number])}
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {expenses.length === 0 ? (
        <p className={styles.empty}>No expenses yet.</p>
      ) : (
        <ul className={styles.list}>
          {expenses.map((e) => (
            <li key={e.id} className={styles.row}>
              <span>{e.title}</span>
              <span>{e.category}</span>
              <span>{new Date(e.date).toLocaleDateString()}</span>
              <span>${e.amount}</span>
              <button
                className={styles.delete}
                onClick={() => handleDelete(e.id)}
                aria-label="Delete"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <AddExpenseForm onAdd={handleAdd} />
    </>
  );
}
