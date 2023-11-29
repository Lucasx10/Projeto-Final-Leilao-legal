import React from "react";
import { useRouter } from "next/navigation";
import { Alert as BootstrapAlert } from "react-bootstrap";

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
      <p>{msg}</p>
    </BootstrapAlert>
  );
};

export default Alert;
