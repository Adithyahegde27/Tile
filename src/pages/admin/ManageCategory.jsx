import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/category/get");
      setCategories(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await API.post("/category/add", { name: name.trim() });
      setName("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await API.delete(`/category/delete/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !editId) return;

    try {
      await API.put(`/category/update/${editId}`, { name: name.trim() });
      setName("");
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Categories</h2>
          <p className="text-white/80 text-sm">Add, edit, and delete tile categories</p>
        </div>

        {/* Add / Update Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <form onSubmit={editId ? handleUpdate : handleAdd} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder={editId ? "Update category name" : "Enter category name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className={`px-6 py-3 text-white font-semibold rounded-xl transition-all ${
                editId ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
              } disabled:opacity-50`}
            >
              {editId ? "Update" : "Add Category"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setName(""); setEditId(null); }}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Category List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No categories yet</h3>
              <p className="text-slate-400">Start by adding your first category</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Category Name</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-semibold text-slate-800">{cat.name}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg text-white font-medium"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-medium"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCategory;

