package com.college.expense_tracker.service;

import com.college.expense_tracker.model.Expense;
import com.college.expense_tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    // CREATE or UPDATE
    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // READ ALL
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // READ BY ID
    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    // DELETE
    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}