import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { FaTags, FaChevronRight, FaLayerGroup, FaTshirt, FaBath, FaHome, FaCube } from "react-icons/fa";

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/category/get");
      setCategories(res.data.data);
    } catch (error) {
      // Use demo categories if API fails
      setCategories(demoCategories);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const demoCategories = [
    { _id: "1", name: "Floor Tiles", description: "Durable floor tiles for every room" },
    { _id: "2", name: "Wall Tiles", description: "Beautiful wall decorations" },
    { _id: "3", name: "Bathroom Tiles", description: "Water-resistant bathroom tiles" },
    { _id: "4", name: "Kitchen Tiles", description: "Easy to clean kitchen tiles" },
    { _id: "5", name: "Outdoor Tiles", description: "Weather-resistant outdoor tiles" },
    { _id: "6", name: "Marble Tiles", description: "Elegant marble finishes" },
    { _id: "7", name: "Ceramic Tiles", description: "Classic ceramic designs" },
    { _id: "8", name: "Porcelain Tiles", description: "Premium porcelain options" }
  ];

  const getIcon = (index) => {
    const icons = [<FaLayerGroup />, <FaTshirt />, <FaBath />, <FaHome />, <FaCube />, <FaCube />, <FaCube />, <FaCube />];
    return icons[index % icons.length];
  };

  const getRandomColor = (index) => {
    const colors = [
      { from: "from-pink-400", to: "to-rose-500", bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-600 dark:text-pink-400" },
      { from: "from-purple-400", to: "to-violet-500", bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
      { from: "from-blue-400", to: "to-cyan-500", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
      { from: "from-green-400", to: "to-emerald-500", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" },
      { from: "from-yellow-400", to: "to-orange-500", bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
      { from: "from-red-400", to: "to-pink-500", bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400" },
      { from: "from-indigo-400", to: "to-blue-500", bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400" },
      { from: "from-teal-400", to: "to-cyan-500", bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-600 dark:text-teal-400" },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 pt-16">
      <div className="w-full p-8">
        {/* Header */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-lg shadow-yellow-400/30">
              <FaTags className="text-2xl text-slate-900" />
            </div>
            Explore Categories
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 ml-16">Browse our collection of tile categories</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: "Categories", value: categories.length, icon: <FaTags />, color: "from-purple-400 to-purple-500" },
            { label: "Floor Tiles", value: 24, icon: <FaLayerGroup />, color: "from-blue-400 to-blue-500" },
            { label: "Wall Tiles", value: 18, icon: <FaHome />, color: "from-green-400 to-green-500" },
            { label: "Premium", value: 8, icon: <FaCube />, color: "from-yellow-400 to-orange-500" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slideIn border border-slate-100 dark:border-slate-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white mb-2`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => {
              const color = getRandomColor(index);
              const icon = getIcon(index);
              return (
                <div
                  key={cat._id}
                  className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group border border-slate-100 dark:border-slate-700 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    {/* Icon Circle */}
                    <div className={`w-20 h-20 bg-gradient-to-r ${color.from} ${color.to} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <span className="text-white text-3xl">{icon}</span>
                    </div>

                    {/* Category Name */}
                    <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-2 group-hover:text-yellow-600 transition-colors">
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-4">
                      {cat.description || "Explore our premium tiles"}
                    </p>

                    {/* Explore Button */}
                    <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      <span className="text-sm font-medium">Explore</span>
                      <FaChevronRight className="text-sm group-hover:translate-x-2 transition-transform duration-300" />
                    </div>

                    {/* Animated Underline */}
                    <div className={`mt-4 h-1 w-0 bg-gradient-to-r ${color.from} ${color.to} mx-auto rounded-full transition-all duration-500 group-hover:w-24`}></div>
                  </div>

                  {/* Decorative Corner */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${color.from} ${color.to} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full`}></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && categories.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg dark:shadow-slate-900/50 p-16 text-center animate-fadeIn border border-slate-100 dark:border-slate-700">
            <FaTags className="text-7xl text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <p className="text-slate-500 dark:text-slate-400 text-xl">No categories available</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        .animate-slideIn { animation: slideIn 0.5s ease forwards; }
      `}</style>
    </div>
  );
};

export default ViewCategory;

