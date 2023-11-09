const { Router } = require('express');
const router = Router();
const User = require('../model/userSchema.js')
const Expense = require('../model/expenseSchema.js');

const statusCode = {
    'ok': 200,
    'error': 400,
    'not-found': 404,
    'server-fail': 500
};

router.get('/', (req, res) => {
    res.json({ mesaage: "successful ping" });
})

// ---------------------------------- get operation ---------------------------------- 
router.get('/expense', async (req, res) => {
    const mail = req.query.mail;
    try {
        const check = await User.findOne({ mail });
        if (!check) {
            return res.status(statusCode['not-found']).json({ error: "User not found" });
        }
        const expense = await Expense.find({ $and: [{ mail }, { isDeleted: false }] }).sort({ date: -1 });
        return res.send(expense);
    } catch (error) {
        return res.status(statusCode.error).json(error);
    }
});

router.get('/trash', async (req, res) => {
    const mail = req.query.mail;
    try {
        const check = await User.findOne({ mail });
        if (!check) {
            return res.status(statusCode['not-found']).json({ error: "User not found" });
        }
        const expense = await Expense.find({ $and: [{ mail }, { isDeleted: true }] }).sort({ date: -1 });
        return res.send(expense);
    } catch (error) {
        return res.status(statusCode.error).json(error);
    }
});

// ---------------------------------- post operation ---------------------------------- 
router.post('/expense', async (req, res) => {
    const { expenseName, description, amount, expenseType, mail, date } = req.body;
    try {
        const check = await User.findOne({ mail });
        if (!check)
            return res.status(statusCode['not-found']).json({ error: "User not found" });
        const expense = new Expense({ expenseName, description, amount, expenseType, mail, date });
        const expenseAdded = await expense.save();
        if (expenseAdded) {
            return res.status(statusCode.ok).json({ ok: "Expense added successfully" });
        } else {
            return res.status(statusCode['server-fail']).json({ error: "Failed to register expense" });
        }
    } catch (error) {
        return res.status(statusCode.error).json(error);
    }
});

// ---------------------------------- delete operation ---------------------------------- 
router.patch('/trash', async (req, res) => {
    const id = req.query.id;
    try {
        const expenseUpdate = await Expense.findByIdAndUpdate(id, { isDeleted: true }, {
            new: true
        });
        if (expenseUpdate) {
            return res.status(statusCode.ok).json(expenseUpdate);
        } else {
            return res.status(statusCode.error).json({ message: "Expense not found" });
        }
    } catch (error) {
        return res.status(statusCode.error).json(error)
    }
})

router.patch('/recover', async (req, res) => {
    const id = req.query.id;
    try {
        const expenseUpdate = await Expense.findByIdAndUpdate(id, { isDeleted: false }, {
            new: true
        });
        if (expenseUpdate) {
            return res.status(statusCode.ok).json(expenseUpdate);
        } else {
            return res.status(statusCode.error).json({ message: "Expense not found" });
        }
    } catch (error) {
        return res.status(statusCode.error).json(error)
    }
})

router.delete('/expense', async (req, res) => {
    const id = req.query.id;
    try {
        const expenseDeleted = await Expense.findByIdAndDelete(id);
        if (expenseDeleted) {
            return res.status(statusCode.ok).json({ ok: "Expense deleted successfully" });
        } else {
            return res.status(statusCode.error).json({ message: "Expense not found" });
        }
    } catch (error) {
        return res.status(statusCode.error).json(error);
    }
})

// ---------------------------------- edit operation ---------------------------------- 
router.patch('/expense', async (req, res) => {
    const id = req.query.id;
    try {
        const expenseUpdate = await Expense.findByIdAndUpdate(id, req.body, {
            new: true
        });
        if (expenseUpdate) {
            return res.status(statusCode.ok).json(expenseUpdate);
        } else {
            return res.status(statusCode.error).json({ message: "Expense not found" });
        }
    } catch (error) {
        return res.status(statusCode.error).json(error)
    }
})

module.exports = router;