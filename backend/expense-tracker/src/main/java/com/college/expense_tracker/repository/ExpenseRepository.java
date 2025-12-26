package com.college.expense_tracker.repository;

import com.college.expense_tracker.model.Expense;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // CRUD methods are already available
}