// script.js

// Add Income Page
document.addEventListener("DOMContentLoaded", () => {
    const incomeForm = document.getElementById("incomeForm");
    const expenditureForm = document.getElementById("expenditureForm");

    if (incomeForm) {
        incomeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const description = document.getElementById("incomeDescription").value;
            const amount = parseFloat(document.getElementById("incomeAmount").value);
            const date = document.getElementById("incomeDate").value || new Date().toISOString();
            addTransaction("income", description, amount, date);
            window.location.href = "index.html";
        });
    }

    if (expenditureForm) {
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
    }

    // Functions for handling transactions
    function addTransaction(type, description, amount, date) {
        const transactions = getTransactions();
        transactions.push({ type, description, amount, date });
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    function getTransactions() {
        return JSON.parse(localStorage.getItem("transactions")) || [];
    }

    function getTotalAmount() {
        const transactions = getTransactions();
        return transactions.reduce((total, transaction) => {
            return transaction.type === "income" ? total + transaction.amount : total - transaction.amount;
        }, 0);
    }

    // Functions for main page
    if (document.getElementById("incomeTable") && document.getElementById("expenditureTable")) {
        displayTransactions();

        document.getElementById("filterIncomeButton").addEventListener("click", () => {
            filterTransactions("income");
        });

        document.getElementById("filterExpenditureButton").addEventListener("click", () => {
            filterTransactions("expenditure");
        });

        document.getElementById("clearIncomeFilterButton").addEventListener("click", () => {
            displayTransactions();
        });

        document.getElementById("clearExpenditureFilterButton").addEventListener("click", () => {
            displayTransactions();
        });
    }

    function displayTransactions() {
        const transactions = getTransactions();
        const incomeTableBody = document.querySelector("#incomeTable tbody");
        const expenditureTableBody = document.querySelector("#expenditureTable tbody");

        incomeTableBody.innerHTML = "";
        expenditureTableBody.innerHTML = "";

        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.amount}</td>
            `;

            if (transaction.type === "income") {
                row.classList.add("income-row");
                incomeTableBody.appendChild(row);
            } else {
                row.classList.add("expenditure-row");
                expenditureTableBody.appendChild(row);
            }
        });

        updateTotalAmountButton();
    }

    function filterTransactions(type) {
        const startDate = new Date(document.getElementById("filterStartDate").value);
        const endDate = new Date(document.getElementById("filterEndDate").value);
        const transactions = getTransactions();

        const filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transaction.type === type && transactionDate >= startDate && transactionDate <= endDate;
        });

        const tableBody = type === "income" ? document.querySelector("#incomeTable tbody") : document.querySelector("#expenditureTable tbody");
        tableBody.innerHTML = "";

        filteredTransactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.amount}</td>
            `;

            if (transaction.type === "income") {
                row.classList.add("income-row");
            } else {
                row.classList.add("expenditure-row");
            }

            tableBody.appendChild(row);
        });
    }

    function updateTotalAmountButton() {
        const totalAmount = getTotalAmount();
        const totalAmountButton = document.getElementById("totalAmountButton");

        if (totalAmount < 5000) {
            totalAmountButton.style.backgroundColor = "red";
        } else if (totalAmount >= 5000 && totalAmount < 10000) {
            totalAmountButton.style.backgroundColor = "yellow";
        } else if (totalAmount >= 10000 && totalAmount < 50000) {
            totalAmountButton.style.backgroundColor = "pink";
        } else {
            totalAmountButton.style.backgroundColor = "green";
        }
    }

    document.getElementById("totalAmountButton").addEventListener("click", () => {
        window.location.href = "totalAmount.html";
    });

    // Functions for total amount page
    if (document.getElementById("totalAmountTable")) {
        displayTotalAmount();

        function displayTotalAmount() {
            const transactions = getTransactions();
            const totalAmountTableBody = document.querySelector("#totalAmountTable tbody");
            totalAmountTableBody.innerHTML = "";

            transactions.forEach((transaction) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${transaction.date}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.type}</td>
                    <td>${transaction.amount}</td>
                `;

                if (transaction.type === "income") {
                    row.classList.add("income-row");
                } else {
                    row.classList.add("expenditure-row");
                }

                totalAmountTableBody.appendChild(row);
            });

            const totalAmount = transactions.reduce((total, transaction) => {
                return transaction.type === "income" ? total + transaction.amount : total - transaction.amount;
            }, 0);

            document.getElementById("totalAmount").innerText = `Total Amount: ${totalAmount}`;
        }
    }
});
