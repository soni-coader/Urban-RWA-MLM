import { useState } from "react";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import "../Styles/S8Faqs.css";

const faqData = [
  {
    question: "What Is UrbanRWA?",
    answer:
      "UrbanRWA is a real-world asset enablement platform that integrates global real estate operations with a compliant Web3 utility layer to improve coordination, transparency, and efficiency.",
  },
  {
    question: "What Is The UrbanRWA Token (URWA)?",
    answer:
      "URWA is the native utility token used within the UrbanRWA ecosystem to access platform features, incentives, and governance utilities.",
  },
  {
    question: "Does UrbanRWA Tokenize Real Estate?",
    answer:
      "Yes, UrbanRWA enables compliant real estate tokenization, allowing fractional ownership and transparent asset management using blockchain technology.",
  },
  {
    question: "Is URWA An Investment Or Security?",
    answer:
      "URWA is designed as a utility token. Its classification may vary by jurisdiction and complies with applicable regulatory frameworks.",
  },
  {
    question: "How Can URWA Be Used?",
    answer:
      "URWA can be used for platform access, service payments, incentives, governance participation, and ecosystem utilities.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-container">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-left-bar"></div>

            <div className="faq-content">
              <div className="faq-question">
                <h4>{item.question}</h4>
                <span className="faq-icon">
                    {activeIndex === index ? <FaArrowUpLong /> : <FaArrowDownLong />}
                </span>
              </div>

              {activeIndex === index && (
                <p className="faq-answer">{item.answer}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
