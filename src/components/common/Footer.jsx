import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">SmartTools Hub</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The All-in-One Utility Platform. Fast, Secure, and Free.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link to="/terms" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
              <FileText className="w-4 h-4" />
              Terms
            </Link>
            <a href="mailto:contact@smarttoolshub.com" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
              <Mail className="w-4 h-4" />
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-[var(--border)] text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} SmartTools Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
