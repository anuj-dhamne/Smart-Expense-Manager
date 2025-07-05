// src/components/WhyBuckBit.jsx

const features = [
  {
    title: "Easy to use",
    description: "Our simple interface helps you track and manage expenses effortlessly.",
    icon: "✅"
  },
  {
    title: "Categorization",
    description: "Smart AI categorizes your expenses automatically based on your description.",
    icon: "🏷️"
  },
  {
    title: "AI-Driven Insights",
    description: "Get personalized financial insights powered by AI for smarter decisions.",
    icon: "🤖"
  },
  {
    title: "Monthly Report via Mail",
    description: "Receive a detailed PDF report of your spending habits every month.",
    icon: "📧"
  },
  {
    title: "Daily Tracking",
    description: "Log and categorize your expenses daily to stay on top of your spending.",
    icon: "📅"
  },
  {
    title: "Suggestions to Save",
    description: "AI analyzes your patterns and gives smart tips to cut costs and save more.",
    icon: "💡"
  }
];

const WhyBuckBit = () => {
  return (
    <section className="py-10 bg-white text-gray-800 px-6 md:px-10 max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-[#4b74ed]">
        Why <span className="text-[#66c1ba]">BuckBit?</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 text-center transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-[#4b74ed] mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyBuckBit;
