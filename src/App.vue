<template>
  <div class="todo-app">
    <div class="todo-container">
      <h1 class="todo-title">To Do List</h1>
      <div class="input-group">
        <input v-model="newTodo.text" @keyup.enter="addTodo" placeholder="Add new todo" class="todo-input">
        <button @click="addTodo" class="btn add-btn">Add</button>
      </div>
      <div class="input-group">
        <select v-model="newTodo.priority" class="todo-priority">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input type="datetime-local" v-model="newTodo.deadline" class="todo-deadline">
      </div>
      <input v-model="searchKeyword" @input="searchTodo" placeholder="Search todo" class="todo-search">
      <div class="filter-buttons">
        <button @click="filterByStatus('all')" :class="{ 'active': statusFilter === 'all' }">All</button>
        <button @click="filterByStatus('active')" :class="{ 'active': statusFilter === 'active' }">Active</button>
        <button @click="filterByStatus('completed')" :class="{ 'active': statusFilter === 'completed' }">Completed</button>
      </div>
      <table class="todo-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(todo, index) in filteredTodos" :key="index" :class="{ 'completed': todo.completed }">
            <td @click="toggleCompleted(index)" :class="{ 'completed-text': todo.completed }">{{ todo.text }}</td>
            <td class="priority-cell">{{ todo.priority }}</td>
            <td class="deadline-cell">{{ todo.deadline }}</td>
            <td class="action-cell">
              <button @click="removeTodo(index)" class="btn delete-btn">Delete</button>
              <button @click="editTodo(index)" class="btn edit-btn">Edit</button>
              <input type="checkbox" v-model="todo.completed" class="todo-checkbox">
            </td>
          </tr>
        </tbody>
      </table>
      <p class="incomplete-count">Incomplete tasks: {{ incompleteTodosCount }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useTodoStore } from './stores/todoStore';

export default {
  setup() {
    const todoStore = useTodoStore();
    const newTodo = ref({
      text: '',
      priority: 'Low',
      deadline: '',
      completed: false
    });
    const searchKeyword = ref('');
    const statusFilter = ref('all');

    const addTodo = () => {
      if (newTodo.value.text.trim() !== '') {
        todoStore.addTodo({
          ...newTodo.value
        });
        resetNewTodo();
      }
    };

    const removeTodo = (index) => {
      todoStore.removeTodo(index);
    };

    const editTodo = (index) => {
      const editedTodo = todoStore.todos[index];
      newTodo.value = {
        text: editedTodo.text,
        priority: editedTodo.priority,
        deadline: editedTodo.deadline,
        completed: false
      };
      removeTodo(index);
    };

    const resetNewTodo = () => {
      newTodo.value = {
        text: '',
        priority: 'Low',
        deadline: '',
        completed: false
      };
    };

    const toggleCompleted = (index) => {
      todoStore.toggleCompleted(index);
    };

    const filterByStatus = (status) => {
      statusFilter.value = status;
    };

    const filteredTodos = computed(() => {
      return todoStore.todos.filter(todo =>
        todo.text.toLowerCase().includes(searchKeyword.value.toLowerCase()) &&
        (statusFilter.value === 'all' || (statusFilter.value === 'active' && !todo.completed) || (statusFilter.value === 'completed' && todo.completed))
      );
    });

    const incompleteTodosCount = computed(() => {
      return todoStore.incompleteTodosCount;
    });

    return {
      newTodo,
      addTodo,
      removeTodo,
      editTodo,
      resetNewTodo,
      searchKeyword,
      statusFilter,
      filterByStatus,
      filteredTodos,
      toggleCompleted,
      incompleteTodosCount
    };
  }
};
</script>

<style scoped>
.todo-app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e90ff, #00ced1); /* Gradient warna biru laut */
}

.todo-container {
  max-width: 800px;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: #f0ffff; /* Azure */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.todo-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 3em; /* Ukuran font lebih besar */
  font-weight: bold; /* Teks lebih tebal */
  color: #333333;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2); /* Efek 3D */
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.todo-input,
.todo-priority,
.todo-deadline,
.todo-search {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #dddddd;
  border-radius: 5px;
  font-size: 1em;
  color: #555555;
  background-color: #ffffff; /* Putih */
}

.todo-input:focus,
.todo-priority:focus,
.todo-deadline:focus,
.todo-search:focus {
  outline: none;
  border-color: #4682b4; /* Steel Blue for focus */
}

.filter-buttons {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}

.filter-buttons button {
  margin-right: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #20b2aa; /* Light Sea Green */
  color: #ffffff;
  font-size: 1em;
}

.filter-buttons button.active {
  background-color: #5f9ea0; /* Cadet Blue */
  color: #ffffff;
}

.todo-table {
  width: 100%;
  border-collapse: collapse;
}

.todo-table th,
.todo-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dddddd;
  color: #333333;
  font-size: 1em;
}

.todo-table th {
  background-color: #afeeee; /* Pale Turquoise */
  font-weight: 600;
}

.todo-table .priority-cell {
  width: 100px;
}

.todo-table .deadline-cell {
  width: 150px;
}

.todo-table .action-cell {
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.todo-table .completed {
  background-color: #e0ffff; /* Light Cyan for completed tasks */
}

.todo-table .completed-text {
  text-decoration: line-through;
  color: #999999;
}

.todo-checkbox {
  margin-left: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  color: #ffffff;
}

.add-btn {
  background-color: #1e90ff; /* Dodger Blue */
}

.delete-btn {
  background-color: #dc143c; /* Crimson */
}

.edit-btn {
  background-color: #20b2aa; /* Light Sea Green */
}

.btn:hover {
  filter: brightness(90%);
}

.incomplete-count {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2em;
  color: #333333;
}
</style>

