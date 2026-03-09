import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaPlus, FaEdit, FaTrashAlt, FaTags, FaSearch, FaTimes, FaCheck } from "react-icons/fa";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

    setIsSubmitting(true);
    try {
      await API.post("/category/add", { name: name.trim() });
      setName("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    // Add shake animation delay
    setTimeout(async () => {
      try {
        await API.delete(`/category/delete/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        setDeleteId(null);
      }
    }, 500);
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !editId) return;

    setIsSubmitting(true);
    try {
      await API.put(`/category/update/${editId}`, { name: name.trim() });
      setName("");
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-2xl shadow-lg p-6 mb-6 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl animate-bounce">
                <FaTags className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Manage Categories</h2>
                <p className="text-white/80 text-sm">Add, edit, and delete tile categories</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-semibold">{categories.length}</span>
              <span className="text-white/80 text-sm">Categories</span>
            </div>
          </div>
        </div>

        {/* Add / Update Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fadeInUp delay-100">
          <form onSubmit={editId ? handleUpdate : handleAdd} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors duration-300">
                {editId ? <FaEdit /> : <FaTags />}
              </div>
              <input
                type="text"
                placeholder={editId ? "Update category name" : "Enter category name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 hover:border-slate-300"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className={`px-8 py-3 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 relative overflow-hidden ripple-btn ${
                editId 
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
                  : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
              } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : editId ? (
                <>
                  <FaCheck /> Update
                </>
              ) : (
                <>
                  <FaPlus /> Add Category
                </>
              )}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setName(""); setEditId(null); }}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300 flex items-center gap-2 hover:scale-105"
              >
                <FaTimes /> Cancel
              </button>
            )}
          </form>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative animate-fadeInUp delay-200">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <FaSearch className="animate-pulse" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 hover:border-slate-300 bg-white shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Category List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fadeInUp delay-300">
          {isLoading ? (
            // Loading State with Shimmer
            <div className="p-8">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl shimmer" />
                    <div className="flex-1 h-8 bg-slate-200 rounded-xl shimmer" />
                    <div className="w-32 h-8 bg-slate-200 rounded-xl shimmer" />
                  </div>
                ))}
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            // Empty State
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                <FaTags className="text-4xl text-slate-300 animate-float" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-slate-400">
                {searchTerm 
                  ? "Try searching with a different term" 
                  : "Start by adding your first category"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                  <th className="p-4 text-left rounded-tl-2xl">#</th>
                  <th className="p-4 text-left">Category Name</th>
                  <th className="p-4 text-center rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat, index) => (
                  <tr 
                    key={cat._id} 
                    className={`text-center border-b border-slate-100 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-white transition-all duration-300 group animate-fadeInLeft`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full text-slate-500 font-semibold text-sm group-hover:bg-yellow-400 group-hover:text-white transition-all duration-300">
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 group-hover:text-yellow-600 transition-colors duration-300">
                        {cat.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30 group/edit"
                        >
                          <FaEdit size={14} className="group-hover/edit:rotate-12 transition-transform duration-300" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this category?")) {
                              handleDelete(cat._id);
                            }
                          }}
                          disabled={deleteId === cat._id}
                          className={`bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-red-400/30 ${
                            deleteId === cat._id ? "animate-shake opacity-70" : ""
                          }`}
                        >
                          {deleteId === cat._id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <FaTrashAlt size={14} />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Stats */}
        {categories.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-slate-500 animate-fadeInUp delay-400">
            <span>Showing {filteredCategories.length} of {categories.length} categories</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live updates enabled
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategory;

