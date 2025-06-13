import React from "react";
import useFooterNavigation from "./hooks/useFooterNavigation";

const Footer = () => {
  const { navigationItems } = useFooterNavigation();

  return (
    <footer className="bg-[hsl(var(--background-darker))] text-white py-12 px-4">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Contact */}
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-2">Contact Us</h4>
          <p>Body Fuel</p>
          <p>Israel, Tel Aviv, 1234567</p>
          <p className="mt-1">service@bodyfuel.com</p>
        </div>

        {/* Links */}
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-2">Quick Links</h4>
          <ul className="space-y-1">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}> {item.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social / Newsletter */}
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-2">Stay Connected</h4>
          <p>
            Follow us on social media or subscribe to our newsletter for
            updates.
          </p>
          <div className="flex gap-4 mt-3">
            {/* Replace with icons if needed */}
            <span className="underline cursor-pointer">Instagram</span>
            <span className="underline cursor-pointer">Facebook</span>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="mt-10 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Body Fuel. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
