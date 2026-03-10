import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import API from "../../services/api";
import { FaPlus, FaEdit, FaTrashAlt, FaTh, FaSearch, FaFilter, FaTimes, FaImage, FaRupeeSign, FaBox } from "react-icons/fa";

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
  const [previewImage, setPreviewImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);

  useEffect(() => {
    setAnimated(true);
    fetchTiles();
    fetchCategories();
  }, []);

  const fetchTiles = async () => {
    try {
      const res = await API.get("/tile/get");
      const tilesData = res.data?.tiles || res.data?.data || res.data || [];
      setTiles(Array.isArray(tilesData) ? tilesData : []);
    } catch (error) {
      setTiles([]);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
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

      if (editId) {
        await API.put(`/tile/update/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await API.post("/tile/add", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      
      handleCancel();
      fetchTiles();
    } catch (error) {
      console.error("Error submitting tile:", error);
      alert("Error saving tile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tile?")) return;
    try {
      await API.delete(`/tile/delete/${id}`);
      fetchTiles();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (tile) => {
    setForm({
      title: tile.title,
      price: tile.price,
      description: tile.description || "",
      category: tile.category?._id
    });
    setPreviewImage(tile.image);
    setEditId(tile._id);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setForm({ title: "", price: "", description: "", category: "" });
    setImageFile(null);
    setPreviewImage(null);
    setEditId(null);
    setIsFormVisible(false);
  };

  const filteredTiles = tiles.filter(tile => {
    const matchesSearch = tile.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || tile.category?._id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className={`relative overflow-hidden bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <FaTh className="text-white text-3xl" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white">
                      {tiles.length}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Tile Management</h2>
                    <p className="text-purple-100 mt-1">Add, edit, and manage your tile inventory</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsFormVisible(!isFormVisible)}
                  className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {isFormVisible ? <FaTimes /> : <FaPlus />}
                  {isFormVisible ? "Close Form" : "Add Tile"}
                </button>
              </div>

              {/* Stats Cards */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaBox className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs">Total Tiles</p>
                      <p className="text-white font-bold text-xl">{tiles.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaTh className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs">Categories</p>
                      <p className="text-white font-bold text-xl">{categories.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaImage className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs">With Images</p>
                      <p className="text-white font-bold text-xl">{tiles.filter(t => t.image).length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className={`bg-white rounded-2xl shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '100ms' }}>
            <div className="relative flex-1 max-w-lg w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tiles by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-base"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-purple-100 text-purple-600 rounded-xl font-medium">
                <FaFilter className="inline mr-2" />
                {filteredTiles.length} {filteredTiles.length === 1 ? 'tile' : 'tiles'}
              </div>
            </div>
          </div>

          {/* Form Section */}
          {isFormVisible && (
            <div className={`bg-white rounded-3xl shadow-lg overflow-hidden mb-6 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`} style={{ transitionDelay: '150ms' }}>
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-500 to-cyan-500">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {editId ? <FaEdit /> : <FaPlus />}
                  {editId ? "Edit Tile" : "Add New Tile"}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-3">Tile Image</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="tile-image"
                      />
                      <label htmlFor="tile-image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all group">
                        {previewImage ? (
                          <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <>
                            <FaImage className="text-4xl text-slate-300 mb-2 group-hover:text-purple-400 transition-colors" />
                            <span className="text-slate-400 group-hover:text-purple-500 transition-colors">Click to upload image</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Tile Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-2">Price</label>
                      <div className="relative">
                        <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          name="price"
                          placeholder="Price"
                          value={form.price}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-2">Category</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-base"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-2">Description (Optional)</label>
                      <textarea
                        name="description"
                        placeholder="Tile Description"
                        value={form.description}
                        onChange={handleChange}
                        rows={2}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 ${editId ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" : "bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"}`}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : editId ? (
                      <>Update Tile</>
                    ) : (
                      <>Add Tile</>
                    )}
                  </button>
                  {editId && (
                    <button type="button" onClick={handleCancel} className="px-8 py-4 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all hover:scale-105">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Tiles Grid */}
          {filteredTiles.length === 0 ? (
            <div className={`bg-white rounded-2xl shadow-lg p-16 text-center transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: '200ms' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTh className="text-slate-400 text-4xl" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-600 mb-2">
                {searchTerm || categoryFilter ? "No tiles found" : "No tiles yet"}
              </h3>
              <p className="text-slate-400">
                {searchTerm || categoryFilter ? "Try different search criteria" : "Start by adding your first tile"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTiles.map((tile, index) => (
                <div
                  key={tile._id}
                  className={`bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${selectedTile === tile._id ? 'ring-2 ring-purple-500' : ''}`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                  onClick={() => setSelectedTile(selectedTile === tile._id ? null : tile._id)}
                >
                  <div className="relative overflow-hidden">
                    <img src={tile.image} alt={tile.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-purple-600 shadow-lg">
                        ₹ {tile.price}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">{tile.title}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                        {tile.category?.name || "Uncategorized"}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {tile.description?.substring(0, 25)}...
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(tile); }} className="flex-1 bg-purple-500 hover:bg-purple-600 hover:scale-105 px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(tile._id); }} className="bg-red-500 hover:bg-red-600 hover:scale-105 px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 shadow-lg shadow-red-500/20">
                        <FaTrashAlt />
                      </button>
                    </div>
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

export default ManageTile;

