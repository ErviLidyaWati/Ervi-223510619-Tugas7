// src/stores/todoStore.js
import { defineStore } from 'pinia';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: JSON.parse(localStorage.getItem('todos')) || [],
  }),
  actions: {
    addTodo(todo) {
      this.todos.push(todo);
      this.saveToLocalStorage();
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
      this.saveToLocalStorage();
    },
    toggleCompleted(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  },
  getters: {
    incompleteTodosCount() {
      return this.todos.filter(todo => !todo.completed).length;
    }
  }
});
