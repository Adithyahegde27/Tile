import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaPlus, FaEdit, FaTrashAlt, FaTh, FaImage, FaRupeeSign, FaTimes, FaBox, FaAlignLeft } from "react-icons/fa";

const ManageTile = () => {
  const [tiles, setTiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTiles = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/tile/get");
      const tilesData = res.data?.tiles || res.data?.data || res.data || [];
      setTiles(Array.isArray(tilesData) ? tilesData : []);
    } catch (error) {
      setTiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/category/get");
      setCategories(res.data?.data || []);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchTiles();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("description", form.description || "");
      formData.append("category", form.category);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (editId) {
        res = await API.put(`/tile/update/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Tile updated successfully!");
      } else {
        res = await API.post("/tile/add", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Tile added successfully!");
      }
      
      setForm({ title: "", price: "", description: "", category: "" });
      setImageFile(null);
      setImagePreview("");
      setEditId(null);
      setIsFormVisible(false);
      fetchTiles();
    } catch (error) {
      console.error("Error submitting tile:", error);
      alert(error.response?.data?.message || "Error saving tile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tile?")) return;
    setDeleteId(id);
    try {
      await API.delete(`/tile/delete/${id}`);
      fetchTiles();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (tile) => {
    setForm({
      title: tile.title,
      price: tile.price,
      image: tile.image,
      category: tile.category?._id
    });
    setEditId(tile._id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setForm({ title: "", price: "", description: "", category: "" });
    setImageFile(null);
    setImagePreview("");
    setEditId(null);
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600 rounded-2xl shadow-lg p-6 mb-6 animate-fadeInUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl animate-bounce">
                <FaTh className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Manage Tiles</h2>
                <p className="text-white/80 text-sm">Add, edit, and delete tiles</p>
              </div>
            </div>
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105"
            >
              <FaPlus />
              {isFormVisible ? "Close Form" : "Add New Tile"}
            </button>
          </div>
          {/* Stats */}
          <div className="mt-4 flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-white font-semibold">{tiles.length}</span>
              <span className="text-white/80 text-sm ml-2">Total Tiles</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-white font-semibold">{categories.length}</span>
              <span className="text-white/80 text-sm ml-2">Categories</span>
            </div>
          </div>
        </div>

        {/* Form */}
        {isFormVisible && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fadeInUp delay-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className={`w-2 h-8 rounded-full ${editId ? "bg-green-500" : "bg-purple-500"}`}></span>
                {editId ? "Edit Tile" : "Add New Tile"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <FaTh className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
                <input
                  type="text"
                  name="title"
                  placeholder="Tile Title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300"
                />
              </div>
              <div className="relative group">
                <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300"
                />
              </div>
              {/* Image Upload */}
              <div className="relative group">
                <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-purple-200" />
                </div>
              )}
              <div className="relative group">
                <FaBox className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {/* Description Field */}
              <div className="relative group md:col-span-2">
                <FaAlignLeft className="absolute left-4 top-4 text-slate-400 group-focus-within:text-purple-500 transition-colors duration-300" />
                <textarea
                  name="description"
                  placeholder="Tile Description (optional)"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-slate-300 resize-none"
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ripple-btn ${
                    editId
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  } text-white hover:scale-105 hover:shadow-lg disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : editId ? (
                    <>
                      <FaEdit /> Update Tile
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Tile
                    </>
                  )}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                  >
                    <FaTimes /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-slate-200 shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-slate-200 rounded shimmer" />
                  <div className="h-8 bg-slate-200 rounded shimmer" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : tiles.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-4">
              <FaBox className="text-5xl text-purple-300 animate-float" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No tiles found</h3>
            <p className="text-slate-400 mb-6">Start by adding your first tile to the inventory</p>
            <button
              onClick={() => setIsFormVisible(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto hover:scale-105 hover:shadow-lg"
            >
              <FaPlus /> Add First Tile
            </button>
          </div>
        ) : (
          /* Tile Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tiles.map((tile, index) => (
              <div
                key={tile._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group animate-fadeInUp card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                    {tile.category?.name || "N/A"}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-slate-800 truncate group-hover:text-purple-600 transition-colors duration-300">
                    {tile.title}
                  </h2>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600 mt-2">
                    ₹ {tile.price}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Category: <span className="text-purple-500 font-medium">{tile.category?.name || "N/A"}</span>
                  </p>
                  
                  {/* Actions */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(tile)}
                      className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-purple-400/30 group/edit"
                    >
                      <FaEdit size={14} className="group-hover/edit:rotate-12 transition-transform duration-300" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(tile._id)}
                      disabled={deleteId === tile._id}
                      className={`bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-red-400/30 ${deleteId === tile._id ? "opacity-70" : ""}`}
                    >
                      {deleteId === tile._id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FaTrashAlt size={14} />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        {tiles.length > 0 && (
          <div className="mt-6 flex justify-between items-center text-sm text-slate-500 animate-fadeInUp delay-300">
            <span>Showing {tiles.length} tiles</span>
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

export default ManageTile;

