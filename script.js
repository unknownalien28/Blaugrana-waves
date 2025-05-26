// 1. Load Google News RSS (Barcelona FC)
async function loadGoogleNewsRSS() {
 const rssUrl = 'https://news.google.com/rss/search?q=Barcelona+FC&hl=en-US&gl=US&ceid=US:en';
 const proxyUrl = `https://thingproxy.freeboard.io/fetch/${rssUrl}`;
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = '<li>Loading news...</li>';

  try {
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");
    const items = xmlDoc.querySelectorAll('item');

    newsList.innerHTML = '';
    if (items.length === 0) {
      newsList.innerHTML = '<li>No recent news found.</li>';
    } else {
      items.forEach((item, i) => {
        const title = item.querySelector('title').textContent;
        const link = item.querySelector('link').textContent;
        const pubDate = new Date(item.querySelector('pubDate').textContent);
        const li = document.createElement('li');
        li.innerHTML = `<a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a> 
                        <br><small>${pubDate.toLocaleDateString()}</small>`;
        newsList.appendChild(li);
      });

      // Animate News Fading Sequentially
      let newsItems = newsList.querySelectorAll('li');
      let currentIndex = 0;

      function cycleNews() {
        newsItems.forEach((item, i) => item.classList.remove('active'));
        newsItems[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % newsItems.length;
      }

      if (newsItems.length > 0) {
        cycleNews(); // Initial
        setInterval(cycleNews, 4000); // Every 4s
      }
    }
  } catch (error) {
    console.error('Error loading Google News RSS:', error);
    newsList.innerHTML = '<li>Error loading news.</li>';
  }
}

// 2. Fetch Top Scorers (API-Football)
async function loadTopScorers() {
  try {
    const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/players/topscorers?league=140&season=2024', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY'  // Replace with your actual API key
      }
    });

    const data = await response.json();
    const tbody = document.getElementById('scorer-body');
    data.response.slice(0, 5).forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = 
        <td>${idx + 1}</td>
        <td>${item.player.name}</td>
        <td>${item.statistics[0].goals.total}</td>
      ;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Top scorers fetch error:', error);
  }
}


// 3. Responsive Hamburger Menu Toggle
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}


// 4. Match Calendar Setup
function updateMatchCalendar() {
  const matchDate = new Date('2025-05-24'); // CHANGE DATE
  const day = matchDate.getDate();
  const month = matchDate.toLocaleString('default', { month: 'short' }).toUpperCase();

  const calendarDay = document.querySelector('.calendar .day');
  const calendarMonth = document.querySelector('.calendar .month');
  if (calendarDay && calendarMonth) {
    calendarDay.textContent = day;
    calendarMonth.textContent = month;
  }

  const matchTitle = document.querySelector('.match-info h3');
  const matchDetails = document.querySelector('.match-info p');
  const matchKickoff = document.querySelector('.match-info span');
  if (matchTitle && matchDetails && matchKickoff) {
    matchTitle.textContent = "Athletic Bilbao vs Barcelona";
    matchDetails.textContent = "La Liga – San Mamés";
    matchKickoff.textContent = "Kick-off: 8:00 PM | Live on Blaugrana Waves";
  }
}


// 5. Auto-Sliding Heatmap Carousel (Horizontal)
function initHeatmapCarousel() {
  const slides = document.querySelectorAll('.heatmap-carousel .slide');
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) slide.classList.add('active');
    });
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  showSlide(current);
  setInterval(nextSlide, 5000); // Every 4 seconds
}


// 6. Init on Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadGoogleNewsRSS();
  loadTopScorers();
  initHamburgerMenu();
  updateMatchCalendar();
  initHeatmapCarousel();
});

