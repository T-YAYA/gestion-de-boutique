"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function UserProfile() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@email.com");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userFetch = async () => {
      setLoading(true);
      const res = await fetch("/api/user/getUser");
      const data = await res.json();
      setName(data.name);
      setEmail(data.email);
      setLoading(false);
    };
    userFetch();
  }, []);

  const handleSave = () => {
    // Ici tu mets l'appel API pour sauvegarder le nom
    setLoading(true);
    fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setLoading(false);
    toast.success("Profil mis à jour avec succès !");
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl border border-emerald-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-emerald-700 text-center">
            Profil Utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-emerald-700">
              Nom
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-emerald-700">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              disabled
              className="mt-1 border-emerald-200 bg-emerald-100 text-emerald-700 cursor-not-allowed"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
          >
            Sauvegarder
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
