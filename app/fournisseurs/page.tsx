"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2, Phone, User, Calendar } from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState({
    suppliers: true,
    add: false,
    delete: null as number | null,
  });

  // Charger fournisseurs
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading((prev) => ({ ...prev, suppliers: true }));
    try {
      const response = await fetch("/api/fournisseur/getFournisseur");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    } finally {
      setLoading((prev) => ({ ...prev, suppliers: false }));
    }
  };

  // Gérer formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ajouter fournisseur (POST)
  const handleAdd = async () => {
    if (!formData.name.trim()) {
      alert("Veuillez saisir un nom de fournisseur.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Veuillez saisir un numéro de téléphone.");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, add: true }));
      const res = await fetch("/api/fournisseur/addFournisseur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newSupplier = await res.json();
        setSuppliers([newSupplier, ...suppliers]);
        setFormData({ name: "", phone: "" });
        setDialogOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Erreur ajout :", error);
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  };

  // Supprimer fournisseur (DELETE)
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce fournisseur ?")) return;

    try {
      setLoading((prev) => ({ ...prev, delete: id }));
      const res = await fetch("/api/fournisseur/deleteFournisseur", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setSuppliers(suppliers.filter((s) => s.id !== id));
      } else {
        const err = await res.json();
        alert(err.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression :", error);
    } finally {
      setLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-700 flex items-center gap-2">
          <User className="h-8 w-8" /> Fournisseurs
        </h1>
        <Button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-5 w-5" /> Ajouter un fournisseur
        </Button>
      </div>

      <Card className="shadow-md border border-emerald-100 bg-base-100 rounded-box">
        <CardContent className="p-6">
          {loading.suppliers ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-emerald-700">
                Chargement des fournisseurs...
              </span>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun fournisseur enregistré</p>
              <Button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0 mt-4"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-5 w-5" /> Ajouter votre premier fournisseur
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-box">
              <table className="table table-zebra w-full">
                <thead className="bg-emerald-50 text-emerald-800">
                  <tr>
                    <th className="rounded-tl-box">Nom</th>
                    <th>Téléphone</th>
                    <th>Date d&#39;ajout</th>
                    <th className="rounded-tr-box">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-emerald-50/50">
                      <td className="font-medium">{s.name}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-emerald-600" />
                          {s.phone}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                          {new Date(s.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          className="btn btn-sm btn-ghost text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => handleDelete(s.id)}
                          disabled={loading.delete === s.id}
                        >
                          {loading.delete === s.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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

      {/* Dialog Ajouter Fournisseur */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-base-100 p-6 rounded-box shadow-xl border border-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-700 text-xl flex items-center gap-2">
              <Plus className="h-5 w-5" /> Ajouter un fournisseur
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="form-control flex flex-col gap-2">
              <Label htmlFor="name" className="label text-emerald-800">
                <span className="label-text">Nom du fournisseur</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom du fournisseur"
                className="input input-bordered"
              />
            </div>
            <div className="form-control flex flex-col gap-2">
              <Label htmlFor="phone" className="label text-emerald-800">
                <span className="label-text">Téléphone</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+223 70000000"
                className="input input-bordered"
              />
            </div>
          </div>
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              className="btn btn-ghost"
            >
              Annuler
            </Button>
            <Button
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0"
              onClick={handleAdd}
              disabled={loading.add}
            >
              {loading.add ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Ajout en cours...
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
