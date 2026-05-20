export const CATEGORIES = ["stay", "food", "transport", "other"] as const;

export type Category = (typeof CATEGORIES)[number];

export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  createdAt: string;
};
