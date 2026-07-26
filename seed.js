const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const sampleContent = [
  // MOVIES
  {
    title: "The Dark Knight",
    genre: "Action",
    type: "movie",
    rating: 9.0,
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    description: "When the menace known as the Joker wreaks havoc and chaos on Gotham City, Batman must accept one of the greatest psychological tests.",
    releaseYear: 2008,
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY"
  },
  {
    title: "Inception",
    genre: "Sci-Fi",
    type: "movie",
    rating: 8.8,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
    releaseYear: 2010,
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
  },
  {
    title: "Interstellar",
    genre: "Sci-Fi",
    type: "movie",
    rating: 8.7,
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E"
  },
  {
    title: "Pulp Fiction",
    genre: "Crime",
    type: "movie",
    rating: 8.9,
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbhY"
  },
  {
    title: "Parasite",
    genre: "Drama",
    type: "movie",
    rating: 8.5,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    releaseYear: 2019,
    trailerUrl: "https://www.youtube.com/embed/5xH0HfJHsaY"
  },

  // WEB SERIES
  {
    title: "Breaking Bad",
    genre: "Crime",
    type: "series",
    rating: 9.5,
    poster: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=600&q=80",
    description: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
    releaseYear: 2008,
    seasons: 5,
    trailerUrl: "https://www.youtube.com/embed/HhesaQXLuRY"
  },
  {
    title: "Stranger Things",
    genre: "Sci-Fi",
    type: "series",
    rating: 8.7,
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments and terrifying supernatural forces.",
    releaseYear: 2016,
    seasons: 4,
    trailerUrl: "https://www.youtube.com/embed/b9EkMc79ZSU"
  },
  {
    title: "The Office",
    genre: "Comedy",
    type: "series",
    rating: 9.0,
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes and inappropriate behavior.",
    releaseYear: 2005,
    seasons: 9,
    trailerUrl: "https://www.youtube.com/embed/tA2fJ_r0D9g"
  },
  {
    title: "Game of Thrones",
    genre: "Drama",
    type: "series",
    rating: 9.2,
    poster: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=600&q=80",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.",
    releaseYear: 2011,
    seasons: 8,
    trailerUrl: "https://www.youtube.com/embed/gcTkNV5Vg1E"
  },
  {
    title: "Sherlock",
    genre: "Crime",
    type: "series",
    rating: 9.1,
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
    description: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st-century London.",
    releaseYear: 2010,
    seasons: 4,
    trailerUrl: "https://www.youtube.com/embed/xK7S9mrFWL4"
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Movie.deleteMany();
    await Movie.insertMany(sampleContent);
    console.log("Database Seeded Successfully with Guaranteed Unsplash CDN Images!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();