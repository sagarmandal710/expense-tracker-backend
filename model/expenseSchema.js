const { Schema, model } = require('mongoose');

const expenseSchema = new Schema({
    expenseName: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    expenseType: { type: String, default: "debit" },
    mail: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }, 
})

module.exports = model("Expense", expenseSchema);