import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-cricket-gold">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="text-xl font-bold">AICT</span>
            </div>
            <p className="mb-4 text-sm text-primary-foreground/70">
              All India Cricket Tournament - Bringing the best of cricket to millions of fans across the nation.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Schedule
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Teams
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  News
                </a>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h3 className="mb-4 font-semibold">For Organizers</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Register Tournament
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary-foreground">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© 2025 All India Cricket Tournament. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
