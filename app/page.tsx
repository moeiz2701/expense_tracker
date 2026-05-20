import db from "@/lib/db";
import styles from "./page.module.css";
import ExpensesView from "../components/ExpensesView";
import { Expense } from "@/types/expense";

export default function Home() {
  const expenses = db
    .prepare("SELECT * FROM expenses ORDER BY date DESC")
    .all() as Expense[];

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Expenses</h1>
      <ExpensesView initialExpenses={expenses} />
    </main>
  );
}
