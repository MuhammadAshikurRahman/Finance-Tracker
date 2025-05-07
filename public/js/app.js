// -----------------------------
// টাকার হিসাব পরিচালনার স্ক্রিপ্ট Font-End
// -----------------------------

// 🟢 ফর্ম ও বাটন নির্বাচন করা
const addMoneyBtn = document.getElementById('addMoneyBtn');
const minusMoneyBtn = document.getElementById('minusMoneyBtn');
const addMoneyForm = document.getElementById('addMoney');
const minusMoneyForm = document.getElementById('minusMoney');
const submitAddMoneyBtn = document.getElementById('submitAddMoney');
const submitMinusMoneyBtn = document.getElementById('submitMinusMoney');
const clearDataBtn = document.getElementById('clearDataBtn');

// 🟢 টাকার পরিমাণ দেখানোর জন্য নির্বাচিত এলিমেন্ট
const currentAmountDisplay = document.getElementById('currentAmount');
const totalIncomeDisplay = document.getElementById('totalIncome');
const totalExpenseDisplay = document.getElementById('totalExpense');
const addTransactionHistory = document.getElementById('addtransactionHistory');
const minusTransactionHistory = document.getElementById('minustransactionHistory');

// ===========================
// 🔄 ফর্ম টগল করার ফাংশন
// ===========================
function toggleForm(formToShow, formToHide) {
     // এখানে toggleForm() ফাংশনে addMoneyForm এবং minusMoneyForm নামে দুইটি প্যারামিটার পাস করা হয়েছে।
    const computedStyle = window.getComputedStyle(formToShow);
    // getComputedStyle() হল একটি মেথড, যা ব্রাউজার থেকে কোনও HTML এলিমেন্টের বর্তমান স্টাইল (CSS প্রপার্টি) বের করার জন্য ব্যবহার করা হয়।
    if (computedStyle.display === "none") {
        formToShow.style.display = "block"; // ফর্ম দেখাও
        formToHide.style.display = "none";  // অন্য ফর্ম লুকাও
    } else {
        formToShow.style.display = "none"; // ফর্ম লুকাও
    }
}

// 🟢 টগল ফাংশনের জন্য ইভেন্ট লিসনার
addMoneyBtn.addEventListener("click", () => {
    toggleForm(addMoneyForm, minusMoneyForm);
});
minusMoneyBtn.addEventListener("click", () => {
    toggleForm(minusMoneyForm, addMoneyForm);
});

// ===========================
// 🔄 "সার্ভার" থেকে বর্তমান ডাটা লোড করা
// ===========================
async function loadInitialData() {
    const response = await fetch("http://localhost:4000/transactions");
    const transactions = await response.json();
    
    // ব্যালেন্স ও হিসাব গণনা
    currentAmount = transactions.reduce((acc, t) => t.type === "income" ? acc + t.amount : acc - t.amount, 0);
    totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    
    updateDisplay();
    
    // ট্রানজেকশন হিস্টোরি যোগ করা
    transactions.forEach(t => {
        if (t.type === "income") {
            addTransaction(t.text, t.amount, addTransactionHistory);
        } else {
            addTransaction(t.text, t.amount, minusTransactionHistory);
        }
    });
}

// পেজ লোড হলে ডাটা লোড করো
window.onload = loadInitialData;




// ===========================
// ➕ টাকা যোগ করার ফাংশন
// ===========================
submitAddMoneyBtn.addEventListener("click", async () => {
    const text = addMoneyForm.querySelector('#text').value;
    const amount = parseFloat(addMoneyForm.querySelector('#amount').value);

    if (text && !isNaN(amount)) {
        const response = await fetch("/add-money", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, amount })
        });

        if (response.ok) {
            currentAmount += amount;
            totalIncome += amount;
            updateDisplay();
            addTransaction(text, amount, addTransactionHistory);
            // addTransaction ফাংশন কল করে ""text, amount, addTransactionHistory"" প্যারামিটার পাস করা হয়েছে।
            // এখানে addTransactionHistory হল একটি ➕ টাকা যোগ করার এলিমেন্ট যেখানে ট্রানজেকশন হিস্টোরি দেখানো হয়।
            addMoneyForm.querySelector('#text').value = '';
            addMoneyForm.querySelector('#amount').value = '';
        }
    }
});




