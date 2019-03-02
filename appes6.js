class Book{
    constructor(title, auther, isbn){
        this.title =  title;
        this.auther =  auther;
        this.isbn = isbn;   
    }

}

class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');
        // Create tr element
        const row = document.createElement('tr');
       // Insert cols
       row.innerHTML = `
            <td>${ book.title }</td>
            <td>${ book.auther }</td>
            <td>${ book.isbn }</td>
            <td><a class="btn btn-danger btn-xs "><i class="fa fa-trash-o delete-book"></i></a></td>
       `;
       list.appendChild(row); 
    }
    clearFields(){
        document.getElementById('title').value =  '';
        document.getElementById('auther').value =  '';
        document.getElementById('isbn').value =  '';
    }
    showAlert(message, className){
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${ className }`;
        // Add text 
        div.appendChild(document.createTextNode(message)); 
        // Get parent
        const container = document.querySelector('.panel-body');
        // Get from
        const form = document.querySelector('#book-form');
        // Insert alert
        container.insertBefore(div, form);
        // Hire after 3 seconds
        setTimeout(function(){
            document.querySelector('.alert').remove();
        },3000);
    }
    deleteBook(target){
        if(target.className === 'fa fa-trash-o delete-book') { 
            target.parentElement.parentElement.parentElement.remove();
        }
    }
}

// Local Storage class
class Store{
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else { 
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBook() {
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI;
            // Add book to UI
            ui.addBookToList(book);
        });
    }
    
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach(function(book, index){
            if(book.isbn === isbn) {
                books.splice(index, 1);
            } 
        });        
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBook);

// Event Listener fro add book
document.getElementById('book-form').addEventListener('submit', function(e){
    // Get form values
    const title = document.getElementById('title').value,
         auther = document.getElementById('auther').value,
         isbn = document.getElementById('isbn').value;
    
    // Instantiate book  
    const book = new Book(title, auther, isbn);

    // Instantiate UI object
    const ui = new UI();
    console.log(ui);

    // Validate
    if(title === '' || auther === '' || isbn === '') {
        // Error alert
        ui.showAlert('Please fill in all fields', 'alert alert-danger');
    } else {
        // Add book to list 
        ui.addBookToList(book);

        // Add to LS
        Store.addBook(book);
        // Show  success
        ui.showAlert('Book Added!', 'alert alert-success');
    
        // Clear fields
        ui.clearFields();
    } 
    e.preventDefault();
});

// Event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
    // Instantiate UI
    const ui = new UI();
    // Delete book
    ui.deleteBook(e.target);   
    // Remove from LS 
    Store.removeBook(e.target.parentElement.parentElement.previousElementSibling.textContent);
    // Show alert
    ui.showAlert('Book Deleted!' , 'alert alert-success');
    e.preventDefault();
});