import "../Styles/Footer.css";
import { Link } from "react-router-dom";
import logo from "../assets/foo-logo.png";

import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { RiTelegram2Line } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="footer">

      {/* Background Text */}
      <div className="footer-bg-text">URBAN RWA</div>

      <div className="footer-inner">

        {/* LEFT SIDE */}
        <div className="footer-left">
          <img src={logo} alt="Urban RWA" className="footer-logo" />
          <p>
            Compliant Web3 infrastructure enabling
            global real estate operations through
            utility-driven digital solutions.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="footer-right">

          {/* Social Icons */}
          <div className="footer-social">
            <span><FaXTwitter /></span>
            <span><FaFacebookF /></span>
            <span><FaInstagram /></span>
            <span><RiTelegram2Line /></span>
          </div>

          {/* Menu */}
          <ul className="footer-menu">
            <li><Link to="/" end>Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>

          {/* Contact */}
          <div className="footer-contact">
            <p>+995 51000 2291</p>
            <p>info@urbanrwa.io</p>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom border-top-gradient">
        <span>©2025 URBAN RWA. All rights reserved</span>
        <div>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
        </div>
      </div>

    </footer>
  );
}
