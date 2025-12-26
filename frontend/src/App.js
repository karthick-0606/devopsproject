import React, { useEffect } from "react";
import ExpenseList from "./components/ExpenseList";
import startParticles from "./partical";
import "./frontpage.css";

function App() {
  useEffect(() => {
    const stop = startParticles();
    return () => stop();
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div className="front-container">
        <div className="front-header">
          <h1>Expense Tracker</h1>
        </div>
        <ExpenseList />
      </div>
    </div>
  );
}

export default App;
