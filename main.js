const authorInput = document.querySelector("#author");
const titleInput = document.querySelector("#title");
const pagesInput = document.querySelector("#pages");
const addBookBtn = document.querySelector("#addBookBtn");

const booksList = document.querySelector(".books");
const errorText = document.querySelector(".errorText");

let newBook = false;
let isEditing = false;

addBookBtn.addEventListener("click", addBook);
if (localStorage.getItem("books") != null) showBooks();
showStatistics();

function addBook() {
  if (
    authorInput.value != "" &&
    titleInput.value != "" &&
    pagesInput.value != ""
  ) {
    if (pagesInput.value < 0) {
      showError("negativeNumber");
    } else {
      const book = {
        author: authorInput.value,
        title: titleInput.value,
        pages: pagesInput.value,
      };
      if (localStorage.getItem("books") === null) {
        const books = [];
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
      } else {
        const books = JSON.parse(localStorage.getItem("books"));
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
      }

      authorInput.value = "";
      titleInput.value = "";
      pagesInput.value = "";

      showError("newBook");
      newBook = true;
      showBooks();
      showStatistics();
    }
  } else {
    showError("fillFields");
  }
  isEditing = false;
}
function showBooks() {
  const books = JSON.parse(localStorage.getItem("books"));
  booksList.innerHTML = "";

  for (let i = books.length - 1; i >= 0; i--) {
    booksList.innerHTML += `
        <li class="book" id=${i}>
          <div class="book-info">
            <div class="info-row">
              <label>Author: </label>
              <input type="text" class="bookAuthor" value="${books[i].author}" readonly/>
            </div>
            <div class="info-row">
            <label>Title: </label>
            <input type="text" class="bookTitle" value="${books[i].title}" readonly/>
            </div>
            <div class="info-row">
            <label>Pages: </label>
            <input type="text" class="bookPages" value="${books[i].pages}" readonly/>
            </div>
          </div>
          <div class="buttons">
              <button onclick="completeBook(${i})" class="completeBtn"></button>
              <button onclick="removeBook(${i})" class="removeBtn"></button>
              <button onclick="editBook(${i},'edit')" class="editBtn"></button>
              <button onclick="editBook(${i}, 'save')" class="saveBtn"></button>
              <button onclick="editBook(${i}, 'cancel')" class="cancelBtn"></button>
          </div>
        </li>
      `;
  }
  if (newBook) {
    booksList.children[0].style.cssText = "animation: showUp 1.5s forwards; ";
  }
}

function removeBook(id) {
  if (isEditing == false) {
    const books = JSON.parse(localStorage.getItem("books"));
    for (let i = 0; i < books.length; i++) {
      if (i == id) {
        books.splice(i, 1);
        const moveBook = document.querySelector(`#${CSS.escape(i)}`);
        moveBook.style.cssText = "animation: remove 1s forwards";
      }
    }
    localStorage.setItem("books", JSON.stringify(books));
    newBook = false;
    showError("removeBook");

    setTimeout(showBooks, 1000);
    setTimeout(showStatistics, 1000);
  }
}
function completeBook(id) {
  if (isEditing == false) {
    const books = JSON.parse(localStorage.getItem("books"));

    let readBooksNr = 0;
    let readPagesNr = 0;
    if (localStorage.getItem("finishedBooks") != null) {
      readBooksNr = localStorage.getItem("finishedBooks");
      readPagesNr = parseInt(localStorage.getItem("readPagesNr"));
    }

    for (let i = 0; i < books.length; i++) {
      if (i == id) {
        const moveBook = document.querySelector(`#${CSS.escape(i)}`);
        moveBook.style.cssText = "animation: remove 1s forwards";
        readBooksNr++;
        readPagesNr += parseInt(books[i].pages);
        books.splice(i, 1);
      }
    }
    localStorage.setItem("books", JSON.stringify(books));

    localStorage.setItem("finishedBooks", readBooksNr);
    localStorage.setItem("readPagesNr", readPagesNr);
    newBook = false;
    showError("completeBook");
    setTimeout(showBooks, 1000);
    setTimeout(showStatistics, 1000);
  }
}
function editBook(id, option) {
  newBook = false;
  const books = JSON.parse(localStorage.getItem("books"));
  const whichBook = document.querySelector(`#${CSS.escape(id)}`);
  const textInputs = whichBook.querySelectorAll("input");

  const saveBtn = whichBook.querySelector(".saveBtn");
  const cancelBtn = whichBook.querySelector(".cancelBtn");
  const completeBtn = whichBook.querySelector(".completeBtn");
  const removeBtn = whichBook.querySelector(".removeBtn");
  const editBtn = whichBook.querySelector(".editBtn");

  if (option == "edit" && isEditing == false) {
    for (let i = 0; i < textInputs.length; i++) {
      textInputs[i].readOnly = false;
      textInputs[i].style.cssText = "border-bottom:1px solid #ff3c3c";
    }
    whichBook.style.cssText = "  animation: pulse 2s infinite;";

    saveBtn.style.display = "block";
    cancelBtn.style.display = "block";
    completeBtn.style.display = "none";
    removeBtn.style.display = "none";
    editBtn.style.display = "none";

    isEditing = true;
  } else if (option == "save") {
    for (let i = 0; i < textInputs.length; i++) {
      textInputs[i].readOnly = true;
      textInputs[i].style.cssText = "border-bottom: none";
    }
    whichBook.style.cssText = "  animation: none";
    books[id].author = textInputs[0].value;
    books[id].title = textInputs[1].value;
    books[id].pages = textInputs[2].value;

    localStorage.setItem("books", JSON.stringify(books));

    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    completeBtn.style.display = "block";
    removeBtn.style.display = "block";
    editBtn.style.display = "block";

    isEditing = false;
  } else if (option == "cancel") {
    isEditing = false;
    showBooks();
  }
}

function showStatistics() {
  const totalBooks = document.querySelector(".totalBooksNr");
  const completedBooks = document.querySelector(".readBooksNr");
  const readPagesNr = document.querySelector(".readPagesNr");

  if (booksList.children.length == 0) totalBooks.textContent = 0;
  else totalBooks.textContent = booksList.children.length;

  if (localStorage.getItem("finishedBooks") == null)
    completedBooks.textContent = 0;
  else completedBooks.textContent = localStorage.getItem("finishedBooks");

  if (localStorage.getItem("readPagesNr") == null) readPagesNr.textContent = 0;
  else readPagesNr.textContent = localStorage.getItem("readPagesNr");
}

function showError(whichText) {
  switch (whichText) {
    case "newBook":
      errorText.textContent = "You just added a new book!";

      addBookBtn.style.pointerEvents = "none";
      booksList.style.pointerEvents = "none";
      setTimeout(function () {
        addBookBtn.style.pointerEvents = "auto";
        booksList.style.pointerEvents = "auto";
      }, 2000);
      break;

    case "fillFields":
      errorText.textContent = "Fill up all the fields!";

      break;

    case "negativeNumber":
      errorText.textContent = "Pages cannot have negative numbers!";
      break;

    case "removeBook":
      errorText.textContent = `The book has been removed`;
      booksList.style.pointerEvents = "none";
      setTimeout(function () {
        booksList.style.pointerEvents = "auto";
      }, 2000);
      break;

    case "completeBook":
      errorText.textContent = `The book has been finished!`;
      booksList.style.pointerEvents = "none";
      setTimeout(function () {
        booksList.style.pointerEvents = "auto";
      }, 2000);
      break;
  }

  errorText.style.display = "block";
  setTimeout(function () {
    errorText.style.display = "none";
  }, 3000);
}
