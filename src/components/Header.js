import React, { useState, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Header.css";
import { db } from "../firebase";
import OffcanvasExample from "./MenuLateralEsquerda"; // Importe o componente OffcanvasExample

export default function Header() {
  const [containerNewClass, setContainerNewClass] = useState(false);
  const [menu, setMenu] = useState(false);
  const [turmas, setTurmas] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    const unsubscribe = db.collection("classes").onSnapshot((querySnapshot) => {
      const turmasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        turma: doc.data().turma,
      }));
      setTurmas(turmasData);
    });

    return () => unsubscribe();
  }, []);

  const handleMenuButtonClick = () => {
    setMenu(!menu); // Alternar entre true e false
    setShowOffcanvas(!showOffcanvas); // Alternar entre true e false
  };

  return (
    <div>
      {/* Botão que ativa o Offcanvas */}
      <Button variant="primary" type="button" onClick={handleMenuButtonClick}>
        {menu ? "Close Menu" : "Open Menu"}
      </Button>

      {/* Offcanvas */}
      <Offcanvas
        scroll={true}
        backdrop={false}
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        target="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="offcanvasScrollingLabel">
            Menu Content
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Conteúdo do menu aqui */}
          <p>Menu item 1</p>
          <p>Menu item 2</p>
          <p>Menu item 3</p>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Adicione o OffcanvasExample dentro do Offcanvas aqui */}
      <OffcanvasExample
        show={showOffcanvas}
        setShowOffcanvas={setShowOffcanvas}
        offcanvasScrollingTarget="offcanvasScrolling"
      />
    </div>
  );
}
