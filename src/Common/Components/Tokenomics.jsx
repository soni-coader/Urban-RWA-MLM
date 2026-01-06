import "../Styles/Tokenomics.css";
import tokenomicsImg from "../assets/tokenn.png";

export default function Tokenomics() {
  return (
    <section className="tokenomics">
      <div className="container">

        {/* Heading */}
        <div className="tokenomics-header">
          <span className="tokenomics-tag">TOKENOMICS</span>
          <h2>
            Enable smarter real estate operations with UrbanRWA
          </h2>
        </div>

        {/* TOKENOMICS IMAGE ONLY */}
        <div className="tokenomics-graph">
          <img src={tokenomicsImg} alt="Tokenomics" />
        </div>

        {/* Bottom Info Boxes */}
        <div className="token-info">
          <div className="info-box">
            <div className="left-h">Token Name</div>
            <div className="connectline"></div>
            <div className="right-v">Urban RWA</div>
          </div>

          <div className="info-box">
            <div className="left-h">Symbol</div>
            <div className="connectline"></div>
            <div className="right-v">URWA</div>
          </div>

          <div className="info-box">
            <div className="left-h">Network</div>
            <div className="connectline"></div>
            <div className="right-v">ERC 20</div>
          </div>

          <div className="info-box">
            <div className="left-h">Total Supply</div>
            <div className="connectline"></div>
            <div className="right-v">10 Billion</div>
          </div>

          <div className="info-box">
            <div className="left-h">Decimal</div>
            <div className="connectline"></div>
            <div className="right-v">18</div>
          </div>
        </div>

      </div>
    </section>
  );
}
