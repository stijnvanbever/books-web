var restService = 'http://localhost:8080/books-rest/webapi/books';

function loadBooks() {
    var xmlhttp = new XMLHttpRequest();
    var url = restService;

    xmlhttp.onload = function() {
        var books = JSON.parse(this.responseText);
        addBooksToTable(books);
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function reloadBooks() {
    document.getElementById("booksBody").innerHTML = "";
    loadBooks();
}

function removeBook(id) {
    var xmlhttp = new XMLHttpRequest();
    var url = restService + "/" + id;

    xmlhttp.onload = function() {
        reloadBooks();  
    }

    xmlhttp.open("DELETE", url, true);
    xmlhttp.send();
}

function addBooksToTable(books) {
    var out = "";
    var i;
    for (i = 0; i < books.length; i++) {
        out += '<tr>' + addTD(books[i].id, 'bookid') + addTD(books[i].author, 'bookauthor') + addTD(books[i].name, 'bookname') + addRemove(books[i].id) + '</tr>';
    }
    document.getElementById("booksBody").innerHTML += out;
}

function addTD(content, tdClass) {
    return '<td class="' + tdClass + '">' + content + '</td>';
}

function addRemove(id) {
    return addTD('<img src="img/remove.png" style="height: 15px; cursor: pointer;" onclick="removeBook(' + id + ')"/>');
}

function filterContent(filter, tdClass) {
	var table, tr, td, i;
	
	table = document.getElementById('booksBody');
	tr = table.getElementsByTagName('tr');
	
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByClassName(tdClass)[0];
		if (td.innerHTML.toUpperCase().indexOf(filter.value.toUpperCase()) > -1) {
			tr[i].style.display = "";
		} else {
			tr[i].style.display = "none";
		}
	}
}

loadBooks();

var form = document.getElementById("addbookform");

form.onsubmit = function(e) {
    // stop the regular form submission
    e.preventDefault();

    // collect the form data while iterating over the inputs
    var data = {};
    for (var i = 0, ii = form.length; i < ii; ++i) {
        var input = form[i];
        if (input.name) {
            data[input.name] = input.value;
        }
    }

    // construct an HTTP request
    var xhr = new XMLHttpRequest();

    xhr.onload = function() {
        reloadBooks();
    };

    xhr.open(form.method, form.action, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));
};
