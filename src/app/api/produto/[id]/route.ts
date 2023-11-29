import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const produto = await prisma.produto.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  return NextResponse.json(produto);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const json = await req.json();

  const updated = await prisma.produto.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      nomeProduto: json.nome_produto || null,
      imgProduto: json.img_produto || null,
      descricao: json.descricao || null,
      valorDeMercado: parseFloat(json.valor_de_mercado) || null,
      dataInicioLeilao: new Date(json.data_inicio_leilao) || null,
      userId: json.userId,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const deleted = await prisma.produto.delete({
    where: {
      id: parseInt(id, 10),
    },
  });

  return NextResponse.json(deleted);
}
