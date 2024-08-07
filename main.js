document.addEventListener('DOMContentLoaded', () => {
    const incomeTableBody = document.getElementById('incomeTableBody');
    const expenditureTableBody = document.getElementById('expenditureTableBody');
    const totalAmountButton = document.getElementById('totalAmountButton');
    const addIncomeButton = document.getElementById('addIncomeButton');
    const addExpenditureButton = document.getElementById('addExpenditureButton');
    const filterIncomeButton = document.getElementById('filterIncomeButton');
    const clearIncomeFilterButton = document.getElementById('clearIncomeFilterButton');
    const filterExpenditureButton = document.getElementById('filterExpenditureButton');
    const clearExpenditureFilterButton = document.getElementById('clearExpenditureFilterButton');

    function getStoredData() {
        const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
        const expenditures = JSON.parse(localStorage.getItem('expenditures')) || [];
        return { incomes, expenditures };
    }

    function populateTables() {
        const { incomes, expenditures } = getStoredData();
        incomeTableBody.innerHTML = '';
        expenditureTableBody.innerHTML = '';

        incomes.forEach(item => {
            const row = incomeTableBody.insertRow();
            row.insertCell(0).textContent = item.date;
            row.insertCell(1).textContent = item.description;
            row.insertCell(2).textContent = `$${parseFloat(item.amount).toFixed(2)}`;
        });

        expenditures.forEach(item => {
            const row = expenditureTableBody.insertRow();
            row.insertCell(0).textContent = item.date;
            row.insertCell(1).textContent = item.description;
            row.insertCell(2).textContent = `$${parseFloat(item.amount).toFixed(2)}`;
        });

        updateTotalAmountButtonColor();
    }

    function filterTable(tableId, filters) {
        const tableBody = document.getElementById(tableId);
        const rows = tableBody.getElementsByTagName('tr');
        const { description, date, amount } = filters;

        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('td');
            const rowDescription = cells[1].textContent.toLowerCase();
            const rowDate = cells[0].textContent;
            const rowAmount = parseFloat(cells[2].textContent.replace('$', ''));

            const matchesDescription = rowDescription.includes(description.toLowerCase());
            const matchesDate = date ? rowDate.includes(date) : true;
            const matchesAmount = rowAmount >= amount.min && rowAmount <= amount.max;

            if (matchesDescription && matchesDate && matchesAmount) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function clearFilters(tableId) {
        document.getElementById(`${tableId.replace('TableBody', 'FilterDescription')}`).value = '';
        document.getElementById(`${tableId.replace('TableBody', 'FilterDate')}`).value = '';
        document.getElementById(`${tableId.replace('TableBody', 'FilterAmountMin')}`).value = '';
        document.getElementById(`${tableId.replace('TableBody', 'FilterAmountMax')}`).value = '';

        const filters = {
            description: '',
            date: '',
            amount: { min: -Infinity, max: Infinity }
        };
        filterTable(tableId, filters);
    }

    function updateTotalAmountButtonColor() {
        const totalAmountButton = document.getElementById('totalAmountButton');
        const { incomes, expenditures } = getStoredData();

        const totalIncome = incomes.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const totalExpenditure = expenditures.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const totalAmount = totalIncome - totalExpenditure;

        let buttonColor;
        if (totalAmount < 5000) {
            buttonColor = 'red';
        } else if (totalAmount >= 5000 && totalAmount <= 10000) {
            buttonColor = 'yellow';
        } else if (totalAmount > 10000 && totalAmount <= 50000) {
            buttonColor = 'pink';
        } else {
            buttonColor = 'green';
        }
        totalAmountButton.style.backgroundColor = buttonColor;
    }

    addIncomeButton.addEventListener('click', () => {
        window.location.href = 'income.html';
    });

    addExpenditureButton.addEventListener('click', () => {
        window.location.href = 'expenditure.html';
    });

    totalAmountButton.addEventListener('click', () => {
        window.location.href = 'totalAmount.html';
    });

    filterIncomeButton.addEventListener('click', () => {
        const description = document.getElementById('incomeFilterDescription').value;
        const date = document.getElementById('incomeFilterDate').value;
        const amount = {
            min: parseFloat(document.getElementById('incomeFilterAmountMin').value) || -Infinity,
            max: parseFloat(document.getElementById('incomeFilterAmountMax').value) || Infinity
        };

        filterTable('incomeTableBody', { description, date, amount });
    });

    clearIncomeFilterButton.addEventListener('click', () => {
        clearFilters('incomeTableBody');
    });

    filterExpenditureButton.addEventListener('click', () => {
        const description = document.getElementById('expenditureFilterDescription').value;
        const date = document.getElementById('expenditureFilterDate').value;
        const amount = {
            min: parseFloat(document.getElementById('expenditureFilterAmountMin').value) || -Infinity,
            max: parseFloat(document.getElementById('expenditureFilterAmountMax').value) || Infinity
        };

        filterTable('expenditureTableBody', { description, date, amount });
    });

    clearExpenditureFilterButton.addEventListener('click', () => {
        clearFilters('expenditureTableBody');
    });

    populateTables();
});

