const navbar = document.getElementById('navbar');
const genreSelect = document.getElementById('genreSelect');
const searchInput = document.getElementById('searchInput');
const moviesGrid = document.getElementById('moviesGrid');
const reviewModal = document.getElementById('reviewModal');
const closeModal = document.getElementById('reviewCloseBtn');
const reviewForm = document.getElementById('reviewForm');

let allMoviesCache = [];

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

genreSelect.addEventListener('change', () => {
  fetchMovies(genreSelect.value);
});

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  const filtered = allMoviesCache.filter(m => 
    m.title.toLowerCase().includes(query) || 
    m.genre.toLowerCase().includes(query)
  );
  renderMovies(filtered);
});

async function fetchMovies(genre = 'All') {
  try {
    const res = await fetch(`/api/movies?genre=${genre}`);
    allMoviesCache = await res.json();
    renderMovies(allMoviesCache);
  } catch (err) {
    console.error('Error fetching movies:', err);
  }
}

function renderMovies(movies) {
  moviesGrid.innerHTML = '';

  if (movies.length === 0) {
    moviesGrid.innerHTML = '<p style="color:#aaa; grid-column: 1/-1;">No titles found.</p>';
    return;
  }

  const myListIds = getWatchlist().map(m => m._id);

  movies.forEach(item => {
    const isSaved = myListIds.includes(item._id);
    const typeLabel = item.type === 'series' ? `Series (${item.seasons} ${item.seasons > 1 ? 'Seasons' : 'Season'})` : 'Movie';

    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${item.poster}" alt="${item.title}">
      <div class="movie-info">
        <span class="rating-badge">★ ${item.rating}</span>
        <h3>${item.title} (${item.releaseYear})</h3>
        <p style="margin: 6px 0 12px; color: #e50914; font-size: 0.85rem; font-weight: 600;">
          ${typeLabel} • ${item.genre}
        </p>
        <div class="card-actions">
          <button class="btn btn-trailer" onclick="openTrailerModal('${item.title.replace(/'/g, "\\'")}', '${item.trailerUrl}')">▶ Trailer</button>
          <button class="btn" onclick="openReviewModal('${item._id}')">Reviews</button>
          <button class="btn-secondary ${isSaved ? 'added' : ''}" onclick="toggleWatchlist('${item._id}')">
            ${isSaved ? '✓ Added' : '+ List'}
          </button>
        </div>
      </div>
    `;
    moviesGrid.appendChild(card);
  });
}

// Review Modal Functions
async function openReviewModal(movieId) {
  document.getElementById('modalMovieId').value = movieId;
  
  const movieRes = await fetch(`/api/movies/${movieId}`);
  const movie = await movieRes.json();
  
  document.getElementById('modalMovieTitle').innerText = movie.title;
  document.getElementById('modalMovieDesc').innerText = movie.description;

  fetchReviews(movieId);
  reviewModal.style.display = 'flex';
}

async function fetchReviews(movieId) {
  const res = await fetch(`/api/reviews/${movieId}`);
  const reviews = await res.json();
  
  const reviewsList = document.getElementById('reviewsList');
  reviewsList.innerHTML = '';

  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p style="color:#888;">No reviews yet. Be the first!</p>';
    return;
  }

  reviews.forEach(r => {
    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <strong>${r.author}</strong> - <span style="color:#f5c518">★ ${r.rating}</span>
      <p style="margin-top:4px;">${r.comment}</p>
    `;
    reviewsList.appendChild(item);
  });
}

if (closeModal) {
  closeModal.onclick = () => reviewModal.style.display = 'none';
}

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const movieId = document.getElementById('modalMovieId').value;
  const author = document.getElementById('author').value;
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;

  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, author, rating, comment })
    });

    if (res.ok) {
      reviewForm.reset();
      fetchReviews(movieId);
      fetchMovies(genreSelect.value);
    }
  } catch (err) {
    console.error('Failed to submit review:', err);
  }
});