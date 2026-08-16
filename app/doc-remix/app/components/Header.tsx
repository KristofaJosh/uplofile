import {
  IoCheckmarkOutline,
  IoCloseOutline,
  IoCubeOutline,
  IoLogoGithub,
  IoMenuOutline,
  IoMoonOutline,
  IoSearchOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import AppIcon from "@/assets/icon.svg?react";
import { sidebarItems } from "./DocsSidebar";
import { MobileNav } from "./MobileNav";

type Theme = "dark" | "light";

export const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<Theme>("light");
  const skipInitialThemeSave = useRef(true);
  const pages = useMemo(
    () =>
      sidebarItems.flatMap((section) =>
        section.items.map((item) => ({ ...item, section: section.title })),
      ),
    [],
  );
  const matchingPages = pages.filter(({ title, section }) =>
    `${title} ${section}`.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("uplofile-theme");
    const initialTheme: Theme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  useEffect(() => {
    if (skipInitialThemeSave.current) {
      skipInitialThemeSave.current = false;
      return;
    }
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("uplofile-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectPage = (href: string) => {
    setIsSearchOpen(false);
    setQuery("");
    navigate(href);
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label="Open documentation navigation"
            onClick={() => setIsMenuOpen(true)}
          >
            <IoMenuOutline size={18} />
          </button>
          <a href="/" className="brand" aria-label="Uplofile home">
            <span className="brand-mark">
              <AppIcon className="h-4 w-4" />
            </span>
            <span>Uplofile</span>
          </a>
          <button
            className="search-trigger"
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-haspopup="dialog"
          >
            <IoSearchOutline size={15} />
            <span>Search docs</span>
            <kbd>⌘K</kbd>
          </button>
          <div className="header-actions">
            <a href="/llms.txt" className="header-text-link">
              llms.txt
            </a>
            <a
              href="https://github.com/KristofaJosh/uplofile"
              target="_blank"
              rel="noreferrer"
              className="icon-button"
              aria-label="GitHub"
            >
              <IoLogoGithub size={17} />
            </a>
            <a
              href="https://www.npmjs.com/package/uplofile"
              target="_blank"
              rel="noreferrer"
              className="icon-button"
              aria-label="npm"
            >
              <IoCubeOutline size={17} />
            </a>
            <button
              className="icon-button"
              type="button"
              aria-label="Toggle color theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <IoSunnyOutline size={17} />
              ) : (
                <IoMoonOutline size={17} />
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {isSearchOpen && (
        <div
          className="command-overlay"
          role="presentation"
          onMouseDown={() => setIsSearchOpen(false)}
        >
          <section
            className="command-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Search Uplofile documentation"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="command-input-wrap">
              <IoSearchOutline size={17} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search documentation..."
                aria-label="Search documentation"
              />
              <button
                className="command-close"
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <IoCloseOutline size={17} />
              </button>
            </div>
            <div className="command-results">
              {matchingPages.length ? (
                matchingPages.map((page) => (
                  <button
                    key={page.href}
                    type="button"
                    className="command-result"
                    onClick={() => selectPage(page.href)}
                  >
                    <span>
                      <strong>{page.title}</strong>
                      <small>{page.section}</small>
                    </span>
                    <IoCheckmarkOutline className="command-enter" size={15} />
                  </button>
                ))
              ) : (
                <p className="command-empty">No pages found.</p>
              )}
            </div>
            <div className="command-footer">
              <span>
                <IoCheckmarkOutline size={13} /> Select a page
              </span>
              <span>esc to close</span>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
