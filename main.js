const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  inputBook.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
// Fitur Cari Buku
const searchButton = document.getElementById("searchSubmit");
searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  const searchBook = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const listBook = document.querySelectorAll(".book_item > h3");
  for (dataBuku of listBook) {
    if (dataBuku.innerText.toLowerCase().includes(searchBook)) {
      dataBuku.parentElement.style.display = "block";
    } else {
      dataBuku.parentElement.style.display = "none";
    }
  }
});


function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const checked = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    bookYear,
    checked
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert("Data buku berhasil ditambahkan!");
}

// Generate ID
function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, bookYear, isCompleted) {
  return {
    id,
    title,
    author,
    bookYear,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const unreadBook = document.getElementById("incompleteBookshelfList");
  unreadBook.innerHTML = "";

  const completedBook = document.getElementById("completeBookshelfList");
  completedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      unreadBook.append(bookElement);
    } else {
      completedBook.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = "Penulis : " + bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = "Tahun : " + bookObject.bookYear;

  const textContainer = document.createElement("div");
  textContainer.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(bookTitle, bookAuthor, bookYear, textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const unreadButton = document.createElement("button");
    unreadButton.innerText = "Belum selesai dibaca";
    unreadButton.classList.add("green");

    unreadButton.addEventListener("click", function () {
      unreadFromCompleted(bookObject.id);
    });

    const deleteBookButton = document.createElement("button");
    deleteBookButton.classList.add("red");
    deleteBookButton.innerText = "Hapus buku";
    deleteBookButton.addEventListener("click", function () {
      deleteBookFromCompleted(bookObject.id);
    });

    textContainer.append(unreadButton, deleteBookButton);
  } else {
    const finishedButton = document.createElement("button");
    finishedButton.classList.add("green");
    finishedButton.innerText = "Selesai Dibaca";
    finishedButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", function () {
      deleteBookFromCompleted(bookObject.id);
    });
    textContainer.append(finishedButton, deleteButton);
  }
  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  bookTarget.checked = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert("Buku sudah selesai dibaca!");
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function deleteBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert("Data buku berhasil di hapus!");
}

function unreadFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert("Buku belum selesai dibaca!");
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
