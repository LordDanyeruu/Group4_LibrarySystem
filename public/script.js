// ============================================================================
// THE INDEX — PROFESSIONAL LIBRARY MANAGEMENT SYSTEM (SIMPLIFIED VARIABLES)
// ============================================================================

const MAX_PER_SHELF = 11;
const SHELVES_PER_WING = 5;

const colors = {
  blue: '#165dff',
  slate: '#334155',
  green: '#10b981',
  red: '#e11d48',
  amber: '#f39200'
};

let categories = [
  "Sci-Fi",
  "Fantasy",
  "General Fiction",
  "Computer Science",
  "History",
  "Science",
  "Action / Drama",
  "Mystery"
];

let books = [
  // SCI-FI (13 books to showcase per-shelf pagination)
  { id: 1, title: "At", author: "A. T. Vance", category: "Sci-Fi", color: "blue", height: 146, borrowed: false, desc: "A speculative chronicle set at the edge of a collapsing star system." },
  { id: 2, title: "Fahrenheit 451", author: "Ray Bradbury", category: "Sci-Fi", color: "amber", height: 148, borrowed: false, desc: "Fireman Guy Montag begins to read the books he is sworn to burn." },
  { id: 3, title: "Dune", author: "Frank Herbert", category: "Sci-Fi", color: "slate", height: 152, borrowed: false, desc: "Paul Atreides navigates politics on the desert planet Arrakis." },
  { id: 4, title: "Neuromancer", author: "William Gibson", category: "Sci-Fi", color: "blue", height: 142, borrowed: false, desc: "Console cowboy Case is hired for one last cyberspace heist." },
  { id: 5, title: "Foundation", author: "Isaac Asimov", category: "Sci-Fi", color: "red", height: 146, borrowed: false, desc: "Hari Seldon uses psychohistory to guide humanity." },
  { id: 6, title: "1984", author: "George Orwell", category: "Sci-Fi", color: "slate", height: 144, borrowed: false, desc: "Winston Smith wrestles with oppression under Big Brother." },
  { id: 7, title: "Snow Crash", author: "Neal Stephenson", category: "Sci-Fi", color: "green", height: 150, borrowed: false, desc: "Hiro Protagonist races through the Metaverse." },
  { id: 8, title: "Hyperion", author: "Dan Simmons", category: "Sci-Fi", color: "amber", height: 154, borrowed: false, desc: "Seven pilgrims share their stories on a journey to the Time Tombs." },
  { id: 9, title: "Brave New World", author: "Aldous Huxley", category: "Sci-Fi", color: "blue", height: 140, borrowed: false, desc: "A future society driven by genetic engineering." },
  { id: 10, title: "The Martian", author: "Andy Weir", category: "Sci-Fi", color: "red", height: 146, borrowed: false, desc: "Astronaut Mark Watney uses botany and engineering to survive on Mars." },
  { id: 11, title: "Solaris", author: "Stanislaw Lem", category: "Sci-Fi", color: "green", height: 142, borrowed: false, desc: "Scientists study a sentient ocean covering an alien world." },
  { id: 12, title: "Left Hand of Darkness", author: "Ursula K. Le Guin", category: "Sci-Fi", color: "amber", height: 148, borrowed: false, desc: "Envoy Genly Ai visits the winter world of Gethen." },
  { id: 13, title: "Ender's Game", author: "Orson Scott Card", category: "Sci-Fi", color: "blue", height: 144, borrowed: false, desc: "Young Ender Wiggin trains at Battle School in orbit." },

  // FANTASY
  { id: 14, title: "Alice in Wonderland", author: "Lewis Carroll", category: "Fantasy", color: "red", height: 138, borrowed: false, desc: "Alice tumbles down the rabbit hole into a whimsical world." },
  { id: 15, title: "Lord of the Rings", author: "J.R.R. Tolkien", category: "Fantasy", color: "red", height: 138, borrowed: false, desc: "Frodo Baggins embarks on a perilous quest to destroy the One Ring." },
  { id: 16, title: "Harry Potter", author: "J.K. Rowling", category: "Fantasy", color: "green", height: 150, borrowed: false, desc: "A young wizard discovers his magical heritage at Hogwarts." },

  // GENERAL FICTION
  { id: 17, title: "The exiled Epilogue", author: "K. R. Mercer", category: "General Fiction", color: "slate", height: 140, borrowed: false, desc: "A lone archivist pieces together the final unwritten chapter." },
  { id: 18, title: "The Road", author: "Cormac McCarthy", category: "General Fiction", color: "amber", height: 146, borrowed: false, desc: "A father and son walk alone through burned America." },

  // COMPUTER SCIENCE
  { id: 19, title: "Clean Architecture", author: "Robert C. Martin", category: "Computer Science", color: "blue", height: 148, borrowed: false, desc: "Core principles of software structure and design." },
  { id: 20, title: "Intro to Algorithms", author: "Cormen et al.", category: "Computer Science", color: "green", height: 154, borrowed: false, desc: "Guide to divide-and-conquer, greedy, and graph algorithms." },

  // HISTORY
  { id: 21, title: "The forgotten age", author: "Elena Rostova", category: "History", color: "amber", height: 154, borrowed: false, desc: "Uncovering lost bronze-age citadels beneath the desert dunes." },
  { id: 22, title: "Meditations", author: "Marcus Aurelius", category: "History", color: "red", height: 140, borrowed: false, desc: "Stoic journals on discipline, resilience, and clarity of mind." },

  // WING 2 CATEGORIES
  { id: 23, title: "The wanderer's log", author: "Soren Lindqvist", category: "Science", color: "green", height: 150, borrowed: false, desc: "Field notes recorded across uncharted archipelagos." },
  { id: 24, title: "Cosmos", author: "Carl Sagan", category: "Science", color: "amber", height: 150, borrowed: false, desc: "Fifteen billion years of cosmic evolution and science." },
  { id: 25, title: "Cardo Dalisay", author: "Coco Martin", category: "Action / Drama", color: "blue", height: 146, borrowed: false, desc: "The relentless pursuit of justice, brotherhood, and duty." },
  { id: 26, title: "Sherlock Holmes", author: "Arthur Conan Doyle", category: "Mystery", color: "slate", height: 148, borrowed: false, desc: "Classic detective investigations from 221B Baker Street." }
];

