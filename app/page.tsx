import db from "@/lib/db";
import styles from "./page.module.css";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
};

export default function Home() {
  const expenses = db
    .prepare("SELECT * FROM expenses ORDER BY date DESC")
    .all() as Expense[];

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Expenses</h1>
      <div className={styles.total}>Total: ${total.toFixed(2)}</div>

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
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
