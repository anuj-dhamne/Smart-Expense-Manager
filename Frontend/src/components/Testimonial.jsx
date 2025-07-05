// src/components/Testimonials.jsx

const testimonials = [
  {
    quote: "BuckBit has completely changed the way I track my finances. I feel more confident now!",
    highlight: "completely changed",
    name: "Ravi Deshmukh"
  },
  {
    quote: "Thanks to BuckBit, I'm finally consistent with budgeting. Amazing product!",
    highlight: "finally consistent",
    name: "Sakshi Jadhav"
  },
  {
    quote: "The AI suggestions are incredibly useful. It’s like having a financial mentor!",
    highlight: "incredibly useful",
    name: "Neha Kulkarni"
  }
];

const Testimonials = () => {
  return (
    <section className="py-10 px-6 md:px-10 max-w-7xl mx-auto bg-white text-gray-800">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-[#4b74ed]">
        What Our <span className="text-[#66c1ba]">Users Say</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <p className="text-lg italic text-gray-700 mb-4">
              {t.quote.split(t.highlight)[0]}
              <span className="text-[#66c1ba] font-semibold italic">{t.highlight}</span>
              {t.quote.split(t.highlight)[1]}
            </p>
            <p className="font-bold text-[#4b74ed]">– {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
