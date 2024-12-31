"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function SignInModal({ isOpen, onClose }: Props) {
  const handleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/new",
      });
    } catch (error) {
      toast.error("Ha ocurrido un error al iniciar sesión");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bienvenido a nuestra plataforma</DialogTitle>
          <DialogDescription>
            Estamos encantandos de tenerte aquí. Inicia sesión con Google para
            empezar a generar tus rutas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <Button variant="outline" onClick={handleLogin}>
            <svg x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
              <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path>
            </svg>
            Iniciar sesión con Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
