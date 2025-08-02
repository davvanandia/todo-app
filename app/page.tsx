"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

// Definisikan tipe Task
type Task = {
  id: number;
  title: string;
  desc: string;
  done: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Load data awal
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Simpan tasks setiap ada perubahan
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setEditId(null);
  };

  const addTask = () => {
    if (!title.trim()) {
      Swal.fire("Oops!", "Judul tugas tidak boleh kosong!", "error");
      return;
    }

    if (editId) {
      setTasks(
        tasks.map((t) =>
          t.id === editId ? { ...t, title, desc } : t
        )
      );
      Swal.fire("Berhasil!", "Tugas berhasil diupdate", "success");
    } else {
      setTasks([
        ...tasks,
        { id: Date.now(), title, desc, done: false },
      ]);
      Swal.fire("Berhasil!", "Tugas berhasil ditambahkan", "success");
    }

    resetForm();
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id: number) => {
    Swal.fire({
      title: "Hapus tugas ini?",
      text: "Tindakan ini tidak bisa dibatalkan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasks.filter((t) => t.id !== id));
        Swal.fire("Terhapus!", "Tugas berhasil dihapus", "success");
      }
    });
  };

  const editTask = (task: Task) => {
    setTitle(task.title);
    setDesc(task.desc);
    setEditId(task.id);
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center p-6 text-gray-100">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-2xl relative">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-green-400">
          To‑Do List
        </h1>

        {/* Form Input */}
        <div className="mb-8 grid gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul tugas..."
            className="border border-green-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-white"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Deskripsi tugas..."
            className="border border-green-700 rounded-xl px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 text-white resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={addTask}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl font-medium transition"
            >
              {editId ? "Update" : "Tambah"}
            </button>
            {editId && (
              <button
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl font-medium transition"
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* Daftar Tugas */}
        <ul className="space-y-4">
          {tasks.length === 0 && (
            <li className="text-center text-gray-400">
              Belum ada tugas
            </li>
          )}
          {tasks.map((t) => (
            <li
              key={t.id}
              className="bg-gray-700 hover:bg-gray-600 p-5 rounded-xl shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div
                  onClick={() => toggleTask(t.id)}
                  className="cursor-pointer select-none flex-1"
                >
                  <p
                    className={`font-semibold text-lg ${
                      t.done
                        ? "line-through text-gray-400"
                        : "text-green-300"
                    }`}
                  >
                    {t.title}
                  </p>
                  {t.desc && (
                    <p
                      className={`mt-1 text-sm ${
                        t.done
                          ? "line-through text-gray-400"
                          : "text-green-200"
                      }`}
                    >
                      {t.desc}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => editTask(t)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <footer className="mt-10 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Todo App by Davina
        </footer>
      </div>
    </main>
  );
}
