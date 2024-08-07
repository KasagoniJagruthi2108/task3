document.addEventListener("DOMContentLoaded", () => {
    function getTransactions() {
        return JSON.parse(localStorage.getItem("transactions")) || [];
    }

    function formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString("en-GB"); // date/month/year format
    }

    function displayTotalAmount() {
        const transactions = getTransactions();
        const totalAmountTableBody = document.querySelector("#totalAmountTable tbody");
        totalAmountTableBody.innerHTML = "";

        transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${formatDate(transaction.date)}</td>
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
        updateTotalAmountButtonColor(totalAmount);
    }

    function updateTotalAmountButtonColor(totalAmount) {
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

    displayTotalAmount();
});
