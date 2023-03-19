const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []

// проверка localStorage при загрузке приложения, если в нем есть данные тогда поместить их в список дел
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	// рендер задач
	tasks.forEach((task) => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleateTask)
tasksList.addEventListener('click', doneTask)

function addTask(event) {
	// отмена отправки формы
	event.preventDefault()


	// достаем текст задачи из поля ввода
	const taskText = taskInput.value


	// описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	}

	// добавляем задачу в массив с задачами
	tasks.push(newTask)

	// сохраняем списки задач в хранилище браузера LocalStorage
	saveToLocalStorage()

	renderTask(newTask)

	// очищаем поле ввода и возвращаем на него фокус
	taskInput.value = ''
	taskInput.focus()

	checkEmptyList()

	//saveHTMLtoLS()
}

function deleateTask() {
	// проверяем что клик был НЕ по кнопке "удалить задачу"
	if (event.target.dataset.action !== 'delete') return

	const parentNode = event.target.closest('.list-group-item')

	//  определяем ID задачи(и присвоить его к числу)
	const id = Number(parentNode.id)

	/*
	// * (1) находим индекс задачи в массиве
	const index = tasks.findIndex((task) => {
		if (task.id === id) {
			return true
		}
	})

	// удаляем задачу из массива
	tasks.splice(index, 1)
	*/

	// ! (1) либо с помощью метода filter / Удаляем задачу через фильтрацию массива
	tasks = tasks.filter((task) => {
		if (task.id === id) {
			return false
		} else {
			return true
		}
	})

	// сохраняем списки задач в хранилище браузера LocalStorage
	saveToLocalStorage()

	// удаляем задачу из разметки
	parentNode.remove()

	checkEmptyList()

	//saveHTMLtoLS()
}


function doneTask(event) {
	if (event.target.dataset.action !== 'done') return

	const parentNode = event.target.closest('.list-group-item')

	// определяем ID задачи
	const id = Number(parentNode.id)

	// если функция при иттерации цикла на каком то моменте возвращает true, считается что этот елемент найден и он будет возвращен
	const task = tasks.find((task) => {
		if (task.id === id) {
			return true
		}
	})

	// task.done равняется обратному значению task.done
	task.done = !task.done

	// сохраняем списки задач в хранилище браузера LocalStorage
	saveToLocalStorage()

	const taskTitle = parentNode.querySelector('.task-title')
	taskTitle.classList.toggle('task-title--done')

	checkEmptyList()


	//saveHTMLtoLS()
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

// сохраняем списки задач в хранилище браузера LocalStorage
function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Рендерим задачу на странице
function renderTask(task) {
	// формируем css класс
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title'


	// формируемразметку для новой задачи
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

	// добавляем задачу на страницу
	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}


// ! АНТИ паттерн с записью в локал сторейдж всей разметки списка
// if (localStorage.getItem('tasksHTML')) {
// 	tasksList.innerHTML = localStorage.getItem('tasksHTML')
// }

// function saveHTMLtoLS() {
// 	localStorage.setItem('tasksHTML', tasksList.innerHTML)
// }