const languageData = {
    en: {
        balanceTitle: "Your Balance", incomeTitle: "Income", expenseTitle: "Expense", historyTitle: "History", addTransactionTitle: "Add New Transaction", typeLabel: "Type", incomeRadioLabel: "Income", expenseRadioLabel: "Expense", descriptionLabel: "Description", amountLabel: "Amount", addButton: "Add transaction", alertFillFields: "Please add a description and amount", alertPositiveAmount: "Amount must be a positive number", notifSuccessAdd: "Transaction added successfully", notifSuccessRemove: "Transaction removed",
    },
    hi: {
        balanceTitle: "आपका शेष", incomeTitle: "आय", expenseTitle: "खर्च", historyTitle: "इतिहास", addTransactionTitle: "नया लेन-देन जोड़ें", typeLabel: "प्रकार", incomeRadioLabel: "आय", expenseRadioLabel: "खर्च", descriptionLabel: "विवरण", amountLabel: "राशि", addButton: "लेन-देन जोड़ें", alertFillFields: "कृपया विवरण और राशि जोड़ें", alertPositiveAmount: "राशि एक सकारात्मक संख्या होनी चाहिए", notifSuccessAdd: "लेन-देन सफलतापूर्वक जोड़ा गया", notifSuccessRemove: "लेन-देन हटा दिया गया",
    }
};
let currentLanguage = 'en';

const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const notificationContainer = document.getElementById('notification-container');
const languageToggle = document.getElementById('languageToggle');

function updateLanguage() {
    const lang = languageData[currentLanguage];
    document.getElementById('balanceTitle').textContent = lang.balanceTitle;
    document.getElementById('incomeTitle').textContent = lang.incomeTitle;
    document.getElementById('expenseTitle').textContent = lang.expenseTitle;
    document.getElementById('historyTitle').textContent = lang.historyTitle;
    document.getElementById('addTransactionTitle').textContent = lang.addTransactionTitle;
    document.getElementById('typeLabel').textContent = lang.typeLabel;
    document.getElementById('incomeRadioLabel').textContent = lang.incomeRadioLabel;
    document.getElementById('expenseRadioLabel').textContent = lang.expenseRadioLabel;
    document.getElementById('descriptionLabel').textContent = lang.descriptionLabel;
    document.getElementById('amountLabel').textContent = lang.amountLabel;
    document.getElementById('addButton').textContent = lang.addButton;
    text.placeholder = currentLanguage === 'en' ? 'Enter description...' : 'विवरण दर्ज करें...';
    amount.placeholder = currentLanguage === 'en' ? 'Enter amount...' : 'राशि दर्ज करें...';
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';

    if (currentLanguage === 'en') {
        languageToggle.innerHTML = '🇮🇳 हिंदी';
    } else {
        languageToggle.innerHTML = '🇮🇳 English';
    }

    updateLanguage();
}

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function showNotification(message, type = 'error') {
    const notif = document.createElement('div');
    notif.classList.add('notification', type);
    notif.innerText = message;
    notificationContainer.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

function addTransaction(e) {
    e.preventDefault();
    const type = document.querySelector('input[name="transaction-type"]:checked').value;

    if (text.value.trim() === '' || amount.value.trim() === '') {
        showNotification(languageData[currentLanguage].alertFillFields);
    } else if (+amount.value <= 0) {
        showNotification(languageData[currentLanguage].alertPositiveAmount);
    } else {
        const transactionAmount = type === 'expense' ? -Math.abs(+amount.value) : +amount.value;
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: transactionAmount
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        showNotification(languageData[currentLanguage].notifSuccessAdd, 'success');
        text.value = '';
        amount.value = '';
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);
    balance.innerText = `₹${total}`;
    money_plus.innerText = `+₹${income}`;
    money_minus.innerText = `-₹${expense}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
    showNotification(languageData[currentLanguage].notifSuccessRemove, 'success');
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    updateLanguage();
}

init();
form.addEventListener('submit', addTransaction);
languageToggle.addEventListener('click', toggleLanguage);