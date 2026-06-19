'use html';
'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

interface NavbarProps {
  phone1: string;
}

export default function Navbar({ phone1 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Ana Səhifə', href: '#' },
    { name: 'Layihələr', href: '#layiheler' },
    { name: 'Xidmətlər', href: '#xidmetler' },
    { name: 'Təmir Paketləri', href: '#paketler' },
    { name: 'Əlaqə', href: '#elaqe' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const cleanPhone = phone1.replace(/\s+/g, '');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-panel py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <span className="text-2xl font-extrabold font-outfit tracking-wider text-white">
                ARAS <span className="text-brand-orange">İNŞAAT</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-brand-orange transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Phone Button */}
            <div className="hidden md:flex items-center">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-brand-orange/20"
              >
                <Phone size={16} />
                <span>{phone1}</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white p-2 focus:outline-none"
                aria-label="Menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Thumb-friendly overlay) */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-brand-dark/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between p-6 pt-24">
          <nav className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="text-2xl font-bold font-outfit text-gray-200 hover:text-brand-orange transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Bottom Thumb-Friendly Button in Drawer */}
          <div className="flex flex-col gap-4 mb-8">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center gap-3 bg-brand-orange hover:bg-brand-orange-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg"
            >
              <Phone size={20} />
              <span>{phone1} - Zəng Et</span>
            </a>
            <p className="text-xs text-center text-gray-500">
              Etibarlı inşaat, keyfiyyətli həyat!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
