// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editId, setEditId] = useState(null);

  // Load data awal (tasks)
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));

    // Set dark mode permanen
    document.documentElement.classList.add("dark");
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
      Swal.fire("Whopp", "Tugas gaboleh kosong ya...", "error");
      return;
    }

    if (editId) {
      setTasks(
        tasks.map((t) =>
          t.id === editId ? { ...t, title, desc } : t
        )
      );
      Swal.fire("Working cuy!", "Tugas berhasil diupdate", "success");
    } else {
      setTasks([
        ...tasks,
        { id: Date.now(), title, desc, done: false },
      ]);
      Swal.fire("Mantap!", "Tugas berhasil ditambahkan", "success");
    }

    resetForm();
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id) => {
    Swal.fire({
      title: "Mau hapus tugas ini?",
      text: "Tindakan ini tidak bisa dibatalkan yah",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Iya hapus aja",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks(tasks.filter((t) => t.id !== id));
        Swal.fire("Terhapus!", "Tugas berhasil dihapus", "success");
      }
    });
  };

  const editTask = (task) => {
    setTitle(task.title);
    setDesc(task.desc);
    setEditId(task.id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center p-6">
      <div className="bg-gray-900 text-gray-100 shadow-xl rounded-2xl p-8 w-full max-w-2xl flex flex-col">
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
            className="border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-800"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Deskripsi tugas..."
            className="border border-gray-700 rounded-xl px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-800 resize-none"
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
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-5 py-2 rounded-xl font-medium transition"
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* Daftar Tugas */}
        <ul className="space-y-4 flex-1">
          {tasks.length === 0 && (
            <li className="text-center text-gray-400">
              Belum ada tugas
            </li>
          )}
          {tasks.map((t) => (
            <li
              key={t.id}
              className="bg-gray-800 hover:bg-gray-700 p-5 rounded-xl shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div
                  onClick={() => toggleTask(t.id)}
                  className="cursor-pointer select-none flex-1"
                >
                  <p
                    className={`font-semibold text-lg ${
                      t.done
                        ? "line-through text-gray-500"
                        : "text-green-300"
                    }`}
                  >
                    {t.title}
                  </p>
                  {t.desc && (
                    <p
                      className={`mt-1 text-sm ${
                        t.done
                          ? "line-through text-gray-500"
                          : "text-green-400"
                      }`}
                    >
                      {t.desc}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => editTask(t)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition"
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
        <footer className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} To‑Do List App. Dapinskuyy.
        </footer>
      </div>
    </main>
  );
}
