import { useNavigate } from "react-router-dom";
const FinalCTA = () => {
const navigate =useNavigate();
  return (
    <section className="text-center py-20 bg-white px-6 md:px-10 text-gray-800">
      <h2 className="text-4xl md:text-5xl font-extrabold text-[#4b74ed] mb-4">
        Ready to Master Your Spending?
      </h2>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium">
        With <span className="text-[#66c1ba] font-semibold">BuckBit</span>, effortlessly track your expenses,
        get AI-powered savings suggestions, and receive smart monthly reports — all designed to help you take control of your financial future.
      </p>
      <button onClick={()=>{navigate("/login")}}  className="bg-[#66c1ba] hover:bg-[#58a69f] text-white px-8 py-3 rounded-full text-lg font-semibold transition-transform transform hover:scale-105 shadow-md">
        Start Saving Smarter →
      </button>
    </section>
  );
};

export default FinalCTA;
