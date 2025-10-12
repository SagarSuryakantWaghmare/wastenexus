import Link from "next/link";
import { Recycle, Leaf, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github, Shield, Zap, Users, BarChart3 } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Portals",
      links: [
        { name: "Citizen Dashboard", href: "/citizen", icon: Users },
        { name: "Worker Dashboard", href: "/worker", icon: Zap },
        { name: "Performance Analytics", href: "/worker/performance", icon: BarChart3 },
        { name: "Safety Management", href: "/worker/safety", icon: Shield }
      ]
    },
    {
      title: "Features",
      links: [
        { name: "Smart Collection", href: "#features" },
        { name: "Real-time Tracking", href: "#workflow" },
        { name: "Environmental Impact", href: "#stats" },
        { name: "Route Optimization", href: "/worker/routes" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Waste Collection", href: "/worker/collections" },
        { name: "Digital Certificates", href: "/citizen/certificates" },
        { name: "Training Programs", href: "/citizen/training" },
        { name: "Impact Reporting", href: "/citizen/report" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Documentation", href: "#docs" },
        { name: "Contact Support", href: "#contact" },
        { name: "System Status", href: "#status" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/wastenexus" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/wastenexus" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/wastenexus" },
    { name: "GitHub", icon: Github, href: "https://github.com/wastenexus" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200">
                WN
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  WasteNexus
                </span>
                <Leaf className="w-5 h-5 text-green-400" />
              </div>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Revolutionizing urban waste management through smart technology, real-time tracking, and sustainable practices. 
              Building cleaner, greener cities for tomorrow.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <div className="p-1 rounded bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <Mail className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-300 text-sm">contact@wastenexus.com</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-1 rounded bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-1 rounded bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <MapPin className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-300 text-sm">Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-green-500/20">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm group"
                      >
                        {link.icon && <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                        <span>{link.name}</span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm group"
                      >
                        {link.icon && <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                        <span>{link.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter & Stats Section */}
        <div className="border-t border-gray-800/50 mt-12 pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Newsletter */}
            <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center space-x-2">
                <Mail className="w-5 h-5 text-green-400" />
                <span>Stay Updated</span>
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                Get insights on smart waste management and environmental impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 text-sm"
                />
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">50K+</div>
                <div className="text-xs text-gray-400">Tons Recycled</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">1M+</div>
                <div className="text-xs text-gray-400">Trees Saved</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">25+</div>
                <div className="text-xs text-gray-400">Cities Served</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">99%</div>
                <div className="text-xs text-gray-400">Efficiency Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm text-center md:text-left">
            © 2024 WasteNexus. All rights reserved. | 
            <Link href="/privacy" className="hover:text-green-400 transition-colors ml-1">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:text-green-400 transition-colors ml-1">Terms of Service</Link>
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-all duration-200 hover:scale-110 p-2 rounded-lg hover:bg-green-500/10"
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;