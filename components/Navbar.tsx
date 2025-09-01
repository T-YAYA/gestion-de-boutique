"use client";

import Link from "next/link";
import { Package, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      const { data } = await supabase.auth.getClaims();
      setName(data?.claims?.user_metadata.name);
    };
    getUser();
  });

  const navLinks = [
    { href: "/", label: "Tableau de bord" },
    { href: "/products", label: "Produits" },
    { href: "/transaction", label: "Mouvements" },
    { href: "/categories", label: "Catégories" },
    { href: "/vente", label: "Vente" },
    { href: "/fournisseurs", label: "Fournisseur" },
  ];

  if (pathname.includes("auth")) return null;

  const supabase = createClient();
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="bg-emerald-600 shadow-xl text-white sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:p-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold hover:scale-105 transform transition-transform duration-300"
        >
          <Package className="h-7 w-7" /> StockMaster
        </Link>

        {/* Menu desktop */}
        <ul className="hidden lg:flex space-x-6 text-lg font-medium">
          {navLinks.map((link) => (
            <li key={link.href} className="relative group">
              <Link
                href={link.href}
                className={`px-3 py-2 rounded transition-colors duration-300 hover:bg-emerald-500 ${
                  pathname === link.href ? "bg-emerald-700" : ""
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Profil utilisateur desktop */}
        <div className="dropdown dropdown-end hidden lg:block">
          <div
            tabIndex={0}
            role="button"
            className="rounded-full hover:scale-105 transition-transform duration-300"
          >
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold">
                {name?.charAt(0).toUpperCase() +
                  name?.slice(1, 2).toUpperCase()}
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-emerald-200 rounded-lg shadow-lg w-52 p-2 mt-2"
          >
            <li>
              <Link
                href="/profile"
                className="hover:bg-emerald-300 rounded transition-colors duration-300"
              >
                Profil
              </Link>
            </li>
            <li onClick={logout} className="cursor-pointer">
              <span className="hover:bg-emerald-300 rounded block px-3 py-2 transition-colors duration-300">
                Déconnexion
              </span>
            </li>
          </ul>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-full hover:bg-emerald-500 transition-colors duration-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          mobileMenuOpen ? "max-h-screen" : "max-h-0"
        } overflow-hidden transition-max-height duration-500 lg:hidden bg-emerald-600 border-t border-emerald-500 shadow-md`}
      >
        <ul className="flex flex-col p-4 space-y-2 text-lg font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block text-white px-3 py-2 rounded hover:bg-emerald-500 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="border-t border-emerald-500 mt-2 pt-2">
            <Link
              href="/profile"
              className="block text-white px-3 py-2 rounded hover:bg-emerald-500 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profil
            </Link>
            <span
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="block text-white px-3 py-2 rounded hover:bg-emerald-500 cursor-pointer transition-colors duration-300"
            >
              Déconnexion
            </span>
          </li>
        </ul>
      </div>
    </header>
  );
}
