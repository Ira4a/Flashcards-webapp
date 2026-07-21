// --- Инициализация данных из localStorage ---
let folders = JSON.parse(localStorage.getItem('flash_folders')) || ['Основная'];
let cards = JSON.parse(localStorage.getItem('flash_cards')) || [];
let activeFolder = 'Все';

// --- Элементы DOM ---
const foldersList = document.getElementById('folders-list');
const cardsGrid = document.getElementById('cards-grid');
const newFolderInput = document.getElementById('new-folder-input');
const addFolderBtn = document.getElementById('add-folder-btn');
const currentFolderTitle = document.getElementById('current-folder-title');

const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cardForm = document.getElementById('card-form');
const folderSelect = document.getElementById('folder-select');

// --- Функция сохранения данных в localStorage ---
function saveData() {
  localStorage.setItem('flash_folders', JSON.stringify(folders));
  localStorage.setItem('flash_cards', JSON.stringify(cards));
}

// --- Рендер списка папок ---
function renderFolders() {
  foldersList.innerHTML = '';

  // Пункт "Все карточки"
  const allLi = document.createElement('li');
  allLi.textContent = '📂 Все карточки';
  if (activeFolder === 'Все') allLi.classList.add('active');
  allLi.onclick = () => { activeFolder = 'Все'; render(); };
  foldersList.appendChild(allLi);

  // Кастомные папки
  folders.forEach(folder => {
    const li = document.createElement('li');
    li.textContent = `📁 ${folder}`;
    if (activeFolder === folder) li.classList.add('active');
    li.onclick = () => { activeFolder = folder; render(); };
    foldersList.appendChild(li);
  });

  // Обновляем список селекта в модальном окне
  folderSelect.innerHTML = '';
  folders.forEach(folder => {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    folderSelect.appendChild(option);
  });
}

// --- Рендер карточек ---
function renderCards() {
  cardsGrid.innerHTML = '';
  currentFolderTitle.textContent = activeFolder === 'Все' ? 'Все карточки' : `Папка: ${activeFolder}`;

  const filteredCards = activeFolder === 'Все' 
    ? cards 
    : cards.filter(card => card.folder === activeFolder);

  if (filteredCards.length === 0) {
    cardsGrid.innerHTML = '<p style="color: #6b7280;">В этой папке пока нет карточек.</p>';
    return;
  }

  filteredCards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.innerHTML = `
      <button class="delete-card-btn" onclick="deleteCard('${card.id}')">&times;</button>
      ${card.image ? `<img src="${card.image}" alt="${card.word}">` : ''}
      <div class="word">${card.word}</div>
      <div class="translation">${card.translation}</div>
      ${card.definition ? `<div class="definition">${card.definition}</div>` : ''}
    `;
    cardsGrid.appendChild(cardEl);
  });
}

// --- Добавление новой папки ---
addFolderBtn.onclick = () => {
  const name = newFolderInput.value.trim();
  if (name && !folders.includes(name)) {
    folders.push(name);
    newFolderInput.value = '';
    saveData();
    render();
  }
};

// --- Удаление карточки ---
window.deleteCard = (id) => {
  cards = cards.filter(card => card.id !== id);
  saveData();
  render();
};

// --- Модальное окно ---
openModalBtn.onclick = () => modal.classList.remove('hidden');
closeModalBtn.onclick = () => modal.classList.add('hidden');

// --- Добавление карточки (Форма) ---
cardForm.onsubmit = async (e) => {
  e.preventDefault();

  const word = document.getElementById('word-input').value.trim();
  const translation = document.getElementById('translation-input').value.trim();
  const definition = document.getElementById('definition-input').value.trim();
  const folder = folderSelect.value;
  const imageInput = document.getElementById('image-input');

  let imageBase64 = null;
  if (imageInput.files && imageInput.files[0]) {
    imageBase64 = await convertImageToBase64(imageInput.files[0]);
  }

  const newCard = {
    id: Date.now().toString(),
    word,
    translation,
    definition,
    folder,
    image: imageBase64
  };

  cards.push(newCard);
  saveData();

  // Сброс формы и закрытие
  cardForm.reset();
  modal.classList.add('hidden');
  render();
};

// Конвертер изображения в Base64 для хранения в localStorage
function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// --- Общий рендер ---
function render() {
  renderFolders();
  renderCards();
}

// Запуск при старте
render();
