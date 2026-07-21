// --- Переводы интерфейса (i18n) ---
const translations = {
  ru: {
    appTitle: "🎴 Flashcards App",
    folders: "Папки",
    newFolderPh: "Новая папка...",
    allCards: "Все карточки",
    allFolder: "📂 Все карточки",
    mainFolder: "Основная",
    folderPrefix: "Папка: ",
    createCard: "+ Создать карточку",
    noCards: "В этой папке пока нет карточек.",
    modalTitleNew: "Новая карточка",
    modalTitleEdit: "Редактировать карточку",
    lblWord: "Слово / Фраза:",
    phWord: "Например: Apple",
    lblTranslation: "Перевод:",
    phTranslation: "Например: Яблоко",
    lblDefinition: "Определение / Контекст (необязательно):",
    phDefinition: "A round fruit with red or green skin...",
    lblSelectFolder: "Выберите папку:",
    lblImage: "Изображение (необязательно):",
    removeImage: "Удалить картинку",
    btnSave: "Сохранить карточку",
    confirmDeleteFolder: 'Удалить папку "{folder}"?\nКарточки из этой папки будут перемещены в папку "{main}".'
  },
  en: {
    appTitle: "🎴 Flashcards App",
    folders: "Folders",
    newFolderPh: "New folder...",
    allCards: "All Flashcards",
    allFolder: "📂 All Flashcards",
    mainFolder: "General",
    folderPrefix: "Folder: ",
    createCard: "+ Add Flashcard",
    noCards: "No flashcards in this folder yet.",
    modalTitleNew: "New Flashcard",
    modalTitleEdit: "Edit Flashcard",
    lblWord: "Word / Phrase:",
    phWord: "E.g., Apple",
    lblTranslation: "Translation:",
    phTranslation: "E.g., Яблоко",
    lblDefinition: "Definition / Context (optional):",
    phDefinition: "A round fruit with red or green skin...",
    lblSelectFolder: "Select Folder:",
    lblImage: "Image (optional):",
    removeImage: "Remove Image",
    btnSave: "Save Flashcard",
    confirmDeleteFolder: 'Delete folder "{folder}"?\nCards from this folder will be moved to "{main}".'
  },
  cs: {
    appTitle: "🎴 Kartičky App",
    folders: "Složky",
    newFolderPh: "Nová složka...",
    allCards: "Všechny kartičky",
    allFolder: "📂 Všechny kartičky",
    mainFolder: "Hlavní",
    folderPrefix: "Složka: ",
    createCard: "+ Přidat kartičku",
    noCards: "V této složce zatím nejsou žádné kartičky.",
    modalTitleNew: "Nová kartička",
    modalTitleEdit: "Upravit kartičku",
    lblWord: "Slovo / Fráze:",
    phWord: "Např. Apple",
    lblTranslation: "Překlad:",
    phTranslation: "Např. Jablko",
    lblDefinition: "Definice / Kontext (volitelné):",
    phDefinition: "A round fruit with red or green skin...",
    lblSelectFolder: "Vyberte složku:",
    lblImage: "Obrázek (volitelné):",
    removeImage: "Odbourat obrázek",
    btnSave: "Uložit kartičku",
    confirmDeleteFolder: 'Smazat složku "{folder}"?\nKartičky из этой složky будут přesunuty do "{main}".'
  },
  es: {
    appTitle: "🎴 Tarjetas App",
    folders: "Carpetas",
    newFolderPh: "Nueva carpeta...",
    allCards: "Todas las tarjetas",
    allFolder: "📂 Todas las tarjetas",
    mainFolder: "Principal",
    folderPrefix: "Carpeta: ",
    createCard: "+ Crear tarjeta",
    noCards: "Aún no hay tarjetas en esta carpeta.",
    modalTitleNew: "Nueva tarjeta",
    modalTitleEdit: "Editar tarjeta",
    lblWord: "Palabra / Frase:",
    phWord: "Ej. Apple",
    lblTranslation: "Traducción:",
    phTranslation: "Ej. Manzana",
    lblDefinition: "Definición / Contexto (opcional):",
    phDefinition: "A round fruit with red or green skin...",
    lblSelectFolder: "Seleccionar carpeta:",
    lblImage: "Imagen (opcional):",
    removeImage: "Eliminar imagen",
    btnSave: "Guardar tarjeta",
    confirmDeleteFolder: '¿Eliminar la carpeta "{folder}"?\nLas tarjetas se moverán a "{main}".'
  }
};

