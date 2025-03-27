
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="text-center max-w-md mx-auto p-6 animate-fade-in">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          La página que está buscando no existe o ha sido movida.
        </p>
        <Button className="gap-2" onClick={() => window.location.href = "/"}>
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