let wingPage = 0;
let shelfPages = {};
let selectedId = null;
let search = "";

// DOM Elements
const shelves = document.getElementById('shelves');
const catTabs = document.getElementById('catTabs');
const categorySelect = document.getElementById('categorySelect');
const newCatField = document.getElementById('newCatField');
const newCatInput = document.getElementById('newCatInput');
const borrowedList = document.getElementById('borrowedList');
const count = document.getElementById('count');
const totalBooksBadge = document.getElementById('totalBooksBadge');
const modal = document.getElementById('modal');
const tooltip = document.getElementById('tooltip');

// 1. Update Top Metrics, Category Dropdown & Jump Pills
function updateCategoryUI() {
  const outCount = books.filter(b => b.borrowed).length;
  totalBooksBadge.textContent = `${books.length} Books`;
  document.getElementById('statTotal').textContent = books.length;
  document.getElementById('statCats').textContent = categories.length;
  document.getElementById('statOut').textContent = outCount;

  categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('') +
    `<option value="__NEW__">+ New Custom Category...</option>`;

  catTabs.innerHTML = categories.map((cat, idx) => {
    const catCount = books.filter(b => b.category === cat).length;
    const isOnCurrentWing = Math.floor(idx / SHELVES_PER_WING) === wingPage;
    return `
      <button type="button" class="cat-tab ${isOnCurrentWing ? 'active' : ''}" onclick="jumpToCategory('${cat}')">
        ${cat} (${catCount})
      </button>
    `;
  }).join('');
}

function jumpToCategory(cat) {
  const idx = categories.indexOf(cat);
  if (idx !== -1) {
    wingPage = Math.floor(idx / SHELVES_PER_WING);
    showShelves();
  }
}
window.jumpToCategory = jumpToCategory;

function changeShelfPage(cat, dir) {
  shelfPages[cat] = (shelfPages[cat] || 0) + dir;
  showShelves();
}
window.changeShelfPage = changeShelfPage;

