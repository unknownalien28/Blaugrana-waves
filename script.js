// 1. Live “Hot News” from FootballCritic RSS
(async function loadHotNews() {
  const feedUrl = 'https://www.footballcritic.com/rss/barcelona';  // Barça feed auto-updates
  try {
    const res = await fetch(feedUrl);
    if (!res.ok) throw new Error('Network error');
    const xmlText = await res.text();
    const xml = new DOMParser().parseFromString(xmlText, 'application/xml');
    const items = Array.from(xml.querySelectorAll('item')).slice(0, 5);
    const ul = document.getElementById('news-list');
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent || 'No title';
      const link  = item.querySelector('link')?.textContent  || '#';
      const li = document.createElement('li');
      li.innerHTML = `<a href="${link}" target="_blank" rel="noopener">${title}</a>`;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error('RSS load failed:', err);
    document.getElementById('news-list').innerHTML =
      '<li>Unable to load news. Please try again later.</li>';
  }
})();

// 2. Fetch Top Scorers from API-Football
fetch('https://api-football-v1.p.rapidapi.com/v3/players/topscorers?league=140&season=2024', {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY'  // Replace with your actual API key
  }
})
.then(res => res.json())
.then(data => {
  const tbody = document.getElementById('scorer-body');
  data.response.slice(0,5).forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${item.player.name}</td>
      <td>${item.statistics[0].goals.total}</td>
    `;
    tbody.appendChild(tr);
  });
})
.catch(console.error);

// 3. Render Matrix Heatmaps (placeholder random data)
const players = ['Mbappé','Lewandowski','Budimir','Pérez','Raphinha'];
players.forEach((name, i) => {
  const ctx = document.getElementById(`heatmap${i+1}`).getContext('2d');
  Chart.register(Chart.MatrixController, Chart.MatrixElement);
  new Chart(ctx, {
    type: 'matrix',
    data: {
      datasets: [{
        data: Array.from({length:100}, () => ({
          x: Math.floor(Math.random()*10),
          y: Math.floor(Math.random()*10),
          v: Math.random()*30
        }))
      }]
    },
    options: {
      plugins: { title: { display: true, text: `${name} Heatmap` } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
});

// 4. Responsive Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
});

