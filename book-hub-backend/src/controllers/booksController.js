const Book = require('../models/book')

exports.list = async (req, res, next) => {
  try {
    const {
      query,
      genres,
      authors,
      sortBy = 'date',
      page = 1,
      pageSize = 12,
      startDate,
      endDate
    } = req.query;

    let filter = {};

    // Text search
    if (query) {
      filter.$or = [
        { title: new RegExp(query, 'i') },
        { 'authors.name': new RegExp(query, 'i') }
      ];
    }

    // Genre filter
    if (genres) {
      filter.genre = { 
        $in: genres.split(',').map(g => new RegExp(g, 'i'))
      };
    }

    // Authors filter
    if (authors) {
      filter['authors.name'] = { 
        $in: authors.split(',').map(a => new RegExp(a, 'i'))
      };
    }

    // Date range filter
    if (startDate || endDate) {
      filter.publicationDate = {};
      if (startDate) filter.publicationDate.$gte = new Date(startDate);
      if (endDate) filter.publicationDate.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // Sort configuration
    let sort = {};
    switch (sortBy) {
      case 'date':
        sort.publicationDate = -1;
        break;
      case 'rating':
        sort.rating = -1;
        break;
      case 'title':
        sort.title = 1;
        break;
      default:
        sort.publicationDate = -1;
    }

    // Execute query
    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments(filter)
    ]);

    res.json({
      data: books,
      meta: {
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / parseInt(pageSize))
      }
    });
  } catch (err) {
    next(err);
  }
}

exports.create = async (req, res, next) => {
  try {
    console.log('Creating new book:', req.body);
    
    if (!req.body.title || !req.body.authors) {
      return res.status(400).json({
        message: 'Title and authors are required'
      });
    }

    const book = await Book.create(req.body);
    console.log('Book created successfully:', book._id);
    
    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (err) {
    console.error('Error creating book:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    next(err);
  }
}
