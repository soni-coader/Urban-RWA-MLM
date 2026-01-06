import "../Styles/S5Tokenization.css";
import bgImage from "../assets/token-bg.jpg"; 

export default function TokenizationProcess() {
  return (
    <section
      className="token-section"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay">
        <h2 className="token-heading">
          HOW DOES TOKENIZATION WORK?
        </h2>

        <div className="token-cards">

          <div className="token-card">
            <h3>The Tokenization Process</h3>
            <span className="divider-tok"></span>
            <p>
              Real Estate Tokenization Involves Creating Digital Tokens On A
              Blockchain That Represent Fractional Ownership Of A Property.
              This Process Includes Asset Valuation, Legal Structuring To Ensure
              Compliance With Securities Laws, And Minting Tokens Through A
              Smart Contract Tied To The Asset.
            </p>
          </div>

          <div className="token-card">
            <h3>Income Generation Through Token Ownership</h3>
            <span className="divider-tok"></span>
            <p>
              Token Holders Earn Money Primarily Through Two Channels: Rental
              Income Distributed As Dividends And Potential Appreciation In
              The Token's Value If The Property Increases In Market Value.
              These Earnings Are Typically Automated And Distributed Via
              Blockchain-Based Smart Contracts.
            </p>
          </div>

          <div className="token-card">
            <h3>Secondary Market Trading For Profit</h3>
            <span className="divider-tok"></span>
            <p>
              Token Holders Can Sell Their Tokens On Blockchain-Enabled
              Secondary Markets, Allowing Them To Realize Profits Without
              Waiting For The Property To Be Sold. This Creates A Dynamic
              Investment Environment Where Token Value Fluctuates Based On
              Market Demand And Property Performance.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
