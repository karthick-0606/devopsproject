import axios from "axios";

const API_URL = "http://localhost:8080/api/expenses";

class ExpenseService {
  // Get all expenses
  getAllExpenses() {
    return axios.get(API_URL);
  }

  // Create a new expense
  createExpense(expense) {
    return axios.post(API_URL, expense);
  }

  // Delete an expense by ID
  deleteExpense(id) {
    return axios.delete(`${API_URL}/${id}`);
  }

  // ✅ Update an existing expense by ID
  updateExpense(id, expense) {
    return axios.put(`${API_URL}/${id}`, expense);
  }
}

// ✅ Assign instance to variable
const expenseService = new ExpenseService();

export default expenseService;
