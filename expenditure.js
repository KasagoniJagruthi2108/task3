document.addEventListener("DOMContentLoaded", () => {
    const expenditureForm = document.getElementById("expenditureForm");

    expenditureForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const description = document.getElementById("expenditureDescription").value;
        const amount = parseFloat(document.getElementById("expenditureAmount").value);
        const date = document.getElementById("expenditureDate").value || new Date().toISOString();

        const totalAmount = getTotalAmount();

        if (totalAmount === 0) {
            alert("Cannot add expenditure as total amount is zero.");
        } else if (amount > totalAmount) {
            alert("Cannot add expenditure as it exceeds the total amount.");
        } else {
            addTransaction("expenditure", description, amount, date);
            window.location.href = "index.html";
        }
    });

    function addTransaction(type, description, amount, date) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({ type, description, amount, date });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    function getTotalAmount() {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        return transactions.reduce((total, transaction) => {
            return transaction.type === "income" ? total + transaction.amount : total - transaction.amount;
        }, 0);
    }
});
