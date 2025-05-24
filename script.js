// Google News RSS URL for Barcelona FC
const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=Barcelona+FC&hl=en-US&gl=US&ceid=US:en');
const proxyUrl = `https://api.allorigins.win/get?url=${rssUrl}`;
const newsList = document.getElementById('news-list');

async function loadGoogleNewsRSS() {
  newsList.innerHTML = '<li>Loading news...</li>';

  try {
    const response = await fetch(proxyUrl);
    const data = await response.json();

    // Parse XML string from response.contents
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");
    const items = xmlDoc.querySelectorAll('item');

    if (items.length === 0) {
      newsList.innerHTML = '<li>No recent news found.</li>';
      return;
    }

    newsList.innerHTML = '';
    items.forEach(item => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      const pubDate = new Date(item.querySelector('pubDate').textContent);

      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
        <br><small>${pubDate.toLocaleDateString()}</small>
      `;
      newsList.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading Google News RSS:', error);
    newsList.innerHTML = '<li>Error loading news.</li>';
  }
}

// Run it on page load
window.addEventListener('DOMContentLoaded', loadGoogleNewsRSS);


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

<script>
  // Example dynamic update
  document.addEventListener("DOMContentLoaded", function () {
    // Update calendar date
    const calendarDay = document.querySelector('.calendar .day');
    const calendarMonth = document.querySelector('.calendar .month');

    const matchDate = new Date('2025-05-24'); // ← CHANGE DATE HERE
    const day = matchDate.getDate();
    const month = matchDate.toLocaleString('default', { month: 'short' }).toUpperCase();

    calendarDay.textContent = day;
    calendarMonth.textContent = month;

    // Update match title and info
    document.querySelector('.match-info h3').textContent = "Athletic Bilbao vs Barcelona";
    document.querySelector('.match-info p').textContent = "La Liga – San Mamés";
    document.querySelector('.match-info span').textContent = "Kick-off: 8:00 PM | Live on Blaugrana Waves";
  });
</script>

document.addEventListener('DOMContentLoaded', function() {
});

document.addEventListener('DOMContentLoaded', function() {
});

document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.slide');
  let current = 0;
  const total = slides.length;

  function goToSlide(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    current = (current + 1) % total;
    goToSlide(current);
  }

  // Initialize
  goToSlide(current);

  // Adjust 3500 (milliseconds) to a smaller number for faster, or bigger for slower
  setInterval(nextSlide, 3500);
});
