"use client";

import { Button } from "flowbite-react";
import ProductCard from "./ProductCard";
import { useConnection } from "@/context/connect"

export default function LeilaoOnline() {
  const { produtos } = useConnection();
  console.log(produtos);
  return (
    <div className="flex  flex-col py-2 justify-center items-center">
      <div className="w-full py-1 px-4 mb-3 bg-[#5709BC] text-white uppercase font-bold border-b-4 border-b-[#EC00FF]">
        <h1>Leilões Online</h1>
      </div>
      <div className="flex gap-4 w-full h-full flex-wrap px-8 justify-center">
        {produtos &&
          produtos
            .slice(0, 10)
            .map((prod: any) => <ProductCard key={prod.id} produto={prod} />)}
      </div>
      <div className="flex justify-center py-2 mt-2">
        <Button className="bg-[var(--primary-button-color)]">
          <p>Ver Todos</p>
        </Button>
      </div>
    </div>
  );
}