// ===========================
// ➖ টাকা কমানোর ফাংশন
// ===========================



/* submitAddMoneyBtn.addEventListener("click", () => {
    const text = addMoneyForm.querySelector('#text').value;
    const amount = parseFloat(addMoneyForm.querySelector('#amount').value);

    if (text && !isNaN(amount)) {
        currentAmount += amount;
        totalIncome += amount;
        updateDisplay();
        addTransaction(text, amount, addTransactionHistory);
        addMoneyForm.querySelector('#text').value = '';
        addMoneyForm.querySelector('#amount').value = '';
    }
}); */








// ===========================
// ➖ টাকা কমানোর ফাংশন
// ===========================
submitMinusMoneyBtn.addEventListener("click", async () => {
    const text = minusMoneyForm.querySelector('#text').value;
    const amount = parseFloat(minusMoneyForm.querySelector('#amount').value);

    if (text && !isNaN(amount)) {
        const response = await fetch("/minus-money", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, amount })
        });

        if (response.ok) {
            currentAmount -= amount;
            totalExpense += amount;
            updateDisplay();
            addTransaction(text, amount, minusTransactionHistory);
            // addTransaction ফাংশন কল করে ""text, amount, minusTransactionHistory"" প্যারামিটার পাস করা হয়েছে।
            // এখানে addTransactionHistory হল একটি ➖ টাকা কমানোর এলিমেন্ট যেখানে ট্রানজেকশন হিস্টোরি দেখানো হয়।
            minusMoneyForm.querySelector('#text').value = '';
            minusMoneyForm.querySelector('#amount').value = '';
        }
    }
});



// ===========================
// ➕ টাকা যোগ করার ফাংশন
// ===========================

/* submitMinusMoneyBtn.addEventListener("click", () => {
    const text = minusMoneyForm.querySelector('#text').value;
    const amount = parseFloat(minusMoneyForm.querySelector('#amount').value);

    if (text && !isNaN(amount)) {
        currentAmount -= amount;
        totalExpense += amount;
        updateDisplay();
        addTransaction(text, amount, minusTransactionHistory);
        minusMoneyForm.querySelector('#text').value = '';
        minusMoneyForm.querySelector('#amount').value = '';
    }
}); */



// ===========================
// 🔄 ডিসপ্লে আপডেট ফাংশন              -: JUST DISPLAY :-
// ===========================
function updateDisplay() {
    currentAmountDisplay.textContent = currentAmount + " ৳";
    totalIncomeDisplay.textContent = totalIncome + " ৳";
    totalExpenseDisplay.textContent = totalExpense + " ৳";
}

// ===========================
// 📝 ট্রানজেকশন হিস্টোরি যোগ করা
// ===========================
function addTransaction(text, amount, historyElement) {
    const row = document.createElement('tr');
    const typeCell = document.createElement('td');
    const amountCell = document.createElement('td');

    typeCell.textContent = text;
    amountCell.textContent = amount + " ৳";

    row.appendChild(typeCell);
    row.appendChild(amountCell);
    historyElement.appendChild(row);
}

// ===========================
// ❌ সকল ডাটা মুছে ফেলা
// ===========================
clearDataBtn.addEventListener("click", async () => {
    const response = await fetch("http://localhost:4000/clear-all", { method: "DELETE" });

    if (response.ok) {
        currentAmount = 0;
        totalIncome = 0;
        totalExpense = 0;
        updateDisplay();
        addTransactionHistory.innerHTML = "";
        minusTransactionHistory.innerHTML = "";
    }
});
