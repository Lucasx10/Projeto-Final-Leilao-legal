"use client";

import { Button, Card } from "flowbite-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnection } from "@/context/connect";
import AlertaWarning from "@/components/alerts/AlertaWarning";

export default function ProductCard({ produto }: any) {
  const dataIniLeilao = new Date(produto.dataInicioLeilao);
  const [precoUltLance, setPrecoUltLance] = useState(Number(produto.precoUltimoLance));

  const [userUltLance, setUserUltLance] = useState(produto.userUltimoLance);
  const [timeCron, setTimeCron] = useState("");
  const [isAlive, setIsAlive] = useState(false);

  const { connection, dataUser, setDataUser } = useConnection();
  const [mostraAlerta, setMostraAlerta] = useState(false);
  const [msgAlerta, setMsgAlerta] = useState("");
  const [urlAlerta, setUrlAlerta] = useState("");

  async function startBt() {
    const data = {
      timerAction: "start",
      roomId: produto.id,
    };
    connection.emit("set-timer-action", data);
  }

  async function lanceBt() {
    console.log(dataUser);

    if (dataUser && dataUser.lances > 0) {
      setDataUser((prevData: { lances: number; }) => ({ ...prevData, lances: prevData.lances - 1 }));
      const data = {
        timerAction: "lance",
        roomId: produto.id,
        userId: dataUser.id,
        userUltimoLance: dataUser.name,
        precoUltLance: (Number(produto.precoUltimoLance)),
      };
      connection.emit("set-timer-action", data);
      connection.on("user-update", (data:any) => {
        setDataUser(data);
      });

      connection.emit('set-timer-duration', 20);
    } 

    if (!dataUser) {
      setMsgAlerta("Faça o login!");
      setUrlAlerta("/usuarios/login");
      setMostraAlerta(true);
    }

    if (dataUser && dataUser.lances === 0) {
      setMsgAlerta("Você não tem mais lances disponíveis!");
      setUrlAlerta("/lances");
      setMostraAlerta(true);
    } 

  }

  useEffect(() => {
    if (connection){
      connection.emit("create-room", produto.id);
    }
  }, [connection, produto]);

  useEffect(() => {
    if (connection) {
      connection.on("timer-countdown", (prod_io: any) => {
        if (prod_io.roomId === produto.id) {
          setIsAlive(prod_io.isRunning);
          setTimeCron(prod_io.currentTime);
        }
      });
  
      connection.on("timer-countdown-end", (prod_io: any) => {
        if (prod_io.roomId === produto.id) {
          setIsAlive(prod_io.isRunning);
          setTimeCron(prod_io.currentTime);
        }
      });
  
      connection.on("update-product", (prod_io: any) => {
        if (prod_io.roomId === produto.id) {
          setUserUltLance(prod_io.userUltimoLance);
          setPrecoUltLance(Number(prod_io.precoUltimoLance));
        }
      });

    }
  }, [connection, produto]);
  

  return (
    <Card>
      {mostraAlerta && <AlertaWarning msg={msgAlerta} urlAlerta={urlAlerta} />}
      <div className="flex flex-col w-56 h-[420px] justify-between items-center">
        <div>
          <div className="w-full border border-gray-300 rounded-lg text-center text-xs font-semibold px-3 py-2 items-center justify-center">
            <span>
              INÍCIO DIA: {dataIniLeilao.toLocaleDateString()}{" "}
              {dataIniLeilao.toLocaleTimeString(navigator.language, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {dataUser && dataUser.role === 1 && (
                <Button className="h-6 mt-2 mx-auto" onClick={startBt}>
                  <span>START</span>
                </Button>
              )}
          </div>
          <div className="flex w-full justify-center">
            <div className="flex w-40 h-40 px-5 py-4 justify-center">
            <Image
              src={`/images/imgs_produtos/${produto.imgProduto || "default_img_product.png"}`}
              alt={"img_produto"}
              width="0"
              height="0"
              sizes="100vw"
              className="w-full h-auto"
            />
            </div>
          </div>
          <div className="flex w-full h-8 justify-center text-center font-bold text-purple-950">
            <span>{produto.nomeProduto}</span>
          </div>
        </div>
        <div className="flex flex-col w-full h-56 justify-around items-center ">
        <div>
          {!isAlive && timeCron !== "" ? (
            <span style={{ fontSize: "24px", padding: "5px", borderRadius: "5px", backgroundColor: "lightgreen" }}>
              VENDIDO
            </span>
          ) : (
            <span style={{ fontSize: "24px", padding: "5px", borderRadius: "5px", backgroundColor: Number(timeCron) < 11 ? "lightcoral" : "lightgreen" }}>
              {timeCron}
            </span>
          )}
        </div>
          <div className="text-lg font-bold">
            <span>
              {precoUltLance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: 700, color: "darkblue" }}>{userUltLance ? userUltLance : "Nenhum lance"}</span>
          </div>

          <Button className="bg-[var(--lance-button-color)] w-[90%]" onClick={lanceBt} disabled={!isAlive && timeCron !== ""}>
            <span>LANCE</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}