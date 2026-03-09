import React from 'react'
import Img1 from "../../assets/latest/bathroom.jpg"
import Img2 from "../../assets/latest/bedroom.jpg"
import Img3 from "../../assets/latest/living.jpg"
// import Img4 from "../../assets/latest/outdoor.jpg"
import { FaStar } from "react-icons/fa"
import { Link } from "react-router-dom";


const ProductsData = [
 {
   id: 1,
   img: Img1,
   title: "upto 50% off",
   description:
   "Stylish decorative tiles that add personality and creativity to walls, kitchens, and bathrooms.",
 },
 {
   id: 2,
   img: Img2,
   title: "upto 50% off",
   description:
   "High-strength, low-porosity tiles ideal for both residential and commercial spaces. Known for their glossy finish, durability, and easy maintenance.",
 },
 {
   id: 3,
   img: Img3,
   title: "upto 50% off",
   description:
   "Elegant marble-look tiles that bring a luxurious and premium feel to any room. Perfect for living rooms, hallways, and upscale interiors.",
 },
//  {
//    id: 4,
//    img: Img4,
//    title: "upto 50% off",
//    description:
//    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, eaque.",
//  },
]


function LatestProducts() {
  return (
    <div>
        <div className="container">
            {/*Header section*/}
            <div className="text-left mb-24 ">
                <p data-aos="fade-up" className="text-sm text-primary">
                    Latest Products
                </p>
                <h1 data-aos="fade-up" className="text-3xl font-bold">
                    Products 
                </h1>
                <p data-aos="fade-up" className="text-xs text-gray-400">
                    write here later ....
                </p>
              </div>
            {/* body section */}
            <div className="grid grid-cols-1 sm:grid-cols-2
            md:grid-cols-3 gap-20 md:gap-5 place-items-center">
              {ProductsData.map((data) => (
                <div 
                 key={data.id}
                 data-aos="zoom-in"
                 className="rounded-2xl bg-white dark:bg-gray-800
                 hover:bg-black/80 dark:hover:bg-primary 
                 hover:text-white relative shadow-xl duration-300 group max-w-[300px]">
                    {/* image section */}
                    <div className="h-[100px]">
                      <img 
                       src={data.img} 
                       alt=""
                       className="max-w-[140px] block mx-auto transform
                       -translate-y-20 group-hover:scale-105 duration-300
                       drop-shadow-md"
                      />
                    </div>
                    {/* datails section */}
                    <div className="p-4 text-center">
                      {/*star rating*/}
                      <div className="w-full flex items-center justify-center gap-1">
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                      </div>
                      <h1 className="text-xl font-bold">{data.title}</h1>
                      <p className="text-gray-500 
                       group-hover:text-white duration-300 
                        text-sm line-clamp-2">
                           {data.description}
                      </p>
                      <button className="bg-primary hover:scale-105 
                       duration-300 text-white py-1 px-4
                       rounded-full mt-4 group-hover:bg-white
                     group-hover:text-primary "
                      //  onClick={handleOrderPopup}
                      ><Link to="/login">
                        Order Now
                      </Link>
                      </button>
                    </div>
                </div>
             ))}
            </div>
        </div>
    </div>
  )
}
export default LatestProducts