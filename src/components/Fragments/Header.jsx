import { useEffect, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiLogoutBoxLine,
  RiUser3Line,
  RiUserSettingsLine,
} from "react-icons/ri";

export default function Header({ children, list = "Logout", onclick, detailstatus = "Trial" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white/80 backdrop-blur border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-black text-blue-700 tracking-widest uppercase">
          bothw3b
        </h1>

        {/* Right Section */}
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          {/* Status */}
          <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-semibold shadow-sm">
            Status: {detailstatus}
          </span>

          {/* Profile */}
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 group px-3 py-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-all shadow-sm text-blue-700"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${children}&background=0D8ABC&color=fff&rounded=true&bold=true`}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-white shadow-sm"
            />
            <span className="hidden sm:block font-medium">{children}</span>
            <RiArrowDownSLine className="text-xl group-hover:rotate-180 transition-all duration-200" />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 top-14 w-52 bg-white border border-gray-100 rounded-xl shadow-xl animate-fadeIn z-50 overflow-hidden">
              <div className="px-4 py-3 border-b text-sm text-gray-700 font-semibold">
                Hi, {children.split(" ")[0]}
              </div>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-sm text-gray-800 transition"
              >
                <RiUserSettingsLine className="text-lg" />
                Profile
              </button>
              <button
                onClick={onclick}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-600 font-medium transition"
              >
                <RiLogoutBoxLine className="text-lg" />
                {list}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
