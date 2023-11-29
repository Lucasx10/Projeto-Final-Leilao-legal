import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

//CACDASTRA UM PRODUTO
export async function POST(req: Request) {
  try {
    const {
      nome_produto,
      img_produto,
      descricao,
      valor_de_mercado,
      data_inicio_leilao,
      userId,
    } = await req.json();

    const produto = await prisma.produto.create({
      data: {
        nomeProduto: nome_produto,
        imgProduto: img_produto,
        descricao,
        valorDeMercado: parseFloat(valor_de_mercado),
        dataInicioLeilao: new Date(data_inicio_leilao),
        userId,
      },
    });

    return NextResponse.json({
      produto,
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Erro no cadastro do produto: " + error.message,
      }),
      { status: 500 }
    );
  }
}

//GET ALL PRODUCTS
export async function GET(req: Request) {
  try {
    const produtos = await prisma.produto.findMany();
    return NextResponse.json(produtos);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Erro ao recuperar lista de Produtos " + error.message,
      }),
      { status: 500 }
    );
  }
}