// Helper for author initials on spine
function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// 2. Render the 5 Shelves for the Active Bookcase Wing
function showShelves() {
  shelves.innerHTML = '';
  const query = search.trim().toLowerCase();

  const totalWings = Math.max(1, Math.ceil(categories.length / SHELVES_PER_WING));
  if (wingPage >= totalWings) wingPage = totalWings - 1;

  const startIdx = wingPage * SHELVES_PER_WING;
  document.getElementById('wingTitle').textContent = `BOOKCASE WING ${wingPage + 1} OF ${totalWings}`;
  document.getElementById('wingSub').textContent = `Showing Shelves ${startIdx + 1}–${startIdx + 5} • Capacity: ${MAX_PER_SHELF} Spines / Row`;

  document.getElementById('prevWingBtn').disabled = wingPage === 0;
  document.getElementById('nextWingBtn').disabled = wingPage >= totalWings - 1;

  updateCategoryUI();

  for (let slot = 0; slot < SHELVES_PER_WING; slot++) {
    const catIndex = startIdx + slot;
    const shelfNumber = String(catIndex + 1).padStart(2, '0');
    const catName = categories[catIndex] || null;

    const shelfDiv = document.createElement('div');

    if (!catName) {
      shelfDiv.innerHTML = `
        <div class="shelf-header">
          <span class="brass-tag">${shelfNumber} &bull; OPEN ARCHIVE TIER</span>
          <span class="total">0 SPINES</span>
        </div>
        <div class="shelf-row">
          <div class="bookend"></div>
          <div class="empty-msg">Unassigned tier — create a new custom category to populate this shelf</div>
          <div class="bookend"></div>
        </div>
      `;
    } else {
      const allCatBooks = books.filter(b => b.category === catName);
      const totalPages = Math.max(1, Math.ceil(allCatBooks.length / MAX_PER_SHELF));

      if ((shelfPages[catName] || 0) >= totalPages) {
        shelfPages[catName] = totalPages - 1;
      }
      const currentPage = shelfPages[catName] || 0;
      const visibleBooks = allCatBooks.slice(
        currentPage * MAX_PER_SHELF,
        (currentPage + 1) * MAX_PER_SHELF
      );

      const pagerHTML = totalPages > 1 ? `
        <div class="shelf-pager">
          <button class="page-btn" ${currentPage === 0 ? 'disabled' : ''} onclick="changeShelfPage('${catName}', -1)">◀</button>
          <span>ROW ${currentPage + 1}/${totalPages}</span>
          <button class="page-btn" ${currentPage >= totalPages - 1 ? 'disabled' : ''} onclick="changeShelfPage('${catName}', 1)">▶</button>
        </div>
      ` : '';

      shelfDiv.innerHTML = `
        <div class="shelf-header">
          <span class="brass-tag">${shelfNumber} &bull; ${catName.toUpperCase()}</span>
          <div class="shelf-right">
            ${pagerHTML}
            <span class="total">${allCatBooks.filter(b => !b.borrowed).length} SPINES</span>
          </div>
        </div>
      `;

      const row = document.createElement('div');
      row.className = 'shelf-row';
      row.innerHTML = '<div class="bookend"></div>';

      if (visibleBooks.length === 0) {
        row.innerHTML += `<div class="empty-msg">No books shelved in ${catName} yet</div>`;
      } else {
        visibleBooks.forEach(book => {
          if (book.borrowed) {
            const slip = document.createElement('div');
            slip.className = 'slip';
            slip.innerHTML = `<span>OUT: ${book.title.slice(0, 10)}</span>`;
            slip.onclick = () => openModal(book.id);
            row.appendChild(slip);
            return;
          }

          const item = document.createElement('div');
          item.className = `book ${book.color}`;
          item.style.height = book.height + 'px';

          if (query) {
            const hit = book.title.toLowerCase().includes(query) ||
                        book.author.toLowerCase().includes(query) ||
                        book.category.toLowerCase().includes(query);
            item.classList.add(hit ? 'match' : 'dim');
          }

          item.innerHTML = `
            <div class="spine-foil"></div>
            <span class="spine-text">${book.title}</span>
            <small class="spine-init">${getInitials(book.author)}</small>
          `;

          item.onclick = () => {
            tooltip.classList.add('hidden');
            openModal(book.id);
          };

          item.onmouseenter = () => {
            document.getElementById('tipCat').textContent = book.category;
            document.getElementById('tipTitle').textContent = book.title;
            document.getElementById('tipInfo').textContent = `by ${book.author}`;
            tooltip.classList.remove('hidden');
          };

          item.onmousemove = (e) => {
            tooltip.style.left = (e.clientX + 14) + 'px';
            tooltip.style.top = (e.clientY - 56) + 'px';
          };

          item.onmouseleave = () => tooltip.classList.add('hidden');

          row.appendChild(item);
        });
      }

      const rightEnd = document.createElement('div');
      rightEnd.className = 'bookend';
      row.appendChild(rightEnd);
      shelfDiv.appendChild(row);
    }

    if (slot < SHELVES_PER_WING - 1) {
      const plank = document.createElement('div');
      plank.className = 'plank';
      shelfDiv.appendChild(plank);
    }

    shelves.appendChild(shelfDiv);
  }
}

