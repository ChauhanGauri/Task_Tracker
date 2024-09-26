const taskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-task');
const prioritySelect = document.getElementById('priority');
const sortTasksSelect = document.getElementById('sort-tasks');
const clearAllButton = document.getElementById('clear-all');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function renderTasks() {
    taskList.innerHTML = ''; 
    let filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchInput.value.toLowerCase()));

    
    if (sortTasksSelect.value === 'priority') {
        filteredTasks = filteredTasks.sort((a, b) => priorityToNumber(a.priority) - priorityToNumber(b.priority));
    } else if (sortTasksSelect.value === 'status') {
        filteredTasks = filteredTasks.sort((a, b) => a.completed - b.completed);
    }

    
    if (filteredTasks.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Task Not Found';
        li.style.textAlign = 'center';
        li.style.color = '#888'; 
        li.style.fontStyle = 'italic'; 
        taskList.appendChild(li);
        return;
    }

   
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            ${task.title} - <span class="priority">${task.priority}</span>
            <div>
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="remove-btn">Remove</button>
            </div>
        `;

        
        li.querySelector('.complete-btn').addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveAndRender();
        });

        
        li.querySelector('.edit-btn').addEventListener('click', () => {
            const newTitle = prompt('Edit Task', task.title);
            if (newTitle) {
                tasks[index].title = newTitle;
                saveAndRender();
            }
        });

        
        li.querySelector('.remove-btn').addEventListener('click', () => {
            li.classList.add('removing');
            setTimeout(() => {
                tasks.splice(index, 1);
                saveAndRender();
            }, 500); 
        });

        taskList.appendChild(li);
    });
}


function priorityToNumber(priority) {
    if (priority === 'high') return 3;
    if (priority === 'medium') return 2;
    return 1;
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}


addTaskButton.addEventListener('click', () => {
    const taskTitle = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskTitle === '') return;

    tasks.push({ title: taskTitle, priority, completed: false });
    taskInput.value = '';
    saveAndRender();
});


searchInput.addEventListener('input', renderTasks);


sortTasksSelect.addEventListener('change', renderTasks);


clearAllButton.addEventListener('click', () => {
    tasks = [];
    saveAndRender();
});


renderTasks();