// --- Инициализация состояния ---
let currentLang = localStorage.getItem('flash_lang') || 'ru';
let folders = JSON.parse(localStorage.getItem('flash_folders')) || [translations[currentLang].mainFolder];
let cards = JSON.parse(localStorage.getItem('flash_cards')) || [];
let activeFolder = 'Все';
let editingCardImage = null; // Хранит base64 изображения при редактировании

// --- Элементы DOM ---
const langSelect = document.getElementById('lang-select');
const foldersList = document.getElementById('folders-list');
const cardsGrid = document.getElementById('cards-grid');
const newFolderInput = document.getElementById('new-folder-input');
const addFolderBtn = document.getElementById('add-folder-btn');
const currentFolderTitle = document.getElementById('current-folder-title');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cardForm = document.getElementById('card-form');
const cardIdInput = document.getElementById('card-id-input');
const folderSelect = document.getElementById('folder-select');
const imageInput = document.getElementById('image-input');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image-btn');

// Установка начального языка
langSelect.value = currentLang;

// --- Переключение языка ---
langSelect.onchange = (e) => {
  currentLang = e.target.value;
  localStorage.setItem('flash_lang', currentLang);
  updateUI();
};

function updateUI() {
  const t = translations[currentLang];

  // Перевод текстовых блоков с атрибутом data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  // Перевод плейсхолдеров с атрибутом data-i18n-ph
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key]) el.placeholder = t[key];
  });

  render();
}

// --- Сохранение в localStorage ---
function saveData() {
  localStorage.setItem('flash_folders', JSON.stringify(folders));
  localStorage.setItem('flash_cards', JSON.stringify(cards));
}

// --- Рендер списка папок ---
function renderFolders() {
  const t = translations[currentLang];
  foldersList.innerHTML = '';

  // Пункт "Все карточки"
  const allLi = document.createElement('li');
  allLi.innerHTML = `<span>${t.allFolder}</span>`;
  if (activeFolder === 'Все') allLi.classList.add('active');
  allLi.onclick = () => { activeFolder = 'Все'; render(); };
  foldersList.appendChild(allLi);

  // Кастомные папки
  folders.forEach(folder => {
    const li = document.createElement('li');
    if (activeFolder === folder) li.classList.add('active');
    
    const folderTitle = document.createElement('span');
    folderTitle.textContent = `📁 ${folder}`;
    folderTitle.onclick = () => { activeFolder = folder; render(); };
    li.appendChild(folderTitle);

    // Кнопка удаления (не разрешаем для первой основной папки)
    if (folder !== folders[0]) {
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-folder-btn';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.title = 'Удалить папку';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteFolder(folder);
      };
      li.appendChild(deleteBtn);
    }

    foldersList.appendChild(li);
  });

  // Обновляем селект выбора папки в форме
  folderSelect.innerHTML = '';
  folders.forEach(folder => {
    const option = document.createElement('option');
    option.value = folder;
    option.textContent = folder;
    folderSelect.appendChild(option);
  });
}

// --- Удаление папки ---
function deleteFolder(folderName) {
  const t = translations[currentLang];
  const mainFolderName = folders[0];
  const confirmMsg = t.confirmDeleteFolder
    .replace('{folder}', folderName)
    .replace('{main}', mainFolderName);

  if (!confirm(confirmMsg)) return;

  folders = folders.filter(f => f !== folderName);
  cards = cards.map(card => card.folder === folderName ? { ...card, folder: mainFolderName } : card);

  if (activeFolder === folderName) activeFolder = 'Все';

  saveData();
  render();
}

