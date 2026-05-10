const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});

const beritaForm = document.getElementById('berita-form');
const beritaGrid = document.querySelector('.berita-grid');
const beritaEmpty = document.querySelector('.berita-empty');
const STORAGE_KEY = 'yayasanBerita';

function formatDate(dateValue) {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function createBeritaCard(item) {
    const card = document.createElement('article');
    card.className = 'berita-card';

    const top = document.createElement('div');
    top.className = 'berita-card-top';

    const dateEl = document.createElement('span');
    dateEl.className = 'berita-date';
    dateEl.textContent = item.date;

    const title = document.createElement('h3');
    title.textContent = item.title;

    top.appendChild(dateEl);
    top.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = item.description;

    const button = document.createElement('a');
    button.className = 'btn btn-primary';
    button.textContent = 'Selengkapnya';
    button.href = item.link || '#kontak';
    button.target = item.link ? '_blank' : '_self';
    button.rel = item.link ? 'noopener noreferrer' : '';

    card.appendChild(top);
    card.appendChild(desc);
    card.appendChild(button);

    return card;
}

function renderBerita(items) {
    beritaGrid.innerHTML = '';
    if (!items.length) {
        beritaEmpty.style.display = 'block';
        return;
    }

    beritaEmpty.style.display = 'none';
    items.forEach(item => {
        beritaGrid.appendChild(createBeritaCard(item));
    });
}

function loadBerita() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
        return JSON.parse(saved);
    } catch (error) {
        return [];
    }
}

function saveBerita(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getDefaultDate(dateInput) {
    return formatDate(dateInput.value) || formatDate(new Date().toISOString().split('T')[0]);
}

const beritaItems = loadBerita();
renderBerita(beritaItems);

if (beritaForm) {
    beritaForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const titleInput = document.getElementById('news-title');
        const dateInput = document.getElementById('news-date');
        const linkInput = document.getElementById('news-link');
        const descInput = document.getElementById('news-description');

        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const link = linkInput.value.trim();
        const date = getDefaultDate(dateInput);

        if (!title || !description) {
            alert('Judul dan isi berita harus diisi.');
            return;
        }

        if (link && !/^https?:\/\//i.test(link)) {
            alert('Link berita harus dimulai dengan http:// atau https://');
            return;
        }

        const newItem = {
            title,
            date,
            link: link || null,
            description
        };

        beritaItems.unshift(newItem);
        saveBerita(beritaItems);
        renderBerita(beritaItems);

        beritaForm.reset();
    });
}
