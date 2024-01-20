import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Offcanvas } from "react-bootstrap";
import { PlusSquare } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { db } from "../firebase";
import styles from "./styles.module.css";

export const MenuLateralDireito = () => {
  // Estado para controlar a exibição do offcanvas
  const [containerNewClass, setContainerNewClass] = useState(false);

  // Estado para armazenar informações das turmas
  const [turmas, setTurmas] = useState([]);

  // Estado para armazenar dados do formulário
  const [formData, setFormData] = useState({
    turma: "",
    materia: "",
    descricao: "",
    sala: "",
  });

  // Efeito para carregar as turmas do banco de dados
  useEffect(() => {
    const unsubscribe = db.collection("classes").onSnapshot((querySnapshot) => {
      const turmasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        turma: doc.data().turma,
      }));
      setTurmas(turmasData);
    });

    // Cancelar a subscrição quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  // Manipulador de mudanças nos campos do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para criar uma nova turma
  const createNewClass = (e) => {
    e.preventDefault();

    const { turma, materia, descricao, sala } = formData;

    db.collection("classes")
      .add({
        turma,
        materia,
        descricao,
        sala,
      })
      .then(() => {
        // Turma adicionada com sucesso, exibir notificação
        toast.success("Sala criada com sucesso");

        // Fechar o menu de criação de nova turma
        setContainerNewClass(false);
      })
      .catch((error) => {
        // Lidar com erros, se necessário
        console.error("Erro ao criar a turma:", error);
      });
  };

  return (
    <div>
      {/* Botão para abrir/fechar o offcanvas */}
      <PlusSquare
        variant="primary"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasTop"
        aria-controls="#offcanvasTop"
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          width: "40px",
          height: "40px",
        }}
        onClick={() => setContainerNewClass(!containerNewClass)}
      ></PlusSquare>

      {/* Offcanvas para criar uma nova turma */}
      <Offcanvas
        placement="top"
        backdrop={false}
        scroll={false}
        show={containerNewClass}
        onHide={() => setContainerNewClass(false)}
        style={{
          top: "0",
          right: "0",
          bottom: "auto",
          left: "auto",
          position: "fixed",
          width: "100%",
          maxHeight: "100%",
          overflowY: "auto",
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="offcanvasTop">Offcanvas top</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div
            className={`${styles.gridContainer} ${styles.BoxForm}`}
            style={{
              display: "grid",
              gridTemplateRows: "repeat(2, 1fr)",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
              width: "80%",
              height: "80%",
            }}
          >
            <form
              className={`${styles.contactSection} ${styles.BoxFormTitle}`}
              onSubmit={createNewClass}
            >
              {/* Campos do formulário */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "10px",
                }}
              >
                <label
                  className={`${styles.formtextarea} ${styles.InputLabel}`}
                  htmlFor="turma"
                >
                  Nome da Turma:
                </label>
                <input
                  className={`${styles.contactform} ${styles.InputUser}`}
                  type="text"
                  id="turma"
                  name="turma"
                  value={formData.turma}
                  onChange={handleChange}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "10px",
                }}
              >
                <label
                  className={`${styles.formtextarea} ${styles.InputLabel}`}
                  htmlFor="materia"
                >
                  Matéria:
                </label>
                <input
                  className={`${styles.contactform} ${styles.InputUser}`}
                  type="text"
                  id="materia"
                  name="materia"
                  value={formData.materia}
                  onChange={handleChange}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: "10px",
                }}
              >
                <label
                  className={`${styles.formtextarea} ${styles.InputLabel}`}
                  htmlFor="descricao"
                >
                  Descrição:
                </label>
                <input
                  className={`${styles.contactform} ${styles.InputUser}`}
                  type="text"
                  id="descricao"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label
                  className={`${styles.formtextarea} ${styles.InputLabel}`}
                  htmlFor="sala"
                >
                  Sala:
                </label>
                <input
                  className={`${styles.contactform} ${styles.InputUser}`}
                  type="text"
                  id="sala"
                  name="sala"
                  value={formData.sala}
                  onChange={handleChange}
                />
              </div>

              <button
                className={`${styles.formbutton} ${styles.ButtonSubmit}`}
                type="submit"
              >
                Criar Turma
              </button>
            </form>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
