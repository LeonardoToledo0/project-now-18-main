import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Offcanvas, ListGroup, ListGroupItem } from "react-bootstrap";
import {
  House,
  Clock,
  PersonCircle,
  Stopwatch,
  List as ListIcon,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfjQWgESRPJ9-25gui7Xg-Se6ggPSmmrg",
  authDomain: "prof-bruno.firebaseapp.com",
  projectId: "prof-bruno",
  storageBucket: "prof-bruno.appspot.com",
  messagingSenderId: "668359353020",
  appId: "1:668359353020:web:ea3b9b16082435074c66b9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const MenuLateralEsquerdo = () => {
  const [containerNewClass, setContainerNewClass] = useState(false);
  const [menu, setMenu] = useState(false);
  const [turmas, setTurmas] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "classes"),
      (querySnapshot) => {
        const turmasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          turma: doc.data().turma,
        }));
        setTurmas(turmasData);
      }
    );

    return () => unsubscribe();
  }, [db]);

  function createNewClass(e) {
    e.preventDefault();

    let nomeTurma = document.getElementById("nameClasse").value;
    let materia = document.getElementById("materia").value;
    let descricao = document.getElementById("descricao").value;
    let sala = document.getElementById("sala").value;

    addDoc(collection(db, "classes"), {
      turma: nomeTurma,
      materia: materia,
      descricao: descricao,
      sala: sala,
    })
      .then(() => {
        // Class added successfully, show toast notification
        toast.success("Sala criada com sucesso");

        // Close the menu for creating a new class
        setContainerNewClass(false);
      })
      .catch((error) => {
        // Handle errors if needed
        console.error("Error creating class:", error);
      });
  }

  return (
    <div>
      <ListIcon
        style={{ width: "40px", height: "40px" }}
        variant="primary"
        onClick={() => setContainerNewClass(!containerNewClass)}
        aria-controls="offcanvasScrolling"
      />
      <Offcanvas
        show={containerNewClass}
        onHide={() => setContainerNewClass(false)}
        scroll={true}
        backdrop={false}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title
            id="offcanvasScrollingLabel"
            style={{
              fontWeight: "bold",
              textAlign: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            Painel de Controle
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup id="menu-list">
            <ListGroup.Item
              style={{
                display: "flex",
                alignItems: "center",
                border: "none", // Adicionado para remover a borda
              }}
            >
              <House style={{ width: "22px", height: "22px" }} />
              <a
                href="/"
                style={{
                  marginLeft: "18px",
                  fontSize: "22px",
                  listStyle: "none",
                  textDecoration: "none",
                }}
              >
                Início
              </a>
            </ListGroup.Item>
            <h3 style={{ marginTop: "20px" }}>Minhas escolas</h3>
            {turmas.map((turma) => (
              <ListGroup.Item
                key={turma.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "none", // Adicionado para remover a borda
                  marginRight: "10px", // Adicionado para 10px de margem à esquerda
                }}
              >
                <PersonCircle style={{ width: "22px", height: "22px" }} />
                <a
                  style={{
                    marginLeft: "22px",
                    fontSize: "22px",
                    listStyle: "none",
                    textDecoration: "none",
                  }}
                  href={`/class/${turma.id}`}
                >
                  {turma.turma}
                </a>
              </ListGroup.Item>
            ))}
            <h3 style={{ marginTop: "20px" }}>Funcionalidades</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Stopwatch
                style={{ marginLeft: "18px", width: "22px", height: "22px" }}
              />
              <a
                href="/Cronometro"
                style={{
                  marginLeft: "18px",
                  fontSize: "22px",
                  listStyle: "none",
                  textDecoration: "none",
                }}
              >
                Cronômetro
              </a>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Clock
                style={{ marginLeft: "18px", width: "22px", height: "22px" }}
              />
              <a
                href="/Metronomo"
                style={{
                  marginLeft: "18px",
                  fontSize: "22px",
                  listStyle: "none",
                  textDecoration: "none",
                }}
              >
                Metrônomo
              </a>
            </div>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
