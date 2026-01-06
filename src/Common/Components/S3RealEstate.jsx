import "../Styles/S3RealEstate.css";
import dashboard from "../assets/Dashboard 1.png";
import { FaCheckCircle } from "react-icons/fa";

export default function RealEstateTokens() {
  return (
    <>
         <section className="realestate-section">
      <div className="content-wrapper">

        <h2 className="real-title">
          YOUR REAL ESTATE TOKENS, ALL IN ONE PLACE
        </h2>

        <p className="real-subtitle">
          Manage And Monitor Your Property Investments Effortlessly With Our
          Comprehensive Platform, Designed To Centralize All Your Real Estate
          Tokens For Easy Access And Oversight.
        </p>

        <div className="features">
          <div className="feature-item">
            <FaCheckCircle />
            Track Gain
          </div>
          <div className="feature-item">
            <FaCheckCircle />
            Rental Income Overview
          </div>
          <div className="feature-item">
            <FaCheckCircle />
            Portfolio Diversification
          </div>
          <div className="feature-item">
            <FaCheckCircle />
            Real-Time Updates
          </div>
        </div>

        <div className="dashboard-wrapper">
          <img src={dashboard} alt="Dashboard" />
        </div>

      </div>
    </section>
    </>
   
  );
}
