import { useState } from "react";

const faqs = [
  {
    question: "What is BuckBit?",
    answer: "BuckBit is your smart financial assistant that helps you manage expenses, track patterns, and receive monthly summaries and savings suggestions through AI-powered insights.",
  },
  {
    question: "How does BuckBit generate monthly reports?",
    answer: "At the beginning of each month, BuckBit automatically generates a PDF report of your previous month's expenses and sends it directly to your email.",
  },
  {
    question: "Can BuckBit suggest ways to save money?",
    answer: "Yes! Based on your spending habits, BuckBit uses LLMs to analyze and suggest personalized ways to reduce unnecessary spending and boost savings.",
  },
  {
    question: "Is my data secure with BuckBit?",
    answer: "Absolutely. We use modern encryption techniques to store and handle your data securely, keeping your financial information safe and private.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto text-gray-800">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-[#4b74ed]">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-md p-4 bg-white shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
               onClick={() => toggleFAQ(index)}>
            <div className="flex items-center text-lg font-semibold text-[#4b74ed]">
              <span className="mr-3 text-xl transition duration-300">
                {openIndex === index ? "˅" : ">"}
              </span>
              {faq.question}
            </div>
            <div
              className={`text-gray-600 overflow-hidden transition-all duration-300 ease-in-out mt-2 ${
                openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="mt-2">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
