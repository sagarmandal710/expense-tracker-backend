const mongoose = require('mongoose');
const URI = process.env.URI;

async function connectDB() {
    try {
        mongoose.set({strictQuery: false});
        await mongoose.connect(URI);
        console.log(`Successfully connected to database`);
    } catch (error) {
        console.log(`Failed to connect to database: ${error}`);
    }
}
connectDB();