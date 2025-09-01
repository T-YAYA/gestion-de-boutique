// src/app/categories/page.tsx
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
import { Trash2, Plus, Loader2, Tag, Calendar } from "lucide-react";

interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState({
    categories: true,
    add: false,
    delete: null as number | null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const res = await fetch("/api/categories/getCategorie");
      if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      alert("Veuillez entrer le nom de la catégorie.");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, add: true }));
      const res = await fetch("/api/categories/addCategorie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout de la catégorie");

      fetchCategories();
      setDialogOpen(false);
      setFormData({ name: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;

    try {
      setLoading((prev) => ({ ...prev, delete: id }));
      await fetch(`/api/categories/deleteCategorie?id=${id}`, {
        method: "DELETE",
      });
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-700 flex items-center gap-2">
          <Tag className="h-8 w-8" /> Catégories
        </h1>
        <Button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-5 w-5" /> Ajouter une catégorie
        </Button>
      </div>

      <Card className="shadow-md border border-emerald-100 bg-base-100 rounded-box">
        <CardContent className="p-6">
          {loading.categories ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-emerald-700">
                Chargement des catégories...
              </span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune catégorie enregistrée</p>
              <Button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0 mt-4"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-5 w-5" /> Ajouter votre première catégorie
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-box">
              <table className="table table-zebra w-full">
                <thead className="bg-emerald-50 text-emerald-800">
                  <tr>
                    <th className="rounded-tl-box">Nom</th>
                    <th>Date de création</th>
                    <th className="rounded-tr-box">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-emerald-50/50">
                      <td className="font-medium">{c.name}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                          {new Date(c.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          className="btn btn-sm btn-ghost text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => handleDelete(c.id)}
                          disabled={loading.delete === c.id}
                        >
                          {loading.delete === c.id ? (
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

      {/* Dialog Ajouter Catégorie */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-base-100 p-6 rounded-box shadow-xl border border-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-700 text-xl flex items-center gap-2">
              <Plus className="h-5 w-5" /> Ajouter une catégorie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="form-control flex flex-col gap-2">
              <Label htmlFor="name" className="label text-emerald-800">
                <span className="label-text">Nom de la catégorie</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom de la catégorie"
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
