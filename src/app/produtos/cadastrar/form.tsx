"use client";

import { ChangeEvent, useState } from "react";
import { useSession } from "next-auth/react";

export const ProdutosForm = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    nome_produto: "",
    img_produto: "",
    descricao: "",
    valor_de_mercado: "",
    data_inicio_leilao: "",
  });
  const [error, setError] = useState("");
  const [returnMsg, setReturnMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormValues({
      nome_produto: "",
      img_produto: "",
      descricao: "",
      valor_de_mercado: "",
      data_inicio_leilao: "",
    });

    // console.log(JSON.stringify({ ...formValues, userId }));

    try {
      const res = await fetch("/api/produto", {
        method: "POST",
        body: JSON.stringify({ ...formValues, userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      if (!res.ok) {
        setError((await res.json()).message);
        return;
      }

      setReturnMsg(
        `Produto ${formValues.nome_produto} cadastrado com sucesso!`
      );
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";
  
  return (
    <form onSubmit={onSubmit}>
      {error && (
        <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
      )}
      {returnMsg && (
        <p className="text-center bg-green-300 py-4 mb-6 rounded">
          {returnMsg}
        </p>
      )}
      <div className="mb-6">
        <input
          required
          type="text"
          name="nome_produto"
          value={formValues.nome_produto}
          onChange={handleChange}
          placeholder="Nome Produto"
          className={`${input_style}`}
        />
      </div>
      <div className="mb-6">
        <input
          required
          type="text"
          name="img_produto"
          value={formValues.img_produto}
          onChange={handleChange}
          placeholder="Imagem do Produto"
          className={`${input_style}`}
        />
      </div>
      <div className="mb-6">
        <input
          required
          type="text"
          name="descricao"
          value={formValues.descricao}
          onChange={handleChange}
          placeholder="Descrição"
          className={`${input_style}`}
        />
      </div>
      <div className="mb-6">
        <input
          required
          type="text"
          name="valor_de_mercado"
          value={formValues.valor_de_mercado}
          onChange={handleChange}
          placeholder="Valor de mercado (R$)"
          className={`${input_style}`}
        />
      </div>
      <div className="mb-6">
        <input
          required
          type="datetime-local"
          name="data_inicio_leilao"
          value={formValues.data_inicio_leilao}
          onChange={handleChange}
          placeholder="Data/Hora Início do Leilão"
          className={`${input_style}`}
        />
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: `${
            loading ? "#ccc" : "var(--primary-button-color)"
          }`,
        }}
        className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
        disabled={loading}
      >
        {loading ? "loading..." : "Cadastrar Produto"}
      </button>
    </form>
  );
};
