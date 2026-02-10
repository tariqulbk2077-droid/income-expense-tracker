const STORAGE_KEY = 'transactions';

const transactionForm = document.getElementById('transaction-form');
const transactionInput = document.getElementById('transaction-input');
const amountInput = document.getElementById('amount-input');
const transactionList = document.getElementById('transaction-list');
const clearAllButton = document.getElementById('clear-all');
const balanceDisplay = document.getElementById('balance');

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered:', reg))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

window.addEventListener('load', () => {
    loadTransactions();
    updateDashboard();
});

// Event listeners for form submission and clear all transactions button
transactionForm.addEventListener('submit', addTransaction);
clearAllButton.addEventListener('click', clearAllTransactions);

// Load transactions from LocalStorage
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    transactions.forEach(transaction => {
        renderTransaction(transaction);
    });
}

// Save transactions to LocalStorage
function saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// Add transaction function
function addTransaction(event) {
    event.preventDefault();
    const transaction = {
        id: Date.now(),
        name: transactionInput.value,
        amount: parseFloat(amountInput.value),
    };
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    transactions.push(transaction);
    saveTransactions(transactions);
    renderTransaction(transaction);
    updateDashboard();
    transactionForm.reset();
}

// Delete transaction function
function deleteTransaction(id) {
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions(updatedTransactions);
    updateTransactionList();
    updateDashboard();
}

// Clear all transactions function
function clearAllTransactions() {
    localStorage.removeItem(STORAGE_KEY);
    transactionList.innerHTML = '';
    updateDashboard();
}

// Render transactions function
function renderTransaction(transaction) {
    const listItem = document.createElement('li');
    listItem.textContent = `${transaction.name}: $${transaction.amount}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTransaction(transaction.id));
    listItem.appendChild(deleteButton);
    transactionList.appendChild(listItem);
}

// Update dashboard function
function updateDashboard() {
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    balanceDisplay.textContent = `Total: $${total}`;
}

// Utility function for HTML escaping
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// DOMContentLoaded initialization
document.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
    updateDashboard();
});

// Visibility change handler for background sync (placeholder)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Handle background sync or refresh logic
    }
});