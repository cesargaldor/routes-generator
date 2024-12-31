// @ts-nocheck
"use client";
import { useActionState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { createRouteAction } from "@/actions/routes";
import { z } from "zod";
import { toast } from "sonner";
import Spinner from "./ui/spinner";

type Props = {
  onSetData: (data: any) => void;
};

export const RouteSchema = z.object({
  description: z.string().min(1, "Descripción obligatoria"),
});

export default function CreateRouteForm({ onSetData }: Props) {
  const [state, dispatch, isLoading] = useActionState(createRouteAction, {
    data: undefined,
    success: "",
    error: undefined,
  });

  const formAction = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    const result = RouteSchema.safeParse(data);

    if (!result.success) {
      toast.error("Introduce una descripción válida");
      return;
    }

    formData.set("description", data.description ?? "");
    dispatch(formData);
  };

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }

    if (state.success && state.data) {
      onSetData(state.data);
    }
  }, [state, onSetData]);

  return (
    <form action={formAction} className="pt-3 px-3 lg:pt-8 lg:px-8">
      <Textarea
        rows={6}
        id="description"
        name="description"
        className="placeholder:text-gray-400 w-full border border-neutral-200 rounded-xl p-2"
        placeholder="Ejemplo: Ruta que salga y llegue a Sevilla, es decir, que sea circular, que pase por algunos pueblos bonitos de la sierra de Grazalema y con una longitud máxima de 300km."
      />
      <div className="flex justify-end items-center gap-4 mt-8">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-foreground text-background rounded-xl px-4 py-2 flex items-center gap-2"
        >
          {isLoading && <Spinner className="border-white" />}
          {isLoading
            ? "Generando ruta..."
            : !state.data
            ? "Generar ruta"
            : "Generar otra ruta"}
        </button>

        {state?.data && (
          <button
            disabled={isLoading}
            type="button"
            className="bg-background text-foreground rounded-xl px-4 py-2 flex items-center gap-2 border border-foreground"
          >
            {isLoading && <Spinner className="border-white" />}
            Guardar ruta
          </button>
        )}
      </div>
    </form>
  );
}
