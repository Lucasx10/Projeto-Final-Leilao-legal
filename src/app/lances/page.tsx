"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";

type Inputs = {
  shots: string;
};

const AddShots = () => {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<Inputs>({});

  const { data } = useSession();
  const [loading, setLoading] = useState(false);

  async function onSubmit({ shots }: Inputs) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/user/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: data?.user.name, shots }),
        }
      );
      push("/");
    } catch (err) {
      throw new Error();
    }
  }

  return (
    <form
      className="flex flex-col gap-4 bg-white rounded-lg p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-lg">Adicionar lances</h1>

      <TextInput
        placeholder="Quantidade"
        type="number"
        id="shots"
        {...register("shots")}
      />

      <Button type="submit" style={{
          backgroundColor: `${
            loading ? "#ccc" : "var(--primary-button-color)"
          }`,
        }}>Adicionar</Button>
    </form>
  );
};

export default AddShots;