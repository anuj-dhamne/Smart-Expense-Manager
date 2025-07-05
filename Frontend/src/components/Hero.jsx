// src/components/HeroSection.jsx
import heroImage from "../assets/hero_img.avif";
import {useNavigate} from "react-router-dom"

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6 shadow">
        <h1 className="text-3xl font-extrabold" style={{ color: '#4b74ed' }}>
          Buck<span style={{ color: '#66c1ba' }}>Bit</span>
        </h1>
        <button onClick={()=>{navigate("/login")}} className="border-2 border-[#4b74ed] text-[#4b74ed] px-6 py-2 rounded-full font-semibold transition transform hover:scale-105 hover:bg-[#4b74ed] hover:text-white hover:shadow-md">
          Get Started →
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between px-10 py-10 max-w-7xl mx-auto">
        {/* Left Content – 65% */}
        <div className="w-full md:w-2/3 mb-10 md:mb-0">
          <h2 className="text-5xl md:text-6xl font-black leading-tight mb-6 text-[#4b74ed]">
            Take control of your <br /> expenses today.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium">
            BuckBit helps you manage, track, and optimize your expenses with ease.
            Get insightful AI summaries and monthly reports to stay financially fit.
          </p>
          <button onClick={()=>{navigate("/login")}} className="bg-[#66c1ba] hover:bg-[#58a69f] text-white px-8 py-3 rounded-lg text-lg font-semibold transition transform hover:scale-105 hover:shadow-lg">
            Start Your Journey →
          </button>
        </div>

        {/* Right Image – 35% */}
        <div className="w-full md:w-1/3 transition-transform duration-300 ease-in-out hover:scale-105">
          <img
            src={heroImage}
            alt="Smart Expenses Dashboard"
            className="w-full max-w-md mx-auto rounded-xl shadow-md"
          />
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
