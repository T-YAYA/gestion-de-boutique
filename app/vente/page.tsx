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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Plus,
  Loader2,
  ShoppingCart,
  Calendar,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Package,
} from "lucide-react";

export default function SalesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sales, setSales] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ productId: "", quantity: 0 });
  const [loading, setLoading] = useState({
    products: true,
    sales: true,
    add: false,
    delete: null as number | null,
  });

  // 🟢 Charger les produits depuis le backend
  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    try {
      const res = await fetch("/api/products/search");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Erreur fetch products:", err);
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const fetchSales = async () => {
    setLoading((prev) => ({ ...prev, sales: true }));
    try {
      const res = await fetch("/api/sales/get");
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error("Erreur fetch sales:", err);
    } finally {
      setLoading((prev) => ({ ...prev, sales: false }));
    }
  };

  const selectedProduct = products.find(
    (p) => p.id.toString() === formData.productId
  );
  const totalPrice = selectedProduct
    ? selectedProduct.price * Number(formData.quantity)
    : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectProduct = (value: string) => {
    setFormData({ ...formData, productId: value, quantity: 0 });
  };

  const handleAddSale = async () => {
    if (!formData.productId || formData.quantity <= 0) {
      alert("Veuillez sélectionner un produit et saisir une quantité valide.");
      return;
    }

    if (Number(formData.quantity) > selectedProduct!.stock) {
      alert("La quantité saisie dépasse le stock disponible !");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, add: true }));
      const res = await fetch("/api/sales/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: Number(formData.productId),
          quantity: Number(formData.quantity),
        }),
      });

      const newSale = await res.json();
      setSales([newSale, ...sales]);

      // Optionnel : mettre à jour le stock local
      setProducts((prev) =>
        prev.map((p) =>
          p.id === newSale.productId
            ? { ...p, stock: p.stock - newSale.quantity }
            : p
        )
      );

      setFormData({ productId: "", quantity: 0 });
      setDialogOpen(false);
    } catch (err) {
      console.error("Erreur ajout vente:", err);
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const handleDeleteSale = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette vente ?")) return;

    try {
      setLoading((prev) => ({ ...prev, delete: id }));
      await fetch(`/api/sales/delete/${id}`, { method: "DELETE" });
      setSales(sales.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Erreur suppression vente:", err);
    } finally {
      setLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-700 flex items-center gap-2">
          <ShoppingCart className="h-8 w-8" /> Ventes
        </h1>
        <Button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-5 w-5" /> Nouvelle vente
        </Button>
      </div>

      <Card className="shadow-md border border-emerald-100 bg-base-100 rounded-box">
        <CardContent className="p-6">
          {loading.sales ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-emerald-700">
                Chargement des ventes...
              </span>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune vente enregistrée</p>
              <Button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0 mt-4"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-5 w-5" /> Effectuer votre première vente
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-box">
              <table className="table table-zebra w-full">
                <thead className="bg-emerald-50 text-emerald-800">
                  <tr>
                    <th className="rounded-tl-box">Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Prix total</th>
                    <th>Date</th>
                    <th className="rounded-tr-box">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id} className="hover:bg-emerald-50/50">
                      <td className="font-medium">{s.product.name}</td>
                      <td className="font-semibold">{s.quantity}</td>
                      <td className="text-emerald-700">{s.product.price} €</td>
                      <td className="font-bold text-emerald-700">
                        {s.totalPrice} FCFA
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                          {new Date(s.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          className="btn btn-sm btn-ghost text-red-600 hover:text-red-800 hover:bg-red-100"
                          onClick={() => handleDeleteSale(s.id)}
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

      {/* Dialog Nouvelle Vente */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-base-100 p-6 rounded-box shadow-xl border border-emerald-100">
          <DialogHeader>
            <DialogTitle className="text-emerald-700 text-xl flex items-center gap-2">
              <Plus className="h-5 w-5" /> Nouvelle vente
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="form-control flex flex-col gap-2">
              <Label htmlFor="product" className="label text-emerald-800">
                <span className="label-text">Produit</span>
              </Label>
              <Select
                value={formData.productId}
                onValueChange={handleSelectProduct}
              >
                <SelectTrigger className="select select-bordered">
                  <SelectValue placeholder="Sélectionnez un produit" />
                </SelectTrigger>
                <SelectContent>
                  {loading.products ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    </div>
                  ) : (
                    products.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        <div className="flex justify-between items-center">
                          <span>{p.name}</span>
                          <span className="text-sm text-emerald-600 ml-2">
                            (Stock: {p.stock})
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {selectedProduct && (
              <div className="form-control flex flex-col gap-2">
                <Label htmlFor="quantity" className="label text-emerald-800">
                  <span className="label-text">Quantité</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantité"
                  className="input input-bordered"
                  min="1"
                  max={selectedProduct.stock}
                />
                <div className="mt-2 p-3 bg-emerald-50 rounded-box">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800 font-medium">
                      Prix total:
                    </span>
                    <span className="font-bold text-emerald-700 text-lg">
                      {totalPrice.toFixed(2)} FCFA
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-emerald-600">
                    {formData.quantity > 0 && (
                      <>
                        {formData.quantity} × {selectedProduct.price} FCFA
                      </>
                    )}
                  </div>
                </div>
                {formData.quantity > selectedProduct.stock && (
                  <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-box text-sm">
                    ❌ La quantité dépasse le stock disponible (
                    {selectedProduct.stock})
                  </div>
                )}
              </div>
            )}
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
              onClick={handleAddSale}
              disabled={
                loading.add ||
                !formData.productId ||
                formData.quantity <= 0 ||
                (selectedProduct && formData.quantity > selectedProduct.stock)
              }
            >
              {loading.add ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer la vente"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
