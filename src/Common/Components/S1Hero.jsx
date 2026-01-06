import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import "../Styles/S1Hero.css";
import { Link } from 'react-router-dom';


const locations = ["New York", "California", "Texas", "Florida", "Georgia", "Nevada"];
const propertyTypes = ["Villa", "Apartment", "Bungalow", "Penthouse", "Studio", "Duplex"];
const prices = ["$50k", "$100k", "$150k", "$200k", "$250k", "$300k"];

export default function Hero() {
  const [open, setOpen] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    type: "Bungalow",
    price: "$5.00",
  });

  const selectValue = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setOpen(null);
  };


  return (
    <>
       <section className="hero">
      {/* LEFT */}

      <div className="hero-up">
        <h2 className="h2-hero">Bridging <span>Real Estate</span> with Compliant Web3 Solutions</h2>

        <div className="buttons">
             <Link
                to="/" className ="find-btn">
            Find Properties
          </Link>
           <Link
                to="https://urbanrwa.gitbook.io/urbanrwa-docs/" target="blank" className ="wht-btn">
            Whitepaper
          </Link>
        </div>
      </div>


      {/* <div className="hero-left">
        <h2 className="hero-h2">
          Bridging Real Estate with Compliant Web3 Solutions
        </h2>
        <p className="hero-p">
          UrbanRWA is a Real-World Asset (RWA) enablement platform
          revolutionizing how global real estate operations function.
        </p>
        <button className="primary-btn">Find Properties</button>
      </div>

      <div className="hero-right">
        <div className="single-property">
          <img src={heroImg} alt="Property" />
        </div>
      </div> */}

      {/* SEARCH BAR */}
      <div className="search-bar-main">
        <div className="search-bar">

          {/* LOCATION */}
          <div className="dropdown">
            <div
              className="field"
              onClick={() => setOpen(open === "loc" ? null : "loc")}
            >
              <span className="field-label">
                Location {open === "loc" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
              <span className="field-value">
                {filters.location || "Enter your location"}
              </span>
            </div>

            {open === "loc" && (
              <ul>
                {locations.map((item) => (
                  <li key={item} onClick={() => selectValue("location", item)}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="divider"></div>

          {/* PROPERTY TYPE */}
          <div className="dropdown">
            <div
              className="field"
              onClick={() => setOpen(open === "type" ? null : "type")}
            >
              <span className="field-label">
                Property Type {open === "type" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
              <span className="field-value">{filters.type}</span>
            </div>

            {open === "type" && (
              <ul>
                {propertyTypes.map((item) => (
                  <li key={item} onClick={() => selectValue("type", item)}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="divider"></div>

          {/* MAX PRICE */}
          <div className="dropdown">
            <div
              className="field"
              onClick={() => setOpen(open === "price" ? null : "price")}
            >
              <span className="field-label">
                Max Price {open === "price" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
              <span className="field-value">{filters.price}</span>
            </div>

            {open === "price" && (
              <ul>
                {prices.map((item) => (
                  <li key={item} onClick={() => selectValue("price", item)}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="divider"></div>

          {/* SEARCH BUTTON */}
          <button className="search-btn">
            <IoSearchSharp />
          </button>
        </div>
      </div>
    </section>
    </>
  );
}

