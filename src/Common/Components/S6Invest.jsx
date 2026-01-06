import "../Styles/S6Invest.css";
import buildingImg from "../assets/invest.png";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

export default function InvestNow() {
  return (
    <section id="invest" className="invest-section">

      {/* Top Label */}
      <div className="invest-top-label">INVEST NOW</div>

      {/* Heading */}
      <h2 className="invest-heading">
        Enable smarter real estate operations with UrbanRWA.
      </h2>

      {/* Main Layout */}
      <div className="invest-layout">

        {/* Left Floating Box */}
        <div className="invest-float-box">
          Real Estate,<br />
          Made is<br />
          Remarkably<br />
          Simple
        </div>

        {/* Left Bottom Text */}
        <div className="invest-left-text">
          <h4>Join the UrbanRWA Platform</h4>
          <p>
            Access a compliant Web3 platform to
            streamline real estate coordination, incentives,
            and global operations—without investments or
            ownership.
          </p>
        </div>

        {/* Center Image */}
        <div className="invest-image">
          <img src={buildingImg} alt="Building" />

          <button className="invest-now-btn">
            INVEST NOW <BsArrowUpRightCircleFill />
          </button>
        </div>

        {/* Right Text */}
        <div className="invest-right-text">
          <h4>Build Smarter Real Estate Operations</h4>
          <p>
            Whether you're an agent, market, or partner, our
            compliant platform helps you streamline workflows,
            align incentives, and scale participation globally.
          </p>
        </div>

      </div>
    </section>
  );
}
