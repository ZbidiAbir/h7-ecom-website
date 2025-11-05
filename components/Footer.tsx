import { Mail } from "lucide-react";
import React from "react";

interface FooterProps {
  isAdmin: boolean;
}

const Footer: React.FC<FooterProps> = ({ isAdmin }) => {
  // Si c'est un admin, on ne rend rien
  if (isAdmin) return null;

  return (
    <footer className="bg-white border-t border-gray-200 px-32">
      {/* Newsletter Section */}
      <div className="bg-black text-white  mx-4 mt-10 p-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
          STAY UP TO DATE ABOUT <br className="hidden md:block" />
          OUR LATEST OFFERS
        </h2>
        <div className="gap-3 w-full max-w-md">
          <div className="relative w-full">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full pl-10 pr-4 py-2  text-black bg-white placeholder-gray-500 focus:outline-none"
            />
          </div>
          <div className="pt-4 w-full">
            <button className="bg-white text-black font-semibold px-6 py-2 hover:bg-gray-100 transition w-full">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10 px-6 md:px-16 py-10 text-sm text-gray-600">
        {/* Logo + Description */}
        <div>
          <h3 className="text-xl font-bold text-black mb-3">HASHSEVEN</h3>
          <p className="mb-4">
            We have clothes that suit your style and which you’re proud to wear.
            From women to men.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-black">
              <i className="ri-twitter-fill"></i>
            </a>
            <a href="#" className="hover:text-black">
              <i className="ri-facebook-fill"></i>
            </a>
            <a href="#" className="hover:text-black">
              <i className="ri-instagram-line"></i>
            </a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-black font-semibold mb-3">COMPANY</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-black">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-black font-semibold mb-3">HELP</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-black">
                Customer Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Delivery Details
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div>
          <h4 className="text-black font-semibold mb-3">FAQ</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-black">
                Account
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Manage Deliveries
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Orders
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Payment
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Bottom Note */}
      <div className="text-start text-xs text-gray-500 px-16">
        © HASHSEVEN 2025. All Rights Reserved
      </div>
      <div className="border bordered w-full"></div>
    </footer>
  );
};

export default Footer;
