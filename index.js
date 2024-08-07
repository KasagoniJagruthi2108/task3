document.addEventListener("DOMContentLoaded", () => {
    const addIncomeButton = document.getElementById("addIncomeButton");
    const addExpenditureButton = document.getElementById("addExpenditureButton");
    const totalAmountButton = document.getElementById("totalAmountButton");

    addIncomeButton.addEventListener("click", () => {
        window.location.href = "income.html";
    });

    addExpenditureButton.addEventListener("click", () => {
        window.location.href = "expenditure.html";
    });

    totalAmountButton.addEventListener("click", () => {
        window.location.href = "totalAmount.html";
    });

    function getTransactions() {
        return JSON.parse(localStorage.getItem("transactions")) || [];
    }

    function getTotalAmount() {
        const transactions = getTransactions();
        return transactions.reduce((total, transaction) => {
            return transaction.type === "income" ? total + transaction.amount : total - transaction.amount;
        }, 0);
    }

    function formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString("en-GB"); // date/month/year format
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
                <td>${formatDate(transaction.date)}</td>
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

        document.getElementById("totalAmountDisplay").innerText = `Total Amount: ${totalAmount}`;
    }

    displayTransactions();

    function filterTransactions(tableId, type, startDate, endDate, minAmount, maxAmount) {
        const transactions = getTransactions().filter((transaction) => {
            const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
            const isDateInRange = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
            const isAmountInRange = (!minAmount || transaction.amount >= minAmount) && (!maxAmount || transaction.amount <= maxAmount);
            return transaction.type === type && isDateInRange && isAmountInRange;
        });

        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = "";

        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.description}</td>
                <td>${transaction.amount}</td>
            `;
            row.classList.add(type === "income" ? "income-row" : "expenditure-row");
            tableBody.appendChild(row);
        });
    }

    document.getElementById("filterIncomeButton").addEventListener("click", () => {
        const startDate = document.getElementById("incomeStartDate").value;
        const endDate = document.getElementById("incomeEndDate").value;
        const minAmount = document.getElementById("incomeMinAmount").value;
        const maxAmount = document.getElementById("incomeMaxAmount").value;
        filterTransactions("incomeTable", "income", startDate, endDate, minAmount, maxAmount);
    });

    document.getElementById("clearIncomeFilterButton").addEventListener("click", () => {
        displayTransactions();
    });

    document.getElementById("filterExpenditureButton").addEventListener("click", () => {
        const startDate = document.getElementById("expenditureStartDate").value;
        const endDate = document.getElementById("expenditureEndDate").value;
        const minAmount = document.getElementById("expenditureMinAmount").value;
        const maxAmount = document.getElementById("expenditureMaxAmount").value;
        filterTransactions("expenditureTable", "expenditure", startDate, endDate, minAmount, maxAmount);
    });

    document.getElementById("clearExpenditureFilterButton").addEventListener("click", () => {
        displayTransactions();
    });
});
