import { IoCloseOutline } from "react-icons/io5";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { sidebarItems } from "./DocsSidebar";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Documentation navigation"
    >
      <button
        className="mobile-nav__backdrop"
        type="button"
        onClick={onClose}
        aria-label="Close navigation"
      />
      <aside className="mobile-nav__panel">
        <div className="mobile-nav__title">
          <span>Navigation</span>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <IoCloseOutline size={18} />
          </button>
        </div>
        <nav aria-label="Documentation navigation">
          {sidebarItems.map((section) => (
            <section key={section.title} className="sidebar-section">
              <h2>{section.title}</h2>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "sidebar-link",
                    section.code && "sidebar-link--code",
                    location.pathname === item.href && "sidebar-link--active",
                  )}
                >
                  <span>{item.title}</span>
                  {item.badge && (
                    <small className="sidebar-link__badge">{item.badge}</small>
                  )}
                </Link>
              ))}
            </section>
          ))}
        </nav>
        <a
          href="https://kristofajosh.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-credit"
        >
          Built by Chris Josh
        </a>
      </aside>
    </div>
  );
};
