import React, { useEffect, useState } from "react";
import ExpenseService from "../services/ExpenseService";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    expenseDate: ""
  });
  const [editingId, setEditingId] = useState(null); // Track which expense is being edited

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    ExpenseService.getAllExpenses().then((response) => {
      setExpenses(response.data);
    });
  };

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const saveExpense = (e) => {
    e.preventDefault();

    if (editingId) {
      // ✅ Update existing expense
      ExpenseService.updateExpense(editingId, expense).then(() => {
        setExpense({ title: "", amount: "", category: "", expenseDate: "" });
        setEditingId(null);
        loadExpenses();
      });
    } else {
      // ✅ Create new expense
      ExpenseService.createExpense(expense).then(() => {
        setExpense({ title: "", amount: "", category: "", expenseDate: "" });
        loadExpenses();
      });
    }
  };

  const editExpense = (exp) => {
    setEditingId(exp.id);
    setExpense({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      expenseDate: exp.expenseDate
    });
  };

  const deleteExpense = (id) => {
    ExpenseService.deleteExpense(id).then(() => {
      loadExpenses();
    });
  };

  return (
    <div>
      <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>

      <form onSubmit={saveExpense}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={expense.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={expense.category}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="expenseDate"
          value={expense.expenseDate}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Update Expense" : "Add Expense"}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setExpense({ title: "", amount: "", category: "", expenseDate: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Expense List</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.title}</td>
              <td>{exp.amount}</td>
              <td>{exp.category}</td>
              <td>{exp.expenseDate}</td>
              <td>
                <button onClick={() => editExpense(exp)}>Edit</button>
                <button onClick={() => deleteExpense(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
