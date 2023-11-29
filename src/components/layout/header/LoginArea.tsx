"use client";

import Link from "next/link";
import { BsPersonPlus } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import MenuUsuario from "./MenuUsuario";
import MenuAcoes from "./MenuAcoes";
import { useConnection } from "@/context/connect";
import { useEffect } from "react";

export default function LoginArea({ userData }: any) {
  const { dataUser, setDataUser } = useConnection();

  useEffect(() => {
    setDataUser(userData);
  }, [setDataUser, userData]);

  return (
    <>
      {!dataUser ? (
        <div className="flex gap-2">
          <Link href="/usuarios/cadastrar">
            <div className="flex flex-col py-2 px-6 justify-center items-center hover:bg-gray-50 rounded-lg">
              <BsPersonPlus />
              <p>CADASTRAR-SE</p>
            </div>
          </Link>
          <Link href="/usuarios/login">
            <div className="flex flex-col py-2 px-6 justify-center items-center hover:bg-gray-50 rounded-lg">
              <FiUser />
              <p>ENTRAR</p>
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <MenuAcoes user={dataUser} />
          <MenuUsuario user={dataUser} />
          {/* <button onClick={() => signOut()}>
            <div className="flex flex-col py-2 px-2 justify-center items-center hover:bg-gray-50 rounded-lg">
              <FiLogOut />
              <p>SAIR</p>
            </div>
          </button> */}
        </div>
      )}
    </>
  );
}
