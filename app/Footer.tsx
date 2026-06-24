"use client";

import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#200c06] text-[#fff4df] border-t-2 border-[#b98a35] mt-auto overflow-hidden">
      {/* Decorative inner line to make it double-bordered */}
      <div className="border-t border-[#b98a35]/40 my-1 mx-0" />

      {/* Peacock Watermarks (Background SVGs) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Left Peacock Watermark (Mirrored) */}
        <svg
          viewBox="0 0 200 200"
          className="absolute left-4 sm:left-12 -bottom-6 h-40 w-40 sm:h-56 sm:w-56 text-[#b98a35] opacity-[0.06] transform scale-x-[-1]"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 60,140 C 45,135 30,120 30,95 C 30,70 50,60 55,40 C 58,28 50,20 53,10 C 54,6 59,5 61,8 C 63,12 60,18 62,25 C 64,35 75,45 80,60 C 85,75 80,95 72,115 C 68,125 60,140 60,140 Z" />
          <path d="M 75,65 C 95,55 125,50 150,70 C 170,86 175,110 165,130 C 155,150 125,165 95,155 C 80,150 72,135 72,135" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M 53,10 Q 45,2 40,5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="40" cy="5" r="2" />
          <path d="M 53,10 Q 53,0 53,0" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="53" cy="0" r="2" />
          <path d="M 53,10 Q 61,2 66,5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="66" cy="5" r="2" />
          <circle cx="50" cy="22" r="1.5" />
          <circle cx="110" cy="75" r="3" />
          <circle cx="135" cy="85" r="3" />
          <circle cx="150" cy="105" r="3" />
          <circle cx="145" cy="125" r="3" />
          <circle cx="125" cy="140" r="3" />
          <circle cx="102" cy="135" r="3" />
        </svg>

        {/* Right Peacock Watermark */}
        <svg
          viewBox="0 0 200 200"
          className="absolute right-4 sm:right-12 -bottom-6 h-40 w-40 sm:h-56 sm:w-56 text-[#b98a35] opacity-[0.06]"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 60,140 C 45,135 30,120 30,95 C 30,70 50,60 55,40 C 58,28 50,20 53,10 C 54,6 59,5 61,8 C 63,12 60,18 62,25 C 64,35 75,45 80,60 C 85,75 80,95 72,115 C 68,125 60,140 60,140 Z" />
          <path d="M 75,65 C 95,55 125,50 150,70 C 170,86 175,110 165,130 C 155,150 125,165 95,155 C 80,150 72,135 72,135" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M 53,10 Q 45,2 40,5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="40" cy="5" r="2" />
          <path d="M 53,10 Q 53,0 53,0" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="53" cy="0" r="2" />
          <path d="M 53,10 Q 61,2 66,5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="66" cy="5" r="2" />
          <circle cx="50" cy="22" r="1.5" />
          <circle cx="110" cy="75" r="3" />
          <circle cx="135" cy="85" r="3" />
          <circle cx="150" cy="105" r="3" />
          <circle cx="145" cy="125" r="3" />
          <circle cx="125" cy="140" r="3" />
          <circle cx="102" cy="135" r="3" />
        </svg>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {/* Brand and Description */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl sm:text-2xl font-black tracking-wide text-[#b98a35]">
              Kailash Kalamkari Sarees
            </h2>
            <p className="text-sm text-[#fff4df]/80 leading-relaxed max-w-sm">
              Authentic, 100% hand-painted Pen Kalamkari sarees crafted by traditional weavers in Srikalahasthi. Bringing heritage art and timeless grace to your wardrobe since 1984.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base sm:text-lg font-bold text-[#b98a35]">
              Contact Us
            </h3>
            <ul className="text-sm text-[#fff4df]/80 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-[#b98a35]">📞</span>
                <a href="tel:+919951821516" className="hover:underline">
                  +91 99518 21516
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#b98a35] mt-1">📍</span>
                <span>
                  Kailash Kalamkari Store,<br />
                  Srikalahasthi, Andhra Pradesh,<br />
                  India - 517644
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links and Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-base sm:text-lg font-bold text-[#b98a35]">
              Follow Our Art
            </h3>
            <p className="text-xs text-[#fff4df]/60 mb-1">
              Connect with us online to see our latest works:
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/919951821516"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3e170c] border border-[#b98a35]/40 flex items-center justify-center text-[#fff4df] hover:bg-[#b98a35] hover:text-[#200c06] transition duration-200"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href="https://www.google.com/maps/place/KAILASH+Kalamkari"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3e170c] border border-[#b98a35]/40 flex items-center justify-center text-[#fff4df] hover:bg-[#b98a35] hover:text-[#200c06] transition duration-200"
                aria-label="Google Maps"
              >
                <FaMapMarkerAlt size={18} />
              </a>
              <a
                href="https://www.instagram.com/kailash_kalamkari_1984/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3e170c] border border-[#b98a35]/40 flex items-center justify-center text-[#fff4df] hover:bg-[#b98a35] hover:text-[#200c06] transition duration-200"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/people/Kailash-Kalamkari/100069955411990/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3e170c] border border-[#b98a35]/40 flex items-center justify-center text-[#fff4df] hover:bg-[#b98a35] hover:text-[#200c06] transition duration-200"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line with thin border */}
        <div className="border-t border-[#b98a35]/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#fff4df]/60">
          <div>
            &copy; {currentYear} Kailash Kalamkari Sarees. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>Handcrafted with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