// --- Рендер карточек ---
function renderCards() {
  const t = translations[currentLang];
  cardsGrid.innerHTML = '';
  currentFolderTitle.textContent = activeFolder === 'Все' ? t.allCards : `${t.folderPrefix}${activeFolder}`;

  const filteredCards = activeFolder === 'Все' 
    ? cards 
    : cards.filter(card => card.folder === activeFolder);

  if (filteredCards.length === 0) {
    cardsGrid.innerHTML = `<p style="color: #6b7280;">${t.noCards}</p>`;
    return;
  }

  filteredCards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.innerHTML = `
      <button class="delete-card-btn" onclick="deleteCard(event, '${card.id}')">&times;</button>
      ${card.image ? `<img src="${card.image}" alt="${card.word}">` : ''}
      <div class="word">${card.word}</div>
      <div class="translation">${card.translation}</div>
      ${card.definition ? `<div class="definition">${card.definition}</div>` : ''}
    `;

    // Клик по всей карточке вызывает редактирование
    cardEl.onclick = () => openEditModal(card);

    cardsGrid.appendChild(cardEl);
  });
}

// --- Удаление карточки ---
window.deleteCard = (e, id) => {
  e.stopPropagation(); // Предотвращаем открытие модалки редактирования при клике на крестик
  cards = cards.filter(card => card.id !== id);
  saveData();
  render();
};

// --- Добавление новой папки ---
addFolderBtn.onclick = () => {
  const name = newFolderInput.value.trim();
  if (name && !folders.includes(name) && name !== 'Все') {
    folders.push(name);
    newFolderInput.value = '';
    saveData();
    render();
  }
};

// --- Открытие модалки создания ---
openModalBtn.onclick = () => {
  cardForm.reset();
  cardIdInput.value = '';
  editingCardImage = null;
  imagePreviewContainer.classList.add('hidden');
  modalTitle.textContent = translations[currentLang].modalTitleNew;
  
  // По умолчанию выбираем текущую активную папку (если это не "Все")
  folderSelect.value = (activeFolder !== 'Все' && folders.includes(activeFolder)) ? activeFolder : folders[0];
  modal.classList.remove('hidden');
};

// --- Открытие модалки редактирования ---
function openEditModal(card) {
  cardIdInput.value = card.id;
  document.getElementById('word-input').value = card.word;
  document.getElementById('translation-input').value = card.translation;
  document.getElementById('definition-input').value = card.definition || '';
  folderSelect.value = folders.includes(card.folder) ? card.folder : folders[0];

  editingCardImage = card.image || null;
  if (editingCardImage) {
    imagePreview.src = editingCardImage;
    imagePreviewContainer.classList.remove('hidden');
  } else {
    imagePreviewContainer.classList.add('hidden');
  }

  imageInput.value = ''; // сброс инпута файла
  modalTitle.textContent = translations[currentLang].modalTitleEdit;
  modal.classList.remove('hidden');
}

// --- Удаление картинки из редактируемой карточки ---
removeImageBtn.onclick = () => {
  editingCardImage = null;
  imageInput.value = '';
  imagePreviewContainer.classList.add('hidden');
};

// --- Закрытие модального окна ---
closeModalBtn.onclick = () => modal.classList.add('hidden');

// --- Обработка отправки формы (Создание / Редактирование) ---
cardForm.onsubmit = async (e) => {
  e.preventDefault();

  const id = cardIdInput.value;
  const word = document.getElementById('word-input').value.trim();
  const translation = document.getElementById('translation-input').value.trim();
  const definition = document.getElementById('definition-input').value.trim();
  const folder = folderSelect.value;

  let imageBase64 = editingCardImage;

  // Если выбран новый файл изображения
  if (imageInput.files && imageInput.files[0]) {
    imageBase64 = await convertImageToBase64(imageInput.files[0]);
  }

  if (id) {
    // Редактирование существующей карточки
    cards = cards.map(c => c.id === id ? { ...c, word, translation, definition, folder, image: imageBase64 } : c);
  } else {
    // Создание новой карточки
    const newCard = {
      id: Date.now().toString(),
      word,
      translation,
      definition,
      folder,
      image: imageBase64
    };
    cards.push(newCard);
  }

  saveData();
  modal.classList.add('hidden');
  render();
};

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

// Старт приложения с обновлением UI под текущий язык
updateUI();
