// Book Class: Represents a Book
class Book {
	constructor(title, author, doi){
		this.title = title;
		this.author = author;
		this.doi = doi;
	}
}

// UI Class: Handle User Interface Task
class UI {
	static displayBooks() {
		const storedBooks = Store.getBooks();

		const books = storedBooks;

		books.forEach((book) => UI.addBookToList(book));
	}

	static addBookToList(book) {
		const list = document.querySelector('#bookList');
		const row = document.createElement('tr');

		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.doi}</td>
			<td><a href="#" class="btn delete">X</a></td>
		`;

		list.appendChild(row);

	}

	static deleteBook(el) {
		if(el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}


	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert ${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.row');
		const form = document.querySelector('#bookForm');
		container.insertBefore(div, form);

		// Let Alert clear in 3secs
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}

	static clearFields() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#doi').value = '';
	}
}

// Store Class: Handles the local Storage
class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}

		return books;
	}

	static addBook(book) {
		const books = Store.getBooks();

		books.push(book);

		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(doi) {
		const books = Store.getBooks();

		books.forEach((book, index) => {
			if (book.doi === doi) {
				books.splice(index, 1);
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#bookForm').addEventListener('submit', (e)=> 
	{
		// Prevent actual submit
		e.preventDefault();

		// Get form values
		const title = document.querySelector('#title').value;
		const author = document.querySelector('#author').value;
		const doi = document.querySelector('#doi').value;

		
		// Validate
		if(title === '' || author === '' || doi === '') {
			UI.showAlert('Please fill in all fields', 'danger');
		} else {

		// Instantiate Book
		const book = new Book(title, author, doi);

		// Add book to list
		UI.addBookToList(book);

		// Add book to Store
		Store.addBook(book);


		// Show Success Message
		UI.showAlert('Book Added', 'success');

		// Clear Fields
		UI.clearFields();

		}

	});

// Event: Remove a Book
document.querySelector('#bookList').addEventListener('click', (e)=> 
{
	// Remove Book from UI
	UI.deleteBook(e.target);

	// Remove Book from Store
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

	// Show Success message
	UI.showAlert('Book Removed', 'success');
});