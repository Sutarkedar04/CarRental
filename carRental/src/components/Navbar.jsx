import React, { useState, useEffect } from 'react'
import { FaBars, FaTimes } from "react-icons/fa";
import Brandlogo from '../assets/Brandlogo.png'
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-black/20 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
            <nav className='text-white px-6 h-24 flex justify-between items-center max-w-7xl mx-auto'>
                {/* Logo - Left side */}
                <div><Link to={"/"}><img 
                    src={Brandlogo} 
                    alt="Brand Logo" 
                    className='h-40 w-auto object-contain'
                /></Link>
                    
                </div>
                
                {/* Menu Icon (Mobile) */}
                <div className="text-2xl md:hidden z-20 cursor-pointer" onClick={() => setOpen(!open)}>
                    {open ? <FaTimes /> : <FaBars />}
                </div>
                
                {/* Centered Navigation Container */}
                <div className='hidden md:flex absolute left-1/2 transform -translate-x-1/2'>
                    <ul className='flex items-center gap-10'>
                        <li>
                            <a href="/" className="hover:text-yellow-400 transition font-medium text-lg">Home</a>
                        </li>
                        <li>
                            <a href="/About" className="hover:text-yellow-400 transition font-medium text-lg">About</a>
                        </li>
                        <li>
                            <a href="/Services" className="hover:text-yellow-400 transition font-medium text-lg">Services</a>
                        </li>
                        <li>
                            <a href="/Contact" className="hover:text-yellow-400 transition font-medium text-lg">Contact</a>
                        </li>
                    </ul>
                </div>
                
                {/* Mobile Menu (Full width) */}
                <ul className={`md:hidden absolute top-24 left-0 w-full py-6 transition-all duration-300 z-10 ${
                    scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-gray-900/95 backdrop-blur-sm'
                } ${open ? "block" : "hidden"}`}>
                    <li className="text-lg my-4 text-center">
                        <a href="#" className="hover:text-yellow-400 transition font-medium">Home</a>
                    </li>
                    <li className="text-lg my-4 text-center">
                        <a href="#" className="hover:text-yellow-400 transition font-medium">About</a>
                    </li>
                    <li className="text-lg my-4 text-center">
                        <a href="#" className="hover:text-yellow-400 transition font-medium">Services</a>
                    </li>
                    <li className="text-lg my-4 text-center">
                        <a href="#" className="hover:text-yellow-400 transition font-medium">Contact</a>
                    </li>
                    <li className="text-lg my-4 text-center">
                        <button className="bg-yellow-400 hover:bg-yellow-400 text-white font-medium py-2 px-6 rounded-full transition duration-300">
                            Sign In
                        </button>
                    </li>
                </ul>
                
                {/* Sign In Button - Desktop (Right corner) */}
                <div className="hidden md:block">
                    <button className="bg-yellow-400 hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-full transition duration-300">
                        Sign In
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar 