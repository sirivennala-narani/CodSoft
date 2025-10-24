import tkinter as tk
from tkinter import messagebox
import os

FILE_NAME = "tasks.txt"

def load_tasks():
    """Load tasks from the file."""
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            tasks = file.readlines()
            for task in tasks:
                task_list.insert(tk.END, task.strip())

def save_tasks():
    """Save tasks to the file."""
    with open(FILE_NAME, "w") as file:
        tasks = task_list.get(0, tk.END)
        for task in tasks:
            file.write(task + "\n")

def add_task():
    """Add a new task."""
    task = task_entry.get()
    if task != "":
        task_list.insert(tk.END, task)
        task_entry.delete(0, tk.END)
        save_tasks()
    else:
        messagebox.showwarning("Warning", "Please enter a task!")

def delete_task():
    """Delete selected task."""
    try:
        selected = task_list.curselection()[0]
        task_list.delete(selected)
        save_tasks()
    except IndexError:
        messagebox.showwarning("Warning", "Please select a task to delete!")

def clear_tasks():
    """Clear all tasks."""
    if messagebox.askyesno("Confirm", "Delete all tasks?"):
        task_list.delete(0, tk.END)
        save_tasks()


window = tk.Tk()
window.title("To-Do List App")
window.geometry("400x450")
window.config(bg="#f4f4f4")


task_entry = tk.Entry(window, font=("Arial", 14), width=25)
task_entry.pack(pady=10)

button_frame = tk.Frame(window, bg="#f4f4f4")
button_frame.pack(pady=5)

add_button = tk.Button(button_frame, text="Add Task", command=add_task, bg="#4CAF50", fg="white", width=10)
add_button.grid(row=0, column=0, padx=5)

delete_button = tk.Button(button_frame, text="Delete Task", command=delete_task, bg="#FF6347", fg="white", width=10)
delete_button.grid(row=0, column=1, padx=5)

clear_button = tk.Button(button_frame, text="Clear All", command=clear_tasks, bg="#555", fg="white", width=10)
clear_button.grid(row=0, column=2, padx=5)


task_list = tk.Listbox(window, font=("Arial", 14), width=35, height=15, selectmode=tk.SINGLE, bg="white", fg="black")
task_list.pack(pady=10)


load_tasks()

window.mainloop()
