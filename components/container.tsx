import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function Container({ title = "", children }: Props) {
  return (
    <div className="w-full flex justify-center pt-6">
      <div className="w-11/12 xl:w-1/2">
        <p className="text-center mb-4 font-semibold">{title}</p>
        <div className="bg-white border border-neutral-200 w-full rounded-lg h-full shadow">
          {children}
        </div>
      </div>
    </div>
  );
}
