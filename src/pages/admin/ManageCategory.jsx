import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import API from "../../services/api";
import { FaPlus, FaEdit, FaTrashAlt, FaLayerGroup, FaCheck, FaTimes, FaSearch, FaFilter, FaThLarge } from "react-icons/fa";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setAnimated(true);
    fetchCategories();
  }, []);

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

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await API.post("/category/add", { name: name.trim() });
      setName("");
      fetchCategories();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSubmitting(false);
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
    setShowForm(true);
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
      setShowForm(false);
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancel = () => {
    setName("");
    setEditId(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={`relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 rounded-3xl shadow-2xl p-8 mb-8 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse animate-pulse" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <FaLayerGroup className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white">
                      {categories.length}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Category Management</h2>
                    <p className="text-rose-100 mt-1">Organize and manage your tile categories</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {showForm ? <FaTimes /> : <FaPlus />}
                  {showForm ? "Close" : "Add Category"}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaLayerGroup className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs">Total</p>
                      <p className="text-white font-bold text-xl">{categories.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaThLarge className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs">Active</p>
                      <p className="text-white font-bold text-xl">{categories.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className={`bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '100ms' }}>
            <div className="relative flex-1 max-w-lg w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all text-base"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-rose-100 text-rose-600 rounded-xl font-medium">
                <FaFilter className="inline mr-2" />
                {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
              </div>
            </div>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6 transition-all duration-700">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-rose-500 to-pink-500">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {editId ? <FaEdit /> : <FaPlus />}
                  {editId ? "Edit Category" : "Add New Category"}
                </h3>
              </div>
              <form onSubmit={editId ? handleUpdate : handleAdd} className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={editId ? "Update category name" : "Enter category name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all text-lg"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={!name.trim() || isSubmitting}
                      className={`px-8 py-4 text-white font-semibold rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 ${
                        editId ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : editId ? (
                        <>
                          <FaCheck /> Update
                        </>
                      ) : (
                        <>
                          <FaPlus /> Add
                        </>
                      )}
                    </button>
                    {editId && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-4 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Categories Grid */}
          {isLoading ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-500 mt-4 text-lg">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLayerGroup className="text-slate-400 text-4xl" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-600 mb-2">
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-slate-400">
                {searchTerm ? "Try a different search term" : "Start by adding your first category"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((cat, index) => (
                <div
                  key={cat._id}
                  className={`bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${selectedCategory === cat._id ? 'ring-2 ring-rose-500' : ''}`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                  onClick={() => setSelectedCategory(selectedCategory === cat._id ? null : cat._id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform duration-300">
                        <FaLayerGroup className="text-white text-2xl" />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(cat); }}
                          className="w-9 h-9 bg-rose-100 hover:bg-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(cat._id); }}
                          className="w-9 h-9 bg-red-100 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">
                      {cat.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently added'}
                      </span>
                      <span className="text-rose-500 font-semibold text-sm">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover Action Bar */}
                  <div className="px-6 py-3 bg-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(cat); }}
                      className="text-rose-500 hover:text-rose-700 font-medium text-sm flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(cat._id); }}
                      className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCategory;

