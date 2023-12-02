import React from "react";
import { useRouter } from "next/navigation";
import { Alert as BootstrapAlert } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa"; // Importe o ícone de ajuda

interface AlertProps {
  msg: string;
  urlAlerta: string;
}

const Alert: React.FC<AlertProps> = ({ msg, urlAlerta }) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(urlAlerta);
  };

  return (
    <BootstrapAlert variant="warning" onClose={handleRedirect} dismissible>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FaInfoCircle style={{ marginRight: "10px", color: "blue" }} /> {/* Ícone de ajuda */}
        <div>
          <p style={{ marginBottom: "0" }}>{msg}</p>
          <a href={urlAlerta} style={{ color: "blue", cursor: "pointer" }}>
            Clique aqui
          </a>
        </div>
      </div>
    </BootstrapAlert>
  );
};

export default Alert;
