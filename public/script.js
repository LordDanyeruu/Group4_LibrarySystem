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

let books = [];
let activeBorrows = [];
let wingPage = 0;
let shelfPages = {};
let selectedId = null;
let editingId = null;
let currentMember = null;
let search = "";

async function loadBooks() {
  try {
    const [booksRes, borrowsRes] = await Promise.all([
      fetch('/api/books'),
      fetch('/api/borrows?status=Borrowed')
    ]);

    books = await booksRes.json();
    activeBorrows = await borrowsRes.json();

    books.forEach(b => {
      if (b.category && !categories.includes(b.category)) {
        categories.push(b.category);
      }
    });
    
    showShelves();
    showBorrowed();
  } catch (error) {
    notify('Could not load books from the database');
  }
}

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

  borrowedList.innerHTML = out.map(b => {
    const rec = activeBorrows.find(r => r.book && (r.book._id === b.id || r.book === b.id));
    const borrowerName = rec && rec.member ? `By: ${rec.member.name}`: b.category;
    return`

    <div class="item">
      <div>
        <strong>${b.title}</strong>
        <span>${b.author} &bull; ${borrowerName}</span>
      </div>
      <button class="btn-small" onclick="borrowBook('${b.id}')">Return</button>
    </div>
    `;
  }).join('');
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

// 5. Borrow or Return Book via /api/borrows
async function borrowBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;

  if (!currentMember) {
    notify('Please sign in first to borrow or return books.');
    return;
  }

  try {
    let res;
    if (!book.borrowed) {
      // Borrow: POST /api/borrows with { book, member, dueDate }
      res = await fetch('/api/borrows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: book.id,
          member: currentMember._id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
      });
    } else {
      // Return: Find BorrowRecord._id and call PUT /api/borrows/:id/return
      const record = activeBorrows.find(
        r => (r.book && (r.book._id === id || r.book.id === id)) || r.book === id
      );
      if (!record) {
        notify('Active borrow record not found.');
        return;
      }
      res = await fetch(`/api/borrows/${record._id}/return`, {
        method: 'PUT'
      });
    }

    const data = await res.json();
    if (!res.ok) {
      notify(data.message || 'Could not update borrow status.');
      return;
    }

    const wasBorrowed = book.borrowed;
    await loadBooks();

    if (!modal.classList.contains('hidden') && selectedId === id) {
      openModal(id);
    }

    notify(!wasBorrowed ? `Checked out "${book.title}"` : `Returned "${book.title}" to shelf`);
  } catch (err) {
    notify('Server error while updating borrow status.');
  }
}
window.borrowBook = borrowBook;

document.getElementById('borrowBtn').onclick = () => borrowBook(selectedId);

// 6A. Edit Book (GET /api/books/:id -> populate sidebar form)
const editBtn = document.getElementById('editBtn');
const submitBookBtn = document.getElementById('submitBookBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

async function editBook(id) {
  try {
    const res = await fetch(`/api/books/${id}`);
    const book = await res.json();
    if (!res.ok) {
      notify(book.message || 'Could not load book details.');
      return;
    }

    editingId = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    categorySelect.value = categories.includes(book.category) ? book.category : '__NEW__';
    colorInput.value = book.color || 'blue';
    swatches.forEach(s => s.classList.toggle('active', s.getAttribute('data-color') === colorInput.value));

    if (submitBookBtn) submitBookBtn.textContent = 'Update Volume Details';
    if (cancelEditBtn) cancelEditBtn.classList.remove('hidden');

    modal.classList.add('hidden');
    document.getElementById('title').focus();
    notify(`Editing "${book.title}" in sidebar form`);
  } catch (err) {
    notify('Error loading book for edit.');
  }
}

if (editBtn) {
  editBtn.onclick = () => editBook(selectedId);
}

if (cancelEditBtn) {
  cancelEditBtn.onclick = () => {
    editingId = null;
    document.getElementById('bookForm').reset();
    if (submitBookBtn) submitBookBtn.textContent = 'Add Volume to Bookshelf';
    cancelEditBtn.classList.add('hidden');
  };
}

// 6B. Delete Book (DELETE /api/books/:id)
async function deleteBook(id) {
  try {
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      notify(data.message || 'Could not delete book.');
      return;
    }
    modal.classList.add('hidden');
    await loadBooks();
    notify('Volume removed from catalog.');
  } catch (err) {
    notify('Server error while deleting book.');
  }
}

document.getElementById('deleteBtn').onclick = () => deleteBook(selectedId);

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