document.getElementById('prevWingBtn').onclick = () => {
  if (wingPage > 0) {
    wingPage--;
    showShelves();
  }
};

document.getElementById('nextWingBtn').onclick = () => {
  const totalWings = Math.ceil(categories.length / SHELVES_PER_WING);
  if (wingPage < totalWings - 1) {
    wingPage++;
    showShelves();
  }
};

// 3. Display Borrowed Books in Sidebar
function showBorrowed() {
  const out = books.filter(b => b.borrowed);
  count.textContent = `${out.length} Out`;

  if (out.length === 0) {
    borrowedList.innerHTML = '<p class="empty">No books borrowed yet.</p>';
    return;
  }

  borrowedList.innerHTML = out.map(b => `
    <div class="item">
      <div>
        <strong>${b.title}</strong>
        <span>${b.author} &bull; ${b.category}</span>
      </div>
      <button class="btn-small" onclick="borrowBook(${b.id})">Return</button>
    </div>
  `).join('');
}

// 4. Open 3D Book Modal
function openModal(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;

  selectedId = book.id;
  const hex = colors[book.color] || '#165dff';
  const shelfNum = categories.indexOf(book.category) + 1;

  document.getElementById('mShelf').textContent = `SHELF 0${shelfNum} // ${book.category.toUpperCase()}`;
  document.getElementById('mSpineTitle').textContent = book.title;
  document.getElementById('mCat').textContent = book.category;
  document.getElementById('mCoverTitle').textContent = book.title;
  document.getElementById('mCoverAuthor').textContent = book.author;

  document.getElementById('mTitle').textContent = book.title;
  document.getElementById('mAuthor').textContent = book.author;
  document.getElementById('mCatText').textContent = book.category;
  document.getElementById('mDesc').textContent = book.desc;

  document.getElementById('mSpine').style.background = hex;
  document.getElementById('mCover').style.background = `linear-gradient(145deg, ${hex}, #0f172a)`;

  const status = document.getElementById('mStatus');
  const btn = document.getElementById('borrowBtn');

  if (book.borrowed) {
    status.className = 'status out';
    status.textContent = '● Currently Checked Out';
    btn.className = 'btn-orange return';
    btn.textContent = 'Return Book to Shelf';
  } else {
    status.className = 'status ok';
    status.textContent = `● Available on Shelf ${shelfNum} (${book.category})`;
    btn.className = 'btn-orange';
    btn.textContent = 'Check Out / Borrow Book';
  }

  modal.classList.remove('hidden');
}

// 5. Borrow or Return Book
function borrowBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;

  book.borrowed = !book.borrowed;
  showShelves();
  showBorrowed();

  if (!modal.classList.contains('hidden') && selectedId === id) {
    openModal(id);
  }

  notify(book.borrowed ? `Checked out "${book.title}"` : `Returned "${book.title}" to shelf`);
}
window.borrowBook = borrowBook;

document.getElementById('borrowBtn').onclick = () => borrowBook(selectedId);

// 6. Delete Book
document.getElementById('deleteBtn').onclick = () => {
  books = books.filter(b => b.id !== selectedId);
  modal.classList.add('hidden');
  showShelves();
  showBorrowed();
  notify('Volume removed from catalog.');
};

// 7. Modal Prev / Next & Close
function stepBook(dir) {
  if (books.length === 0) return;
  const index = books.findIndex(b => b.id === selectedId);
  const next = (index + dir + books.length) % books.length;
  openModal(books[next].id);
}

document.getElementById('prevBtn').onclick = () => stepBook(-1);
document.getElementById('nextBtn').onclick = () => stepBook(1);
document.getElementById('closeBtn').onclick = () => modal.classList.add('hidden');
modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };

// 8. Color Swatch Picker & Register a New Book
const swatches = document.querySelectorAll('.swatch');
const colorInput = document.getElementById('color');

swatches.forEach(btn => {
  btn.onclick = () => {
    swatches.forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    colorInput.value = btn.getAttribute('data-color');
  };
});

