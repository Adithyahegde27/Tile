import React from 'react';
import Logo from "../../assets/Logo.jpg"; 
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { Link } from "react-router-dom";

const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/#",
  },
{
    id: 2,
    name: "About Us",
    link: "/about",
  },
{
    id: 3,
    name: "Contact us",
    link: "/contact",
  },
];

const DropdownLinks = [
  {
    id:5,
    name:"Trending Tiles",
    link:"/login",
  },
  {
    id:6,
    name:"Best Tiles",
    link:"/login",
  },
  {
    id:7,
    name:"Top Rated Tiles",
    link:"/login",
  },
]

function Navbar() {
  const userId = localStorage.getItem("userId");
  
  const userMenu = [
    {
      id: 1,
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      id: 2,
      name: "My Orders",
      link: "/track",
    },
    {
      id: 3,
      name: "View Tiles",
      link: "/tiles",
    },
    {
      id: 4,
      name: "Categories",
      link: "/category",
    },
    {
      id: 5,
      name: "Feedback",
      link: "/feedback",
    },
    {
      id: 6,
      name: "Profile",
      link: "/profile",
    },
  ];

  const handleOrderClick = () => {
    if (userId) {
      window.location.href = "/order";
    } else {
      window.location.href = "/login";
    }
  };

  return (
     <div className="shadow-md bg-white 
     dark:bg-gray-900 dark:text-white duration-200
     relative z-40">

      {/* upper Navbar */}
       <div className="bg-primary/40 py-2">
        <div className="container flex 
        justify-between items-center">
          <div>
            <Link to="/" className="font-bold 
            text-2xl sm:text-3xl flex gap-2">
              <img src={Logo} alt="Logo" 
              className="w-10" />
              Tile
            </Link>
          </div>

          {/* search bar */}
          <div className="flex justify-between
          items-center gap-4">
            <div className="relative group hidden
             sm:block">
              <div>
                <Link to="/login">
                <input type="text" 
                placeholder="search"
                className="w-[200px] sm:w-[200px]
                group-hover:w-[300px] transition-all 
                duration-300 rounded-full border 
                border-gray-300 px-2 py-1 
                focus:outline-none focus:border-1
                focus:border-primary
                dark:border-gray-500
                dark:bg-gray-800 "
                />
                <IoMdSearch className="text-gray-500 
                 group-hover:text-primary absolute 
                 top-1/2 -translate-y-1/2 right-3" />
                 </Link>
                 </div>
            </div>

            {/* order button */}
            <button
               onClick={handleOrderClick}
               className="bg-gradient-to-r from-primary
               to-secondary transition-all duration-200
               text-white py-1 px-4 rounded-full flex
               items-center gap-3 group"
            >
            <span
              className="group-hover:block
              hidden transition-all duration-200">
                Order
            </span>
            <FaCartShopping className="text-xl text-white drop-shadow-sm 
            cursor-pointer" />
          </button>

          {/*User Menu - Show when logged in */}
          {userId ? (
            <div className="relative group">
              <button className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full flex items-center gap-2">
                My Account
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </button>
              <div className="absolute z-[9999] right-0 hidden group-hover:block w-[180px] rounded-md bg-white p-2 text-black shadow-md dark:bg-gray-800 dark:text-white">
                <ul>
                  {userMenu.map((data) => (
                    <li key={data.id}>
                      <Link to={data.link}
                       className="inline-block w-full
                       rounded-md p-2
                       hover:bg-primary/20 "> 
                       {data.name}
                      </Link>
                    </li>
                   ))}
                  <li>
                    <button 
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                      }}
                      className="inline-block w-full rounded-md p-2 text-red-500 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /*Register Button */
            <div className="flex items-center gap-2">
              <Link
               to="/login"
               className="bg-gradient-to-r from-primary
               to-secondary hover:scale-105 duration-200
               text-white py-2 px-4 rounded-full"
               >
               Login
              </Link>
              {/* <Link to="/register" className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200  text-white py-2 px-4 rounded-full" >  Register</Link> */}
            </div>
          )}


          {/* Darkmode Switch */}
          <div>
            <DarkMode />
          </div>
        </div>
       </div>
      </div>
      {/* lower Navbar */}
       <div className="flex justify-center">
         <ul className="sm:flex hidden items-center gap-4">
            {userId ? (
              // Show simplified menu for logged in users
              <>
                <li>
                  <Link to="/dashboard" className="inline-block px-5 hover:text-primary duration-200">Dashboard</Link>
                </li>
                <li>
                  <Link to="/tiles" className="inline-block px-5 hover:text-primary duration-200">Tiles</Link>
                </li>
                <li>
                  <Link to="/category" className="inline-block px-5 hover:text-primary duration-200">Categories</Link>
                </li>
                <li>
                  <Link to="/track" className="inline-block px-5 hover:text-primary duration-200">Track Order</Link>
                </li>
              </>
            ) : (
              // Show default menu for non-logged in users
              <>
                {Menu.map((data)=>(
                  <li key={data.id}>
                    <a href={data.link} className="inline-block px-5 hover:text-primary duration-200">{data.name}</a>
                  </li>
                ))}
                {/*simple dropdown and links */}
                <li className="group relative cursor-pointer">
                  <a href="#" className="flex items-center gap-[2px] py-2 ">
                    Trending Tiles
                    <span>
                      <FaCaretDown 
                        className="transition-all duration-200 
                        group-hover:rotate-180" />
                    </span>
                  </a>
                  <div className="absolute z-[9999] hidden group-hover:block w-[150px] rounded-md bg-white p-2 text-black shadow-md">
                    <ul>
                      {DropdownLinks.map((data) => (
                        <li key={data.id}>
                          <a href={data.link}
                           className="inline-block w-full
                           rounded-md p-2
                           hover:bg-primary/20 "> {data.name}
                          </a>
                        </li>
                       ))}
                    </ul>
                  </div>
                </li>
              </>
            )}
         </ul>
      </div>   
    </div>
  )
}
export default Navbar