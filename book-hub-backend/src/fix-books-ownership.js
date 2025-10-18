require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Book = require('./models/book');

async function fixBooksOwnership() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the Patrick user
    const user = await User.findOne({ email: 'pazzoinkba@gmail.com' });
    if (!user) {
      console.log('Patrick user not found. Creating...');
      const newUser = await User.create({
        username: 'Patrick',
        email: 'pazzoinkba@gmail.com',
        password: 'Patrick023'
      });
      console.log(`Created user: ${newUser.username} (ID: ${newUser._id})`);
    } else {
      console.log(`Found Patrick user: ${user._id}`);
    }

    const patrick = await User.findOne({ email: 'pazzoinkba@gmail.com' });

    // Update all books to be owned by Patrick
    const result = await Book.updateMany(
      {},
      { $set: { createdBy: patrick._id } }
    );

    console.log(`\nUpdated ${result.modifiedCount} books to be owned by Patrick`);
    console.log(`Books matched: ${result.matchedCount}`);

    // Verify the update
    const books = await Book.countDocuments({ createdBy: patrick._id });
    console.log(`\nVerification: ${books} books are now owned by Patrick`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixBooksOwnership();
