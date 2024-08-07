document.addEventListener("DOMContentLoaded", () => {
    const incomeForm = document.getElementById("incomeForm");

    incomeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const description = document.getElementById("incomeDescription").value;
        const amount = parseFloat(document.getElementById("incomeAmount").value);
        const date = document.getElementById("incomeDate").value || new Date().toISOString();

        addTransaction("income", description, amount, date);
        window.location.href = "index.html";
    });

    function addTransaction(type, description, amount, date) {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push({ type, description, amount, date });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }
});
