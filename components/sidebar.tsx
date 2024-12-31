"use client";
import Link from "next/link";
import { Plus, Route, Search } from "lucide-react";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import Image from "next/image";
import { AvatarDropdown } from "./avatar-dropdown";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { SignInModal } from "./sign-in-modal";

export default function Sidebar() {
  const segments = useSelectedLayoutSegments();
  const { data: session } = useSession();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const handleNewRoute = () => {
    if (!session) {
      setOpenModal(true);
    } else {
      router.push("/new");
    }
  };

  return (
    <>
      <div className="flex-col justify-between items-center w-20 fixed left-0 min-h-screen bg-background py-4 hidden lg:flex">
        <div>
          <Link href="/">
            <Image src="/road.png" width={40} height={40} alt="logo" />
          </Link>
        </div>
        <div className="flex flex-col items-center space-y-6">
          <Link
            href="/"
            className={`${
              segments.length > 0 ? "text-[#cccccc]" : ""
            } hover:text-[#b6b6b6] p-2 hover:rounded-xl hover:bg-[#ececec]`}
          >
            <Route />
          </Link>
          <div
            onClick={handleNewRoute}
            className="flex items-center justify-center text-[#b6b6b6] p-2 rounded-xl bg-[#ececec] cursor-pointer"
          >
            <Plus />
          </div>
          <Link
            href="/search"
            className={`${
              !segments.includes("search") ? "text-[#cccccc]" : ""
            } hover:text-[#b6b6b6] p-2 hover:rounded-xl hover:bg-[#ececec]`}
          >
            <Search />
          </Link>
        </div>
        {session?.user ? (
          <div>
            <AvatarDropdown user={session?.user} />
          </div>
        ) : (
          <div onClick={() => setOpenModal(true)}>
            <Image
              src="/default-avatar.png"
              className="rounded-full"
              width={40}
              height={40}
              alt="avatar"
            />
          </div>
        )}
      </div>

      <SignInModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
