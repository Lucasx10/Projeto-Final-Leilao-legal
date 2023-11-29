"use client"

import { Navbar } from "flowbite-react";
import Link from "next/link";
import { AiOutlineAppstoreAdd } from "react-icons/ai";

export default function MenuAcoes({ user }: any) {
  return (
    <Navbar>
      {user && user.role === 1 && (
        <div className="flex gap-2">
          <Link href="/produtos/cadastrar">
            <div className="flex py-1 px-4 justify-center items-center gap-2 hover:bg-red-50 rounded-lg border border-red-700 text-red-950">
              <AiOutlineAppstoreAdd />
              <p>Cadastrar Produtos</p>
            </div>
          </Link>
        </div>
      )}
    </Navbar>
  );
}
