import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-emerald-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card className="shadow-xl border border-emerald-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-emerald-700">
                Merci pour votre inscription !
              </CardTitle>
              <CardDescription className="text-emerald-600">
                Vérifiez votre email pour confirmer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-emerald-700">
                Vous vous êtes inscrit avec succès. Veuillez vérifier votre
                email pour confirmer votre compte avant de vous connecter.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
