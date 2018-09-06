
var ToDoList = function(name) {
	var doc = document;
	this.el = list = doc.querySelector('[data-list='+ name +']');
	this.children = this.el.querySelectorAll('li');
	this.del = this.el.querySelector('span');
	this.lastRemoved = [];

	this.input = doc.querySelector('[data-input='+ name +']');
	this.undoBtn = doc.querySelector('[data-undo='+ name +']');

	this.addEntry = function(entry) {
		this.el.innerHTML += '<li>' + entry + '<span class="delete"></span></li>';
	}

	this.init = function() {
		this.removeEntry();
		this.addByInput();
		this.undoRemove();
		this.editEntry();
		this.checkedField();
		this.addByArray([]);
	}
}

ToDoList.prototype.addByArray = function(array) {
	this.array = array;
	var list = this;

	array.forEach(function(item) {
		list.addEntry(item);
	});
}

ToDoList.prototype.addByInput = function() {
	this.input.addEventListener('keyup', function(e) {
		e.preventDefault();

		if (e.keyCode === 13 && e.target.value.length > 0) {
			this.addEntry(e.target.value);
			e.target.value = null;
		}

		this.removeEntry();

	}.bind(this));
}

ToDoList.prototype.removeEntry = function() {
	var del = document.querySelectorAll('.delete');

	for (var i = 0; i < del.length; i++) {
		del[i].addEventListener('click', function(e) {

			if (e.target.nodeName === 'SPAN') {
				var li = e.target.parentElement;
				console.log(e.target.parentElement.textContent);
				this.lastRemoved.push({
					action: 'remove', 
					content: li.textContent
				});

				console.log(this.lastRemoved)
				li.remove();
			}

		}.bind(this));
	}
	
}

ToDoList.prototype.undoRemove = function() {
	this.undoBtn.addEventListener('click', function(e) {
		e.preventDefault();
		var lastEntry = this.lastRemoved.pop();

		if (lastEntry && lastEntry.action == 'remove') {
			console.log(lastEntry)
			this.addEntry(lastEntry.content);
			this.removeEntry();
		} else {
			console.log('no last entry');
		}

	}.bind(this));
}

ToDoList.prototype.editEntry = function() {
	this.el.addEventListener('click', function(e) {
		var _inp = document.querySelectorAll('.editTrue');

		if ($(e.target).siblings('li').children('.editInp').val() == 0 || e.target.className == 'todo--is-done') {
			$('.editInp').focus().end().find('li.editTrue').addClass('animate');

			setTimeout(function() {
				$('.editTrue').removeClass('animate');
			}, 1000);

			return;
		} else {
			$('li').removeClass('editTrue');
		}

		if (e.target.nodeName === 'LI') {
			this.oldVal = e.target.innerText;
			e.target.innerText = null;
			e.target.setAttribute('class', 'editTrue');
			var inp = document.createElement('input');
			this.span = document.createElement('span');
			this.span.setAttribute('class','delete');
			inp.setAttribute('class','editInp');
			inp.setAttribute('type','text');
			e.target.appendChild(inp, this.span);
			inp.focus();
		}
		

		if (e.target.nodeName === 'INPUT') {
			if (e.target.value == 0) {
				$(e.target).parent().html(this.oldVal + '<span class="delete"></span>');
			} else {
				var newVal = e.target.value;
				console.log($(this.el).children('.editInp'));
				$(e.target).parent().html(newVal + '<span class="delete"></span>');
			}

			e.target.remove();
			this.removeEntry();
			this.undoRemove();
		}
		
		
	}.bind(this));
}

ToDoList.prototype.checkedField = function() {
	this.el.addEventListener('mouseup', function(e) {
		var checkedClass = 'todo--is-done';

		if (e.target.className == 'editInp') {
			return;
		}

		if (e.which === 3) {
			$(e.target).addClass(checkedClass);
			console.log('field is checked');
		}

	}.bind(this));
}


var lists = {};

lists.work = lists.work || new ToDoList('work').init();
lists.private = lists.private || new ToDoList('private').init();
