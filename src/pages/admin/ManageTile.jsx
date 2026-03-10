import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

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
  const [editId, setEditId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert("Tile updated successfully!");
      } else {
        await API.post("/tile/add", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Tile added successfully!");
      }
      
      setForm({ title: "", price: "", description: "", category: "" });
      setImageFile(null);
      setEditId(null);
      setIsFormVisible(false);
      fetchTiles();
    } catch (error) {
      console.error("Error submitting tile:", error);
      alert("Error saving tile. Please try again.");
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
      category: tile.category?._id
    });
    setEditId(tile._id);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setForm({ title: "", price: "", description: "", category: "" });
    setImageFile(null);
    setEditId(null);
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Manage Tiles</h2>
              <p className="text-white/80 text-sm">Add, edit, and delete tiles</p>
            </div>
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {isFormVisible ? "Close Form" : "Add New Tile"}
            </button>
          </div>
        </div>

        {/* Form */}
        {isFormVisible && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              {editId ? "Edit Tile" : "Add New Tile"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Tile Title"
                value={form.title}
                onChange={handleChange}
                required
                className="p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                className="p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="p-3 border-2 border-slate-200 rounded-xl"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <textarea
                name="description"
                placeholder="Tile Description (optional)"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="md:col-span-2 p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl font-semibold text-white ${
                    editId ? "bg-green-500" : "bg-purple-500"
                  }`}
                >
                  {editId ? "Update Tile" : "Add Tile"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Tile Grid */}
        {tiles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No tiles found</h3>
            <p className="text-slate-400">Start by adding your first tile</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tiles.map((tile) => (
              <div
                key={tile._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-800">{tile.title}</h3>
                  <p className="text-xl font-bold text-purple-600 mt-1">₹ {tile.price}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Category: {tile.category?.name || "N/A"}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(tile)}
                      className="bg-purple-400 hover:bg-purple-500 px-4 py-2 rounded-lg text-white font-medium"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(tile._id)}
                      className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-medium"
                    >
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
  );
};

export default ManageTile;

