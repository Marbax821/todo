const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')
const clearDone = document.querySelector('#removeDoneTasks')

let tasks = []

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach((task) => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleateTask)
tasksList.addEventListener('click', doneTask)
clearDone.addEventListener('click', deleteDoneTask)

function addTask(event) {
	event.preventDefault()

	const taskText = taskInput.value

	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	}

	tasks.push(newTask)

	saveToLocalStorage()

	renderTask(newTask)

	taskInput.value = ''
	taskInput.focus()

	checkEmptyList()
}

function deleateTask() {
	if (event.target.dataset.action !== 'delete') return

	const parentNode = event.target.closest('.list-group-item')

	const id = Number(parentNode.id)

	tasks = tasks.filter((task) => {
		if (task.id === id) {
			return false
		} else {
			return true
		}
	})

	saveToLocalStorage()

	parentNode.remove()

	checkEmptyList()
}


function doneTask(event) {
	if (event.target.dataset.action !== 'done') return

	const parentNode = event.target.closest('.list-group-item')

	const id = Number(parentNode.id)

	const task = tasks.find((task) => {
		if (task.id === id) {
			return true
		}
	})

	task.done = !task.done

	saveToLocalStorage()

	const taskTitle = parentNode.querySelector('.task-title')
	taskTitle.classList.toggle('task-title--done')

	checkEmptyList()
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emtyListElement = `
			<li id="emptyList" class="list-group-item empty-list">
				<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
				<div class="empty-list__title">Список дел пуст</div>
			</li>
		`
		tasksList.insertAdjacentHTML('afterbegin', emtyListElement)
	}

	if (tasks.length > 0) {
		const emtyListEl = document.querySelector('#emptyList')
		emtyListEl ? emtyListEl.remove() : null
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

	const taskHTML = `
	<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
		<span class="${cssClass}">${task.text}</span>
		<div class="task-item__buttons">
			<button type="button" data-action="done" class="btn-action">
				<img src="./img/tick.svg" alt="Done" width="18" height="18">
			</button>
			<button type="button" data-action="delete" class="btn-action">
				<img src="./img/cross.svg" alt="Done" width="18" height="18">
			</button>
		</div>
	</li>
	`

	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}

function deleteDoneTask() {

	var doneItems = tasksList.querySelectorAll('li span.task-title--done');

	doneItems.forEach(function (item) {
		item.parentNode.remove()
	});

	tasks = tasks.filter((task) => {
		if (task.done === true) {
			return false
		} else {
			return true
		}
	})

	saveToLocalStorage()

	checkEmptyList()
}

