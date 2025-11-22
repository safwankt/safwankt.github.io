// Grab DOM elements
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyMessage = document.getElementById('empty-message');

// Safely ask for notification permission (if supported)
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission().catch(() => {
    // Ignore errors for now
  });
}

// Handle form submit (Add button or Enter key)
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    return;
  }

  addTask(text);
  input.value = '';
  input.focus();
  updateEmptyMessage();
});

// Create and append a new task
function addTask(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-item__checkbox';
  checkbox.setAttribute('aria-label', 'Mark task complete');

  const span = document.createElement('span');
  span.className = 'todo-item__text';
  span.textContent = text;

  const reminderButton = document.createElement('button');
  reminderButton.type = 'button';
  reminderButton.className = 'todo-item__reminder';
  reminderButton.textContent = '🔔';
  reminderButton.setAttribute('aria-label', 'Set reminder');

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'todo-item__remove';
  removeButton.textContent = '×';
  removeButton.setAttribute('aria-label', 'Delete task');

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(reminderButton);
  li.appendChild(removeButton);
  list.appendChild(li);
}

// Event delegation
list.addEventListener('click', function (event) {
  const target = event.target;

  // Delete task
  if (target.classList.contains('todo-item__remove')) {
    const item = target.closest('.todo-item');
    if (item) {
      item.remove();
      updateEmptyMessage();
    }
    return;
  }

  // Toggle complete (text or checkbox)
  if (
    target.classList.contains('todo-item__text') ||
    target.classList.contains('todo-item__checkbox')
  ) {
    const item = target.closest('.todo-item');
    if (item) {
      item.classList.toggle('completed');
      const checkbox = item.querySelector('.todo-item__checkbox');
      if (checkbox) {
        checkbox.checked = item.classList.contains('completed');
      }
    }
    return;
  }

  // Reminder
  if (target.classList.contains('todo-item__reminder')) {
    const item = target.closest('.todo-item');
    const textEl = item.querySelector('.todo-item__text');
    const taskText = textEl ? textEl.textContent : 'Task';

    if (!('Notification' in window)) {
      alert('Notifications are not supported in this browser.');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Reminder', {
        body: taskText
        // icon: 'icon.png'  // Optional
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Reminder', { body: taskText });
        }
      });
    } else {
      alert('Notifications are blocked in your browser settings.');
    }
  }
});

// Show / hide "empty" message
function updateEmptyMessage() {
  const hasTasks = list.children.length > 0;
  emptyMessage.style.display = hasTasks ? 'none' : 'block';
}

// Initial state
updateEmptyMessage();
