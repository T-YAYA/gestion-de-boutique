"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";

interface Movement {
  id: number;
  type: "Achat" | "Vente";
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  date: string;
  supplier: string | null;
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState({
    movements: true,
    refresh: false,
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null
  );

  const loadMovements = async () => {
    setLoading((prev) => ({ ...prev, movements: true, refresh: true }));
    try {
      const res = await fetch("/api/movements");
      if (!res.ok)
        throw new Error("Erreur lors de la récupération des données");

      const data: Movement[] = await res.json();
      // Tri par date décroissante
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setMovements(data);
    } catch (error) {
      console.error(error);
      alert("Impossible de récupérer les mouvements");
    } finally {
      setLoading((prev) => ({ ...prev, movements: false, refresh: false }));
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const handleView = (movement: Movement) => {
    setSelectedMovement(movement);
    setViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2 items-center">
          <Link
            href="/"
            className="btn btn-sm btn-ghost text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <h1 className="text-3xl font-bold text-emerald-700">
            Mouvements de stock
          </h1>
        </div>
        <Button
          className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          onClick={loadMovements}
          disabled={loading.refresh}
        >
          {loading.refresh ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Chargement...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" /> Rafraîchir
            </>
          )}
        </Button>
      </div>

      {/* Tableau */}
      <Card className="shadow-md border border-emerald-100 bg-base-100 rounded-box">
        <CardContent className="p-6">
          {loading.movements ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-emerald-700">
                Chargement des mouvements...
              </span>
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun mouvement enregistré</p>
              <Button
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0 mt-4"
                onClick={loadMovements}
              >
                <RefreshCw className="h-5 w-5 mr-2" /> Rafraîchir
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-box">
              <table className="table table-zebra w-full">
                <thead className="bg-emerald-50 text-emerald-800">
                  <tr>
                    <th className="rounded-tl-box">Type</th>
                    <th>Produit</th>
                    <th>Catégorie</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Prix total</th>
                    <th>Date</th>
                    <th>Fournisseur</th>
                    <th className="rounded-tr-box">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((m) => (
                    <tr
                      key={`${m.type}-${m.id}`} // clé unique
                      className="hover:bg-emerald-50/50"
                    >
                      <td>
                        <span
                          className={`badge ${
                            m.type === "Achat"
                              ? "badge-success bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "badge-error bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {m.type}
                        </span>
                      </td>
                      <td className="font-medium">{m.product}</td>
                      <td>
                        {m.category && (
                          <span className="badge badge-outline badge-sm bg-blue-100 text-blue-800 border-blue-200">
                            {m.category}
                          </span>
                        )}
                      </td>
                      <td className="font-semibold">{m.quantity}</td>
                      <td className="text-emerald-700">
                        {m.unitPrice.toFixed(2)} FCFA
                      </td>
                      <td className="font-bold text-emerald-700">
                        {(m.quantity * m.unitPrice).toFixed(2)} FCFA
                      </td>
                      <td>
                        <span className="text-sm">
                          {new Date(m.date).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td>
                        {m.supplier && (
                          <span className="badge badge-outline badge-sm bg-amber-100 text-amber-800 border-amber-200">
                            {m.supplier}
                          </span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          onClick={() => handleView(m)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog détail */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md bg-base-100 p-6 rounded-box shadow-xl border border-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-700 text-xl flex items-center gap-2">
              <Eye className="h-5 w-5" /> Détails du mouvement
            </DialogTitle>
          </DialogHeader>
          {selectedMovement && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between py-2 border-b border-emerald-100">
                <span className="font-semibold text-emerald-800">Type :</span>
                <span
                  className={`badge ${
                    selectedMovement.type === "Achat"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {selectedMovement.type}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-emerald-100">
                <span className="font-semibold text-emerald-800">
                  Produit :
                </span>
                <span className="text-emerald-700">
                  {selectedMovement.product}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-emerald-100">
                <span className="font-semibold text-emerald-800">
                  Catégorie :
                </span>
                <span className="text-emerald-700">
                  {selectedMovement.category || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-emerald-100">
                <span className="font-semibold text-emerald-800">
                  Quantité :
                </span>
                <span className="font-bold text-emerald-700">
                  {selectedMovement.quantity}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-emerald-100">
                <span className="font-semibold text-emerald-800">
                  Prix unitaire :
                </span>
                <span className="text-emerald-700">
                  {selectedMovement.unitPrice.toFixed(2)} FCFA
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-emerald-100">
                <span className="font-semibold text-emerald-800">
                  Prix total :
                </span>
                <span className="font-bold text-emerald-700">
                  {(
                    selectedMovement.quantity * selectedMovement.unitPrice
                  ).toFixed(2)}{" "}
                  €
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-emerald-100">
                <span className="font-semibold text-emerald-800">Date :</span>
                <span className="text-emerald-700">
                  {new Date(selectedMovement.date).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-semibold text-emerald-800">
                  Fournisseur :
                </span>
                <span className="text-emerald-700">
                  {selectedMovement.supplier || "-"}
                </span>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6 flex justify-end">
            <Button
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0"
              onClick={() => setViewDialogOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