categorySelect.onchange = () => {
  const isNew = categorySelect.value === '__NEW__';
  newCatField.classList.toggle('hidden', !isNew);
  newCatInput.required = isNew;
};

document.getElementById('bookForm').onsubmit = (e) => {
  e.preventDefault();

  let chosenCat = categorySelect.value;
  if (chosenCat === '__NEW__') {
    chosenCat = newCatInput.value.trim();
    if (!chosenCat) return;
    if (!categories.includes(chosenCat)) {
      categories.push(chosenCat);
    }
  }

  const newBook = {
    id: Date.now(),
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim() || 'Unknown Author',
    category: chosenCat,
    color: colorInput.value,
    height: Math.floor(Math.random() * 14) + 140,
    borrowed: false,
    desc: `Registered ${chosenCat} volume in The Index library catalog.`
  };

  books.push(newBook);

  const catIdx = categories.indexOf(chosenCat);
  wingPage = Math.floor(catIdx / SHELVES_PER_WING);
  const catBooksCount = books.filter(b => b.category === chosenCat).length;
  shelfPages[chosenCat] = Math.floor((catBooksCount - 1) / MAX_PER_SHELF);

  e.target.reset();
  newCatField.classList.add('hidden');
  showShelves();
  notify(`Added "${newBook.title}" to ${chosenCat} (Shelf ${catIdx + 1})`);
};

// 9. Live Catalog Search
const searchInput = document.getElementById('searchInput');
const searchInfo = document.getElementById('searchInfo');
const searchText = document.getElementById('searchText');

function runSearch(val) {
  search = val;
  const q = search.trim().toLowerCase();

  if (q !== '') {
    const matches = books.filter(b =>
      !b.borrowed &&
      (b.title.toLowerCase().includes(q) ||
       b.author.toLowerCase().includes(q) ||
       b.category.toLowerCase().includes(q))
    );
    searchInfo.classList.remove('hidden');
    searchText.textContent = `Found ${matches.length} matching volume(s)`;

    if (matches.length > 0) {
      const first = matches[0];
      const catIdx = categories.indexOf(first.category);
      wingPage = Math.floor(catIdx / SHELVES_PER_WING);
      const posInCat = books.filter(b => b.category === first.category).findIndex(b => b.id === first.id);
      shelfPages[first.category] = Math.floor(posInCat / MAX_PER_SHELF);
    }
  } else {
    searchInfo.classList.add('hidden');
  }

  showShelves();
}

searchInput.oninput = (e) => runSearch(e.target.value);
document.getElementById('searchForm').onsubmit = (e) => {
  e.preventDefault();
  runSearch(searchInput.value);
};
document.getElementById('resetBtn').onclick = () => {
  searchInput.value = '';
  runSearch('');
};

// 10. Toast Notification
let timer;
function notify(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.add('hidden'), 2600);
}

// Start App
showShelves();
showBorrowed();

// ============================================================================
// 11. LOGIN OVERLAY & LOGOUT HANDLER
// ============================================================================
const loginScreen = document.getElementById('loginScreen');
const loginForm = document.getElementById('loginForm');
const user = document.getElementById('user');
const pass = document.getElementById('pass');
const toggleBtn = document.getElementById('toggleBtn');
const errorBox = document.getElementById('errorBox');

// Show / Hide Password
toggleBtn.onclick = () => {
  const isPass = pass.type === 'password';
  pass.type = isPass ? 'text' : 'password';
  toggleBtn.textContent = isPass ? 'Hide' : 'Show';
};

// Sign In & Unlock Library
loginForm.onsubmit = (e) => {
  e.preventDefault();

  const username = user.value.trim();
  const password = pass.value.trim();

  if (!username || !password) {
    errorBox.classList.remove('hidden');
    return;
  }

  errorBox.classList.add('hidden');
  loginScreen.classList.add('hidden');
  notify(`Welcome back, ${username}!`);
};

// Automatically add a "Log Out" button to the top stats bar
const statsRow = document.querySelector('.stats-row');
if (statsRow) {
  const logoutBtn = document.createElement('button');
  logoutBtn.type = 'button';
  logoutBtn.className = 'wing-btn';
  logoutBtn.textContent = 'Log Out';
  logoutBtn.onclick = () => {
    loginForm.reset();
    loginScreen.classList.remove('hidden');
  };
  statsRow.appendChild(logoutBtn);
}