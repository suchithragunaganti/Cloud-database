// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";

// Firebase configuration object (replace with your actual config object)
const firebaseConfig = {
    apiKey: "AIzaSyBs0U_Bsld1ZC5659Nz0eTjBtdA-SBW6H0",
    authDomain: "todolist-bb13d.firebaseapp.com",
    projectId: "todolist-bb13d",
    storageBucket: "todolist-bb13d.firebasestorage.app",
    messagingSenderId: "32736020967",
    appId: "1:32736020967:web:38bb6db47e611992061542",
    measurementId: "G-J92GJE33NK"

};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const addTaskBtn = document.getElementById('addTaskBtn');
const newTaskInput = document.getElementById('newTask');
const tasksList = document.getElementById('tasksList');
const clearAllBtn = document.getElementById('clearAllBtn');

// Function to add a new task
const addTask = async () => {
  const taskName = newTaskInput.value.trim();
  
  if (taskName) {
    try {
      await addDoc(collection(db, "tasks"), {
        name: taskName,
        done: false
      });
      newTaskInput.value = ''; // Clear input after adding
      loadTasks(); // Refresh the tasks list
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }
};

// Function to load tasks from Firestore
const loadTasks = async () => {
  tasksList.innerHTML = ''; // Clear current task list
  
  const querySnapshot = await getDocs(collection(db, "tasks"));
  querySnapshot.forEach((doc) => {
    const task = doc.data();
    const taskId = doc.id;
    
    const taskElement = document.createElement('li');
    taskElement.classList.add('task');
    if (task.done) taskElement.classList.add('completed');
    
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = task.done;
    taskCheckbox.addEventListener('change', () => toggleTaskStatus(taskId, taskCheckbox.checked));
    
    const taskText = document.createElement('span');
    taskText.textContent = task.name;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => deleteTask(taskId));
    
    taskElement.appendChild(taskCheckbox);
    taskElement.appendChild(taskText);
    taskElement.appendChild(deleteButton);
    tasksList.appendChild(taskElement);
  });
};

// Function to toggle task completion status
const toggleTaskStatus = async (taskId, isDone) => {
  try {
    await updateDoc(doc(db, "tasks", taskId), {
      done: isDone
    });
    loadTasks(); // Refresh the tasks list
  } catch (error) {
    console.error("Error updating task status: ", error);
  }
};

// Function to delete a task
const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    loadTasks(); // Refresh the tasks list
  } catch (error) {
    console.error("Error deleting task: ", error);
  }
};

// Function to clear all tasks
const clearAllTasks = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
  loadTasks(); // Refresh the tasks list
};

// Event listeners
addTaskBtn.addEventListener('click', addTask);
clearAllBtn.addEventListener('click', clearAllTasks);

// Load tasks initially
loadTasks();