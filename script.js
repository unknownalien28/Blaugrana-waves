const apiKey = '0336b2cc1102450a85511f10f44fdd7f';
const newsList = document.getElementById('news-list');

function fetchNews(query) {
  return fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${apiKey}`)
    .then(res => res.json());
}

async function loadNews() {
  newsList.innerHTML = '<li>Loading news...</li>';
  
  let data = await fetchNews('Barcelona');
  if (!data.articles || data.articles.length === 0) {
    data = await fetchNews('FC Barcelona');
  }

  if (data.articles && data.articles.length > 0) {
    newsList.innerHTML = '';
    data.articles.forEach(article => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>
        <br><small>${new Date(article.publishedAt).toLocaleDateString()}</small>
      `;
      newsList.appendChild(li);
    });
  } else {
    newsList.innerHTML = '<li>No recent news found.</li>';
  }
}

loadNews().catch(err => {
  console.error(err);
  newsList.innerHTML = '<li>Error loading news.</li>';
});


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

