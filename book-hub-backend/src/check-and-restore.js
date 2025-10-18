require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Book = require('./models/book');

async function checkAndRestore() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check users
    const userCount = await User.countDocuments();
    console.log(`\nTotal users in database: ${userCount}`);
    
    const users = await User.find().select('email username _id');
    if (users.length > 0) {
      console.log('\nExisting users:');
      users.forEach(u => {
        console.log(`  - ${u.username} (${u.email}) - ID: ${u._id}`);
      });
    } else {
      console.log('\nNo users found! Creating Patrick account...');
      const newUser = await User.create({
        username: 'Patrick',
        email: 'pazzoinkba@gmail.com',
        password: 'Patrick023'
      });
      console.log(`User created: ${newUser.username} - ${newUser.email}`);
    }

    // Check books
    const bookCount = await Book.countDocuments();
    console.log(`\nTotal books in database: ${bookCount}`);
    
    // Check books by owner
    const booksWithOwner = await Book.aggregate([
      {
        $group: {
          _id: '$createdBy',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]);

    console.log('\nBooks by owner:');
    booksWithOwner.forEach(item => {
      const username = item.user.length > 0 ? item.user[0].username : 'Unknown User';
      console.log(`  - ${username}: ${item.count} books`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAndRestore();
