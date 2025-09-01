"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

type Stats = {
  totalProducts: number;
  lowStock: number;
  recentMovements: number;
  stockValue: number;
};
type produit = {
  id: number;
  name: string;
  stock: number;
  category: { id: number; name: string };
  lowStock: boolean;
};
type ProductStats = {
  lowStockProducts: produit[];
  recentProducts: produit[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatsCard({ title, value, icon, change }: any) {
  return (
    <Card className="bg-emerald-50 shadow-lg border border-emerald-200 hover:scale-105 transform transition-transform duration-300">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-sm font-medium text-emerald-800">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-emerald-900">{value}</div>
        <p
          className={`text-xs font-medium ${
            change.startsWith("+") ? "text-green-600" : "text-red-500"
          }`}
        >
          {change} depuis le mois dernier
        </p>
      </CardContent>
    </Card>
  );
}

function BadgeStock({ Stock }: { Stock: number }) {
  return (
    <span
      className={`whitespace-nowrap text-sm px-3 py-1 rounded-full font-medium ${
        Stock < 5
          ? "bg-yellow-200 text-yellow-800 animate-pulse"
          : "bg-emerald-200 text-emerald-800"
      }`}
    >
      {Stock < 5 ? "Stock faible" : "En stock"}
    </span>
  );
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);

  const stat = [
    {
      title: "Total Produits",
      value: stats?.totalProducts || 0,
      icon: <Package className="h-6 w-6 text-emerald-600" />,
      change: "+12%",
    },
    {
      title: "Stock Faible",
      value: stats?.lowStock,
      icon: <AlertCircle className="h-6 w-6 text-yellow-500" />,
      change: "-3%",
    },
    {
      title: "Mouvements (30j)",
      value: stats?.recentMovements,
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
      change: "+18%",
    },
    {
      title: "Valeur Stock",
      value: `${stats?.stockValue} FCFA` || 0,
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
      change: "+5.2%",
    },
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        const resStats = await fetch("/api/stats");
        const resProducts = await fetch("/api/produitsState");
        const data = await resStats.json();
        const productsData = await resProducts.json();
        setStats(data);
        setProductStats(productsData);
      } catch (err) {
        console.error("Erreur fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-emerald-700">
        Chargement...
      </div>
    );
  if (!stats || !productStats)
    return (
      <div className="flex justify-center items-center h-screen text-emerald-700">
        Pas de données disponibles
      </div>
    );

  return (
    <div className="min-h-screen bg-emerald-50 transition-colors duration-500">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 animate-fadeIn">
            Tableau de bord
          </h1>
          <p className="text-emerald-800/70 animate-fadeIn delay-150">
            Aperçu de votre gestion de stock
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stat.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>

        {/* Produits faible stock */}
        <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5 animate-pulse" /> Produits en
              stock faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!productStats.lowStockProducts.length ? (
              <p className="text-center py-4 text-gray-500">
                Aucun produit en stock faible
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full transition-transform duration-300 5">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Catégorie</th>
                      <th>Stock</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productStats.lowStockProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-emerald-50 transition-colors duration-300"
                      >
                        <td>{p.name}</td>
                        <td>{p.category?.name}</td>
                        <td>
                          <BadgeStock Stock={p.stock} />
                        </td>
                        <td>
                          <button className="btn btn-sm btn-emerald hover:scale-105 transition-transform duration-300">
                            Commander
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produits récents */}
        <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-emerald-800">
              Produits récemment ajoutés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table w-full transition-transform duration-300 ">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Catégorie</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {productStats.recentProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-emerald-50 transition-colors duration-300"
                    >
                      <td>{p.name}</td>
                      <td>{p.category?.name}</td>
                      <td>{p.stock} unités</td>
                      <td>
                        <BadgeStock Stock={p.stock} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-emerald-600 text-white mt-12 animate-fadeIn">
        <p>© 2024 StockMaster - Tous droits réservés</p>
      </footer>
    </div>
  );
}
