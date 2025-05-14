import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 pt-10 pb-6 px-6 mt-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Bloom</h2>
          <p className="text-sm">
            Luxury floral arrangements delivered with love. Crafting unforgettable moments with every bloom.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-pink-600">Home</a></li>
            <li><a href="/catalogue" className="hover:text-pink-600">Catalogue</a></li>
            <li><a href="/orders" className="hover:text-pink-600">My Orders</a></li>
            <li><a href="/contact" className="hover:text-pink-600">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="text-sm space-y-2">
            <li>Email: hello@bloom.com</li>
            <li>Phone: xxxx-xxx-xxx</li>
            <li>Location: Bahir Dar</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-pink-600">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-500 hover:text-pink-600">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-500 hover:text-pink-600">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-500 hover:text-pink-600">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Bloom All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