async function saveBook(e) {
  e.preventDefault();

  let chosenCat = categorySelect.value;
  if (chosenCat === '__NEW__') {
    chosenCat = newCatInput.value.trim();
    if (!chosenCat) return;
    if (!categories.includes(chosenCat)) {
      categories.push(chosenCat);
    }
  }

  const bookData = {
    title: document.getElementById('title').value.trim(),
    author: document.getElementById('author').value.trim() || 'Unknown Author',
    category: chosenCat,
    color: colorInput.value
  };

  try {
    const url = editingId ? `/api/books/${editingId}` : '/api/books';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    const savedBook = await res.json();

    if (!res.ok) {
      notify(savedBook.message || 'Could not save book.');
      return;
    }

    const wasEditing = Boolean(editingId);
    editingId = null;
    if (submitBookBtn) submitBookBtn.textContent = 'Add Volume to Bookshelf';
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');

    await loadBooks();

    const catIdx = categories.indexOf(chosenCat);
    wingPage = Math.floor(catIdx / SHELVES_PER_WING);
    const catBooksCount = books.filter(b => b.category === chosenCat).length;
    shelfPages[chosenCat] = Math.floor(Math.max(0, catBooksCount - 1) / MAX_PER_SHELF);

    e.target.reset();
    newCatField.classList.add('hidden');
    showShelves();
    notify(wasEditing ? `Updated "${savedBook.title}"` : `Added "${savedBook.title}" to ${chosenCat}`);
  } catch (err) {
    notify('Error saving book to database.');
  }
}

document.getElementById('bookForm').onsubmit = saveBook;

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
loadBooks();

// ============================================================================
// 11. LOGIN & SIGN-UP OVERLAY HANDLER
// ============================================================================
const loginScreen = document.getElementById('loginScreen');
const loginForm = document.getElementById('loginForm');
const user = document.getElementById('user');
const pass = document.getElementById('pass');
const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regContact = document.getElementById('regContact');
const signInFields = document.getElementById('signInFields');
const signUpFields = document.getElementById('signUpFields');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const switchAuthModeBtn = document.getElementById('switchAuthModeBtn');
const toggleBtn = document.getElementById('toggleBtn');
const errorBox = document.getElementById('errorBox');

let isSignUpMode = false;

// Switch between Sign In and Create Account
if (switchAuthModeBtn) {
  switchAuthModeBtn.onclick = () => {
    isSignUpMode = !isSignUpMode;
    errorBox.classList.add('hidden');
    signInFields.classList.toggle('hidden', isSignUpMode);
    signUpFields.classList.toggle('hidden', !isSignUpMode);

    // Prevent hidden inputs from blocking form submit
    user.required = !isSignUpMode;
    regName.required = isSignUpMode;
    regEmail.required = isSignUpMode;
    regContact.required = isSignUpMode;

    authSubmitBtn.textContent = isSignUpMode ? 'Create Member Account' : 'Sign In to Library';
    switchAuthModeBtn.textContent = isSignUpMode
      ? 'Already have an account? Sign In'
      : 'New member? Create an account';
  };
}

// Show / Hide Password
toggleBtn.onclick = () => {
  const isPass = pass.type === 'password';
  pass.type = isPass ? 'text' : 'password';
  toggleBtn.textContent = isPass ? 'Hide' : 'Show';
};

// Sign In or Sign Up via /api/members
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const password = pass.value.trim();

  try {
    let res;
    if (isSignUpMode) {
      const name = regName.value.trim();
      const email = regEmail.value.trim();
      const contactNumber = regContact.value.trim();

      if (!name || !email || !contactNumber || !password) {
        errorBox.textContent = 'Please fill in Name, Email, Contact Number, and Password.';
        errorBox.classList.remove('hidden');
        return;
      }

      res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, contactNumber, password })
      });
    } else {
      const userName = user.value.trim();
      if (!userName || !password) {
        errorBox.textContent = 'Please enter your email and password.';
        errorBox.classList.remove('hidden');
        return;
      }

      // Matches const { userName, password } = req.body in your memberRoutes.js!
      res = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password })
      });
    }

    const data = await res.json();
    if (!res.ok) {
      errorBox.textContent = data.message || 'Authentication failed.';
      errorBox.classList.remove('hidden');
      return;
    }

    currentMember = data;
    errorBox.classList.add('hidden');
    loginScreen.classList.add('hidden');
    notify(
      isSignUpMode
        ? `Account created! Welcome, ${data.name} (ID: ${data.memberID})`
        : `Welcome back, ${data.name} (ID: ${data.memberID})!`
    );
    loadBooks();
  } catch (err) {
    errorBox.textContent = 'Could not connect to server.';
    errorBox.classList.remove('hidden');
  }
};

const statsRow = document.querySelector('.stats-row');
if (statsRow) {
  const logoutBtn = document.createElement('button');
  logoutBtn.type = 'button';
  logoutBtn.className = 'wing-btn';
  logoutBtn.textContent = 'Log Out';
  logoutBtn.onclick = () => {
    currentMember = null;
    loginForm.reset();
    loginScreen.classList.remove('hidden');
  };
  statsRow.appendChild(logoutBtn);
}