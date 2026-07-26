window.currentPage = 'home';
let currentUser = null;

// Trailer Modal Handlers
function openTrailerModal(title, trailerUrl) {
  const modal = document.getElementById('trailerModal');
  const frame = document.getElementById('trailerFrame');
  const titleElem = document.getElementById('trailerTitle');

  titleElem.innerText = `${title} - Official Trailer`;
  frame.src = `${trailerUrl}?autoplay=1`;
  modal.style.display = 'flex';
}

function closeTrailerModal() {
  const modal = document.getElementById('trailerModal');
  const frame = document.getElementById('trailerFrame');
  
  frame.src = '';
  modal.style.display = 'none';
}

// Auth State Check
async function checkAuth() {
  const token = localStorage.getItem('cineToken');
  const authBox = document.getElementById('authBox');

  if (token) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        currentUser = await res.json();
        authBox.innerHTML = `
          <div class="user-profile">
            <span class="user-name">👤 ${currentUser.name.split(' ')[0]}</span>
            <button class="btn-logout" onclick="logout()">Logout</button>
          </div>
        `;
        if (currentUser.name && document.getElementById('author')) {
          document.getElementById('author').value = currentUser.name;
        }
        return;
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
    }
  }

  currentUser = null;
  localStorage.removeItem('cineToken');
  authBox.innerHTML = `<button class="btn btn-login" onclick="openAuthModal('login')">Sign In</button>`;
}

function openAuthModal(mode = 'login') {
  toggleAuthMode(mode);
  document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}

function toggleAuthMode(mode) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (mode === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('cineToken', data.token);
      closeAuthModal();
      checkAuth();
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
  }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('cineToken', data.token);
      closeAuthModal();
      checkAuth();
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (err) {
    console.error('Registration error:', err);
  }
});

function logout() {
  localStorage.removeItem('cineToken');
  checkAuth();
}

// Watchlist Helpers
function getWatchlist() {
  return JSON.parse(localStorage.getItem('cineSuggestList') || '[]');
}

function updateWatchlistBadge() {
  const list = getWatchlist();
  const badge = document.getElementById('watchlistCount');
  if (badge) badge.innerText = list.length;
}

function toggleWatchlist(movieId) {
  let list = getWatchlist();
  const movie = allMoviesCache.find(m => m._id === movieId);

  if (!movie) return;

  const existsIndex = list.findIndex(m => m._id === movieId);
  if (existsIndex > -1) {
    list.splice(existsIndex, 1);
  } else {
    list.push(movie);
  }

  localStorage.setItem('cineSuggestList', JSON.stringify(list));
  updateWatchlistBadge();

  if (window.currentPage === 'mylist') {
    renderMovies(getWatchlist());
  } else {
    renderMovies(allMoviesCache);
  }
}

// Page View Navigation
async function switchPage(page) {
  window.currentPage = page;

  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const activeNav = document.getElementById(`nav-${page}`);
  if (activeNav) activeNav.classList.add('active');

  const pageTitle = document.getElementById('pageTitle');
  const pageDescription = document.getElementById('pageDescription');

  if (allMoviesCache.length === 0) {
    await fetchMovies('All');
  }

  if (page === 'home') {
    pageTitle.innerText = 'Featured Movies & Shows';
    pageDescription.innerText = 'Top-rated movies and web series sorted by user ratings.';
    renderMovies(allMoviesCache);
  } 
  else if (page === 'movies') {
    pageTitle.innerText = 'Movies Collection';
    pageDescription.innerText = 'Browse all feature films across all genres.';
    fetchContentType('movie');
  } 
  else if (page === 'series') {
    pageTitle.innerText = 'Web Series & TV Shows';
    pageDescription.innerText = 'Binge-worthy shows and multi-season series.';
    fetchContentType('series');
  } 
  else if (page === 'popular') {
    pageTitle.innerText = '🔥 Popular & Trending (9.0+ Rating)';
    pageDescription.innerText = 'Critically acclaimed titles with outstanding reviews.';
    fetchPopular();
  } 
  else if (page === 'mylist') {
    pageTitle.innerText = 'My Bookmarked List';
    pageDescription.innerText = 'Titles you have saved to watch later.';
    renderMovies(getWatchlist());
  }
}

function fetchContentType(type) {
  const filtered = allMoviesCache.filter(item => item.type === type);
  renderMovies(filtered);
}

function fetchPopular() {
  const popular = allMoviesCache.filter(item => item.rating >= 9.0);
  renderMovies(popular);
}

// Background click closes modals
window.addEventListener('click', (e) => {
  const trailerModal = document.getElementById('trailerModal');
  const reviewModal = document.getElementById('reviewModal');
  const authModal = document.getElementById('authModal');

  if (e.target === trailerModal) closeTrailerModal();
  if (e.target === reviewModal) reviewModal.style.display = 'none';
  if (e.target === authModal) closeAuthModal();
});

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  updateWatchlistBadge();
  switchPage('home');
});