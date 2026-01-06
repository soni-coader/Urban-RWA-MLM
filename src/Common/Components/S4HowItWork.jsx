import "../Styles/S4HowItWork.css";
import cardBg from "../assets/how-card-bg-img.jpg"; 

const steps = [
  {
    step: "1",
    title: "Define Objectives",
    desc: "Understand Platform Services And Set Clear Operational Or Participation Goals.",
  },
  {
    step: "2",
    title: "Onboard & Verify",
    desc: "Complete KYC, Compliance Checks, And Activate Platform Access.",
  },
  {
    step: "3",
    title: "Connect & Coordinate",
    desc: "Engage With Verified Real Estate Listings, Referrals, And Service Workflows.",
  },
  {
    step: "4",
    title: "Operate & Scale",
    desc: "Track Performance, Optimize Incentives, And Grow Participation Across The UrbanRWA Ecosystem.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-section">
      <div className="how-container">

        <span className="how-label">HOW IT WORKS</span>

        <h2 className="how-title">
          A simple, proven process to real estate success
        </h2>

        <div className="how-grid">
          {steps.map((item, index) => (
            <div
              className="how-card"
              key={index}
              style={{ backgroundImage: `url(${cardBg})` }}
            >
              <span className="step-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
