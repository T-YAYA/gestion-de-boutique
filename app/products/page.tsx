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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Eye, Trash2, Edit3, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Type rapide
interface Category {
  id: number;
  name: string;
}
interface Supplier {
  id: number;
  name: string;
}
interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  category?: Category;
  supplier?: Supplier;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState({
    products: true,
    categories: true,
    suppliers: true,
    save: false,
    delete: null as number | null,
  });

  const [formData, setFormData] = useState({
    name: "",
    stock: 0,
    price: 0,
    category: "",
    supplier: "",
  });

  // 🟢 Charger produits, catégories et fournisseurs
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, products: true }));
      const res = await fetch("/api/products/search");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Erreur fetch products:", err);
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setIsLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, categories: true }));
      const res = await fetch("/api/categories/getCategorie");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erreur fetch categories:", err);
      toast.error("Erreur lors du chargement des catégories");
    } finally {
      setIsLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const fetchSuppliers = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, suppliers: true }));
      const res = await fetch("/api/fournisseur/getFournisseur");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Erreur fetch suppliers:", err);
      toast.error("Erreur lors du chargement des fournisseurs");
    } finally {
      setIsLoading((prev) => ({ ...prev, suppliers: false }));
    }
  };

  const handleAdd = () => {
    setFormData({ name: "", stock: 0, price: 0, category: "", supplier: "" });
    setEditProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      stock: product.stock,
      price: product.price,
      category: product.category?.id.toString() || "",
      supplier: product.supplier?.id.toString() || "",
    });
    setEditProduct(product);
    setDialogOpen(true);
  };

  const handleView = (product: Product) => {
    setEditProduct(product);
    setViewDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      setIsLoading((prev) => ({ ...prev, delete: id }));
      await fetch(`/api/products/delete/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Produit supprimé avec succès");
    } catch (err) {
      console.error("Erreur delete product:", err);
      toast.error("Erreur lors de la suppression du produit");
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Veuillez saisir un nom de produit");
      return;
    }

    try {
      setIsLoading((prev) => ({ ...prev, save: true }));
      if (editProduct) {
        // Modifier
        const id = editProduct.id;
        await fetch(`/api/products/edit/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            stock: Number(formData.stock),
            price: Number(formData.price),
            categoryId: Number(formData.category) || null,
            supplierId: Number(formData.supplier) || null,
          }),
        });
        toast.success("Produit modifié avec succès");
      } else {
        // Ajouter
        await fetch("/api/products/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            stock: Number(formData.stock),
            price: Number(formData.price),
            categoryId: Number(formData.category) || null,
            supplierId: Number(formData.supplier) || null,
          }),
        });
        toast.success("Produit ajouté avec succès");
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Erreur save product:", err);
      toast.error("Erreur lors de la sauvegarde du produit");
    } finally {
      setIsLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-700 flex items-center gap-2">
          <Package className="h-8 w-8 hidden md:block" /> Gestion des Produits
        </h1>
        <Button
          className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          onClick={handleAdd}
        >
          <Plus className="h-5 w-5 mr-2" /> Ajouter un produit
        </Button>
      </div>

      <Card className="shadow-md border border-emerald-100 bg-base-100 rounded-box">
        <CardContent className="p-6">
          {isLoading.products ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-emerald-700">
                Chargement des produits...
              </span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun produit trouvé</p>
              <Button
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-0 mt-4"
                onClick={handleAdd}
              >
                <Plus className="h-5 w-5 mr-2" /> Ajouter votre premier produit
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-box">
              <table className="table table-zebra w-full">
                <thead className="bg-emerald-50 text-emerald-800">
                  <tr>
                    <th className="rounded-tl-box">Produit</th>
                    <th>Catégorie</th>
                    <th>Fournisseur</th>
                    <th>Stock</th>
                    <th className="rounded-tr-box">Prix</th>
                    <th className="rounded-tr-box">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-emerald-50/50">
                      <td className="font-medium">{p.name}</td>
                      <td>
                        <span className="badge badge-outline badge-sm bg-emerald-100 text-emerald-800 border-emerald-200">
                          {p.category?.name || "-"}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-outline badge-sm bg-blue-100 text-blue-800 border-blue-200">
                          {p.supplier?.name || "-"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`font-bold ${
                            p.stock > 10
                              ? "text-emerald-600"
                              : p.stock > 0
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="font-semibold text-emerald-700">
                        {p.price} FCFA
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                            onClick={() => handleView(p)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="btn btn-sm btn-ghost text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
                            onClick={() => handleEdit(p)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="btn btn-sm btn-ghost text-red-600 hover:text-red-800 hover:bg-red-100"
                            onClick={() => handleDelete(p.id)}
                            disabled={isLoading.delete === p.id}
                          >
                            {isLoading.delete === p.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Ajouter / Modifier */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-base-100 p-6 rounded-box shadow-xl border border-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-700 text-xl flex items-center gap-2">
              {editProduct ? (
                <>
                  <Edit3 className="h-5 w-5" /> Modifier le produit
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" /> Ajouter un produit
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="form-control flex flex-col gap-2">
              <Label htmlFor="name" className="label text-emerald-800">
                <span className="label-text">Nom du produit</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom du produit"
                className="input input-bordered"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control flex flex-col gap-2">
                <Label htmlFor="stock" className="label text-emerald-800">
                  <span className="label-text">Stock</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control flex flex-col gap-2">
                <Label htmlFor="price" className="label text-emerald-800">
                  <span className="label-text">Prix (FCFA)</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input input-bordered"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control flex flex-col gap-2">
                <Label htmlFor="category" className="label text-emerald-800">
                  <span className="label-text">Catégorie</span>
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select select-bordered"
                  aria-label="Catégorie"
                >
                  <option value="">-- Choisir une catégorie --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control flex flex-col gap-2">
                <Label htmlFor="supplier" className="label text-emerald-800">
                  <span className="label-text">Fournisseur</span>
                </Label>
                <select
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="select select-bordered"
                  aria-label="Fournisseur"
                >
                  <option value="">-- Choisir un fournisseur --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
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
              onClick={handleSave}
              disabled={isLoading.save}
            >
              {isLoading.save ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : editProduct ? (
                "Modifier"
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Voir */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md bg-base-100 p-6 rounded-box shadow-xl border border-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-700 text-xl flex items-center gap-2">
              <Eye className="h-5 w-5" /> Détails du produit
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between py-2 border-b border-emerald-100">
              <span className="font-semibold text-emerald-800">Nom :</span>
              <span className="text-emerald-700">{editProduct?.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-emerald-100">
              <span className="font-semibold text-emerald-800">
                Catégorie :
              </span>
              <span className="text-emerald-700">
                {editProduct?.category?.name || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-emerald-100">
              <span className="font-semibold text-emerald-800">
                Fournisseur :
              </span>
              <span className="text-emerald-700">
                {editProduct?.supplier?.name || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-emerald-100">
              <span className="font-semibold text-emerald-800">Stock :</span>
              <span
                className={`font-bold ${
                  editProduct && editProduct.stock > 10
                    ? "text-emerald-600"
                    : editProduct && editProduct.stock > 0
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {editProduct?.stock}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-semibold text-emerald-800">Prix :</span>
              <span className="font-bold text-emerald-700">
                {editProduct?.price} FCFA
              </span>
            </div>
          </div>
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
