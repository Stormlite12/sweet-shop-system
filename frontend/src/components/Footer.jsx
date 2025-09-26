export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-r from-orange-100 via-amber-50 to-orange-100 text-orange-900/80 border-t border-orange-200">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About Section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center">
                Misthi Mahal
            </h3>
            <p className="text-sm leading-relaxed">
              Handcrafting traditional Indian sweets with love and the finest ingredients for generations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-orange-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-orange-600 transition-colors">Home</a></li>
              <li><a href="/#sweets" className="hover:text-orange-600 transition-colors">Our Sweets</a></li>
              <li><a href="/admin" className="hover:text-orange-600 transition-colors">Admin Panel</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-orange-800 mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:sid2002official@gmail.com" className="hover:text-orange-600 transition-colors flex items-center space-x-2">
                  <span role="img" aria-label="email">📧</span>
                  <span>sid2002official@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span role="img" aria-label="location">📍</span>
                <span>Guwahati, India</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-orange-800 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-orange-700 hover:text-orange-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-orange-700 hover:text-orange-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-200 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Sweet Shop. All Rights Reserved.</p>
          <p className="mt-1">Built with ❤️ and AI assistance.</p>
        </div>
      </div>
    </footer>
  )
}
