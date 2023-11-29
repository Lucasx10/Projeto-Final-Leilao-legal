import DefaultCarousel from "@/components/layout/Carousel";
import Depoimentos from "@/components/layout/depoimentos/Depoimentos";
import LeilaoOnline from "@/components/layout/leilao_online/Leilao";

async function getProdutos() {
  const res = await fetch("http://localhost:3000/api/produto", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao recuperar produtos!");
  }

  return res.json();
}

export default async function Home() {
  const produtos = await getProdutos();

  return (
    <div>
      <main className="flex flex-col w-[80%] m-auto">
        <section className="h-96">
          <DefaultCarousel />
        </section>
        <section>
          <LeilaoOnline produtos={produtos} />
        </section>
      </main>
      <section className="flex w-full">
        <Depoimentos />
      </section>
    </div>
  );
}
