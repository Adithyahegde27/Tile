import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function DarkMode() {
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : "light"
  );

  const element = document.documentElement;

  React.useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <div>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="text-xl p-2 rounded-full bg-gray-200 dark:bg-gray-700 
                   text-gray-800 dark:text-yellow-400 
                   transition duration-300 hover:scale-110"
      >
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
}

export default DarkMode;
