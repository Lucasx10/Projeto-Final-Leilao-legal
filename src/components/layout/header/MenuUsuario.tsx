"use client";

import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { DropdownItem } from "flowbite-react/lib/esm/components/Dropdown/DropdownItem";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function MenuUsuario({ user }: any) {
  return (
    <Navbar fluid rounded>
      <div className="flex md:order-2 gap-4">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img={user.image ? user.image : "/images/default.png"}
              rounded
            /> 
          }
        >
          <Link href="/usuarios/profile">
            <Dropdown.Item>Editar Perfil</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => signOut()}>Sair</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
        <div className="flex flex-col gap-1">
          <span className="block text-sm font-semibold">User: {user.name}</span>
          <span className="block truncate text-sm font-medium">
                  Lances: {user.lances}
          </span>
        </div>
      </div>
    </Navbar>
  );
}
