// script.js

// 1. Load Breaking News (Google News RSS via AllOrigins proxy)
async function loadBreakingNews() {
  const rssUrl = encodeURIComponent(
    'https://news.google.com/rss/search?q=Barcelona+FC&hl=en-US&gl=US&ceid=US:en'
  );
  const proxyUrl = `https://api.allorigins.win/get?url=${rssUrl}`;
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = '<li>Loading news…</li>';

  try {
    const response = await fetch(proxyUrl);
    const { contents } = await response.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(contents, 'text/xml');
    const items = xml.querySelectorAll('item');

    newsList.innerHTML = '';
    if (items.length === 0) {
      newsList.innerHTML = '<li>No recent news found.</li>';
    } else {
      items.forEach((item, i) => {
        const title   = item.querySelector('title') .textContent;
        const link    = item.querySelector('link')  .textContent;
        const pubDate = new Date(item.querySelector('pubDate').textContent);
        const li      = document.createElement('li');

        // give each <li> the CSS animation-delay via inline style
        li.style.animationDelay = `${0.2 + i * 0.2}s`;

        li.innerHTML = `
          <a href="${link}" target="_blank" rel="noopener noreferrer">
            ${title}
          </a><br>
          <small>${pubDate.toLocaleDateString()}</small>
        `;
        newsList.appendChild(li);
      });
    }
  } catch (err) {
    console.error('Error loading breaking news:', err);
    newsList.innerHTML = '<li>Error loading news.</li>';
  }
}


// 2. Load Top 5 Scorers (API-Football)
async function loadTopScorers() {
  const tbody = document.getElementById('scorer-body');
  tbody.innerHTML = ''; // clear any placeholder rows

  try {
    const res = await fetch(
      'https://api-football-v1.p.rapidapi.com/v3/players/topscorers?league=140&season=2024',
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
          'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY'
        }
      }
    );
    const { response } = await res.json();
    response.slice(0, 5).forEach((entry, idx) => {
      const { player, statistics } = entry;
      const goals = statistics[0].goals.total ?? 0;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>
          <img
            src="${player.photo || ''}"
            alt="${player.name}"
            style="height:32px; width:32px; border-radius:50%; margin-right:8px; vertical-align:middle;"
          />
          ${player.name}
        </td>
        <td>${goals}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Top scorers fetch error:', err);
    // optionally show a message in the table
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="3">Unable to load top scorers.</td>`;
    tbody.appendChild(tr);
  }
}


// 3. Load Trophies from JSON (for scalability)
async function loadTrophies() {
  const grid = document.querySelector('.trophies-grid');
  if (!grid) return;

  // trophies.json should live at your project root and look like:
  // { "trophies": [ { "img":"laliga.png", "title":"La Liga", ... }, ... ] }
  try {
    const res = await fetch('./trophies.json');
    const { trophies } = await res.json();
    grid.innerHTML = ''; // clear placeholder

    trophies.forEach((t, i) => {
      const card = document.createElement('div');
      card.classList.add('trophy-card');
      card.setAttribute('data-aos', 'zoom-in');
      card.setAttribute('data-aos-delay', `${100 + i * 100}`);
      card.innerHTML = `
        <img src="Asset/${t.img}" alt="${t.title} Trophy" />
        <h4>${t.title}</h4>
        <p>${t.description}</p>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading trophies:', err);
  }
}


// 4. Hamburger Menu Toggle
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}


// 5. Update Match Calendar & Details
function updateMatchCalendar() {
  // you can extend this to read from a JSON schedule file if desired
  const matchDate = new Date('2025-05-18'); // example
  const day       = matchDate.getDate();
  const month     = matchDate.toLocaleString('default', { month:'short' }).toUpperCase();

  document.querySelectorAll('.calendar .day').forEach(el => el.textContent = day);
  document.querySelectorAll('.calendar .month').forEach(el => el.textContent = month);

  document.querySelectorAll('.match-info h3')
    .forEach(el => el.textContent = 'Athletic Bilbao vs Barcelona');
  document.querySelectorAll('.match-info p')
    .forEach(el => el.textContent = 'La Liga – San Mamés');
  document.querySelectorAll('.match-info span')
    .forEach(el => {
      if (el.classList.contains('vs')) return;
      el.textContent = 'Kick-off: 8:00 PM | Live on Blaugrana Waves';
    });
}


// 6. Heatmap Carousel (using transform)
function initHeatmapCarousel() {
  const track  = document.querySelector('.carousel-track');
  const slides = Array.from(track?.children || []);
  if (!track || slides.length === 0) return;

  let current = 0;
  const total  = slides.length;

  // set initial sizes
  track.style.width = `${100 * total}%`;
  slides.forEach(slide => slide.style.width = `${100 / total}%`);

  setInterval(() => {
    current = (current + 1) % total;
    track.style.transform = `translateX(-${(100 / total) * current}%)`;
  }, 5000);
}


// 7. Kick everything off on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadBreakingNews();
  loadTopScorers();
  loadTrophies();
  initHamburgerMenu();
  updateMatchCalendar();
  initHeatmapCarousel();
});
