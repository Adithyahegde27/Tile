import React from 'react'
import Slider from "react-slick"

const TestimonialData = [
    {
        id: 1,
        name: "John doe",
        text: "With a strong focus on quality, affordability and very good products from here modern designs and reliable tile solutions.",
        img: "https://picsum.photos/101/101",
    },
    {
        id: 2,
        name: "Jerome stanly",
        text: "Wide variety of modern designs at reasonable prices. Customer service was very supportive throughout the process.",
        img: "https://picsum.photos/102/102",
    },
    {
        id: 3,
        name: "Jevin crasta ",
        text: "We purchased tiles for our office renovation, and the results were amazing. Stylish, affordable, and long-lasting.",
        img: "https://picsum.photos/103/103",
    },
    {
        id: 4,
        name: "Adithya hegde",
        text: "Excellent designs and very durable tiles. The team was professional and delivered on time. Great experience overall.",
        img: "https://picsum.photos/104/104",
    },
    {
        id: 5,
        name: "Manish shetty",
        text: "The quality of tiles is outstanding. Our home looks completely transformed, and the finishing is perfect.",
        img: "https://picsum.photos/105/105",
    },
]

function Testimonials (){

    var settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "linear",
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
                breakpoint: 10000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

  return (
    <div className="py-10 mb-10">
        <div className="container">
            { /* header section */ }
            <div className="text-center mb-10 max-w-[600px] mx-auto">
                <p data-aos="fade-up" className="text-sm text-primary">What our customers are saying</p>
                <h1 data-aos="fade-up" className="text-3xl font-bold">Testimonials</h1>
                <p data-aos="fade-up" className="text-xs text-gray-400">
                  Our trusted customer we provide you best quality everytime.</p>
            </div>

            {/* testimonials cards */}
            <div data-aos="zoom-in">
                <Slider {...settings}>
                  {TestimonialData.map((data) => (
                    <div key={data.id} className="my-6">
                       <div
                         className="flex flex-col gap-4 shadow-lg
                         py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 
                         bg-primary/10 relative"
                        >
                          <div className="mb-4">
                            <img src={data.img} 
                             alt={data.name} 
                             className="rounded-full w-20 h-20" 
                            />
                          </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="space-y-3">
                                  <p className="text-xs text-gray-500">
                                    {data.text}</p>
                                  <h1 className="text-xl font-bold
                                  text-black/80 dark:text-light">
                                    {data.name}
                                  </h1>
                                </div>
                            </div>
                            <p className="text-black/20 text-9xl font-serif
                             absolute top-0 right-0">,,
                            </p>
                        </div> 
                    </div>    
                  ))}
                </Slider>
            </div>
        </div>
    </div>
  )
}
export default Testimonials