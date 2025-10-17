require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/book');

const sampleBooks = [
  // Science Fiction Books
  {
    title: "Foundation",
    authors: [{ name: "Isaac Asimov", bio: "American writer and professor of biochemistry" }],
    genre: ["Science Fiction"],
    description: "The first novel in Isaac Asimov's Foundation Trilogy, chronicling the collapse and rebirth of a galactic empire.",
    publishedDate: new Date("1951-08-30"),
    rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/id/12726833-L.jpg",
    pages: 255,
    isbn: "978-0553293357"
  },
  {
    title: "Ender's Game",
    authors: [{ name: "Orson Scott Card", bio: "American novelist" }],
    genre: ["Science Fiction", "Young Adult"],
    description: "Young Ender Wiggin is recruited to train at Battle School where he fights against alien invaders.",
    publishedDate: new Date("1985-01-15"),
    rating: 4.6,
    coverUrl: "https://covers.openlibrary.org/b/id/12577229-L.jpg",
    pages: 324,
    isbn: "978-0812550702"
  },
  {
    title: "Dune",
    authors: [{ name: "Frank Herbert", bio: "American science fiction author" }],
    genre: ["Science Fiction", "Fantasy"],
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    publishedDate: new Date("1965-08-01"),
    rating: 4.6,
    coverUrl: "https://covers.openlibrary.org/b/id/12860996-L.jpg",
    pages: 412,
    isbn: "978-0441172719"
  },
  // Fantasy Books
  {
    title: "The Name of the Wind",
    authors: [{ name: "Patrick Rothfuss", bio: "American fantasy writer" }],
    genre: ["Fantasy"],
    description: "The riveting first-person narrative of a young man who grows to become the most notorious magician his world has ever seen.",
    publishedDate: new Date("2007-03-27"),
    rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/id/12577877-L.jpg",
    pages: 662,
    isbn: "978-0756404741"
  },
  {
    title: "The Way of Kings",
    authors: [{ name: "Brandon Sanderson", bio: "American fantasy writer" }],
    genre: ["Fantasy"],
    description: "The first book in The Stormlight Archive series, following multiple characters in a complex fantasy world.",
    publishedDate: new Date("2010-08-31"),
    rating: 4.8,
    coverUrl: "https://covers.openlibrary.org/b/id/12577849-L.jpg",
    pages: 1007,
    isbn: "978-0765326355"
  },
  // Romance Books
  {
    title: "The Notebook",
    authors: [{ name: "Nicholas Sparks", bio: "American romance novelist" }],
    genre: ["Romance"],
    description: "A story of miracles and emotions that unfolds with beauty and power.",
    publishedDate: new Date("1996-10-01"),
    rating: 4.3,
    coverUrl: "https://covers.openlibrary.org/b/id/12577675-L.jpg",
    pages: 214,
    isbn: "978-0446520805"
  },
  {
    title: "Outlander",
    authors: [{ name: "Diana Gabaldon", bio: "American author" }],
    genre: ["Romance", "Historical", "Fantasy"],
    description: "The story of Claire Randall, a nurse who accidentally travels through time to 18th-century Scotland.",
    publishedDate: new Date("1991-06-01"),
    rating: 4.6,
    coverUrl: "https://covers.openlibrary.org/b/id/12577693-L.jpg",
    pages: 850,
    isbn: "978-0440212560"
  },
  // Mystery/Thriller Books
  {
    title: "Gone Girl",
    authors: [{ name: "Gillian Flynn", bio: "American writer" }],
    genre: ["Mystery", "Thriller"],
    description: "A woman mysteriously disappears on her wedding anniversary.",
    publishedDate: new Date("2012-06-05"),
    rating: 4.2,
    coverUrl: "https://covers.openlibrary.org/b/id/12577559-L.jpg",
    pages: 432,
    isbn: "978-0307588371"
  },
  {
    title: "The Silent Patient",
    authors: [{ name: "Alex Michaelides", bio: "British-Cypriot author" }],
    genre: ["Mystery", "Thriller"],
    description: "A woman shoots her husband and then never speaks another word.",
    publishedDate: new Date("2019-02-05"),
    rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/id/12577601-L.jpg",
    pages: 325,
    isbn: "978-1250301697"
  },
  // Classic Literature
  {
    title: "Pride and Prejudice",
    authors: [{ name: "Jane Austen", bio: "English novelist" }],
    genre: ["Classic", "Romance"],
    description: "The story follows the main character Elizabeth Bennet as she deals with issues of manners, upbringing, and marriage.",
    publishedDate: new Date("1813-01-28"),
    rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/id/12645114-L.jpg",
    pages: 432,
    isbn: "978-0141439518"
  },
  {
    title: "Jane Eyre",
    authors: [{ name: "Charlotte Brontë", bio: "English novelist" }],
    genre: ["Classic", "Romance"],
    description: "The story of a young woman's journey from a harsh childhood to becoming a governess.",
    publishedDate: new Date("1847-10-16"),
    rating: 4.6,
    coverUrl: "https://covers.openlibrary.org/b/id/12577903-L.jpg",
    pages: 532,
    isbn: "978-0141441146"
  },
  // Young Adult Books
  {
    title: "The Fault in Our Stars",
    authors: [{ name: "John Green", bio: "American author" }],
    genre: ["Young Adult", "Romance"],
    description: "A story about two teenagers who fall in love while battling cancer.",
    publishedDate: new Date("2012-01-10"),
    rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/id/12577779-L.jpg",
    pages: 313,
    isbn: "978-0525478812"
  },
  {
    title: "Six of Crows",
    authors: [{ name: "Leigh Bardugo", bio: "Israeli-American author" }],
    genre: ["Young Adult", "Fantasy"],
    description: "A group of dangerous outcasts attempts a heist that could make them rich beyond their wildest dreams.",
    publishedDate: new Date("2015-09-29"),
    rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/id/12577813-L.jpg",
    pages: 465,
    isbn: "978-1627792127"
  },
  // Adventure Books
  {
    title: "The Count of Monte Cristo",
    authors: [{ name: "Alexandre Dumas", bio: "French writer" }],
    genre: ["Adventure", "Classic"],
    description: "A story of wrongful imprisonment, escape, and elaborate revenge.",
    publishedDate: new Date("1844-01-28"),
    rating: 4.8,
    coverUrl: "https://covers.openlibrary.org/b/id/12577927-L.jpg",
    pages: 1276,
    isbn: "978-0140449266"
  },
  {
    title: "Treasure Island",
    authors: [{ name: "Robert Louis Stevenson", bio: "Scottish novelist" }],
    genre: ["Adventure", "Classic"],
    description: "A tale of pirates, treasure maps, and adventure on the high seas.",
    publishedDate: new Date("1883-11-14"),
    rating: 4.4,
    coverUrl: "https://covers.openlibrary.org/b/id/12577941-L.jpg",
    pages: 292,
    isbn: "978-0141321003"
  },
  {
    title: "The Great Gatsby",
    authors: [{ name: "F. Scott Fitzgerald", bio: "American novelist" }],
    genre: ["Fiction", "Classic"],
    description: "The Great Gatsby follows a cast of characters living in the fictional town of West Egg on Long Island in the summer of 1922.",
    publishedDate: new Date("1925-04-10"),
    rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/id/6474545-L.jpg",
    pages: 180,
    isbn: "978-0743273565"
  },
  {
    title: "To Kill a Mockingbird",
    authors: [{ name: "Harper Lee", bio: "American novelist" }],
    genre: ["Fiction", "Classic", "Historical"],
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
    publishedDate: new Date("1960-07-11"),
    rating: 4.8,
    coverUrl: "https://covers.openlibrary.org/b/id/12009823-L.jpg",
    pages: 281,
    isbn: "978-0446310789"
  },
  {
    title: "1984",
    authors: [{ name: "George Orwell", bio: "English novelist" }],
    genre: ["Fiction", "Science Fiction", "Dystopian"],
    description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
    publishedDate: new Date("1949-06-08"),
    rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/id/12025096-L.jpg",
    pages: 328,
    isbn: "978-0451524935"
  },
  {
    title: "Dune",
    authors: [{ name: "Frank Herbert", bio: "American science fiction author" }],
    genre: ["Science Fiction", "Fantasy"],
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    publishedDate: new Date("1965-08-01"),
    rating: 4.6,
    coverUrl: "https://covers.openlibrary.org/b/id/12860996-L.jpg",
    pages: 412,
    isbn: "978-0441172719"
  },
  {
    title: "Pride and Prejudice",
    authors: [{ name: "Jane Austen", bio: "English novelist" }],
    genre: ["Romance", "Classic"],
    description: "The story follows the main character Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage.",
    publishedDate: new Date("1813-01-28"),
    rating: 4.7,
    coverUrl: "https://covers.openlibrary.org/b/id/12645114-L.jpg",
    pages: 432,
    isbn: "978-0141439518"
  },
  {
    title: "The Hobbit",
    authors: [{ name: "J.R.R. Tolkien", bio: "English writer and philologist" }],
    genre: ["Fantasy", "Adventure"],
    description: "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar.",
    publishedDate: new Date("1937-09-21"),
    rating: 4.8,
    coverUrl: "https://covers.openlibrary.org/b/id/12003135-L.jpg",
    pages: 310,
    isbn: "978-0547928227"
  },
  {
    title: "The Da Vinci Code",
    authors: [{ name: "Dan Brown", bio: "American author" }],
    genre: ["Mystery", "Thriller"],
    description: "While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night.",
    publishedDate: new Date("2003-03-18"),
    rating: 4.1,
    coverUrl: "https://covers.openlibrary.org/b/id/12003055-L.jpg",
    pages: 454,
    isbn: "978-0307474278"
  },
  {
    title: "The Hunger Games",
    authors: [{ name: "Suzanne Collins", bio: "American author" }],
    genre: ["Young Adult", "Science Fiction", "Dystopian"],
    description: "In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts.",
    publishedDate: new Date("2008-09-14"),
    rating: 4.5,
    coverUrl: "https://covers.openlibrary.org/b/id/12645455-L.jpg",
    pages: 374,
    isbn: "978-0439023481"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Find or create a test user
    const User = require('./models/user');
    let user = await User.findOne({ email: 'pazzoinkba@gmail.com' });
    
    if (!user) {
      user = await User.create({
        username: 'Patrick',
        email: 'pazzoinkba@gmail.com',
        password: 'Patrick023'
      });
    }
    console.log('Using user:', user._id);

    // Add createdBy to all books
    const booksWithUser = sampleBooks.map(book => ({
      ...book,
      createdBy: user._id
    }));

    // Insert sample books
    await Book.insertMany(booksWithUser);
    console.log('Sample books inserted');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();