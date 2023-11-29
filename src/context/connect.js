"use client";

import { useState, useContext, createContext, useEffect  } from "react";
import io from "socket.io-client";

const Context = createContext();
export const useConnection = () => useContext(Context);

export const Provider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    const [dataUser, setDataUser] = useState(null);
    const [ produtos, setProdutos] = useState([]);

    const data = {
        connection,
        dataUser,
        setDataUser,
        produtos,
        setProdutos,
    };

    useEffect(() => {
        const socket = io("http://localhost:3001");
        socket.connect();
        socket.on("connect", () => {
            setConnection(socket);
        });
        return () => {
            socket.off("connect");
        };
    }, []);

    useEffect(() =>{
        async function getProdutos() {
            const res = await fetch("http://localhost:3000/api/produto", {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Erro ao recuperar produtos!");
            }

            const prods = await res.json();
            setProdutos(prods);
        }
        getProdutos();
    }, []);

    return <Context.Provider value={{ ...data }}>{children}</Context.Provider>;
};

export default Context;