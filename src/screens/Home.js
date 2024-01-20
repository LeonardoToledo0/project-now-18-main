import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import "../styles/Home.css";
import NavigationForClass from "./NavigationForClass";

import { TfiMenuAlt } from "react-icons/tfi";

export default function Home() {
  const [classes, setClasses] = useState([]);
  const [expandedClass, setExpandedClass] = useState(null);

  useEffect(() => {
    const unsubscribe = db.collection("classes").onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          turma: doc.data().turma,
          descricao: doc.data().descricao,
          materia: doc.data().materia,
          sala: doc.data().sala,
        });
      });
      setClasses(data);
    });

    return () => unsubscribe();
  }, []);

  function deleteClass(id) {
    db.collection("classes").doc(id).delete();
  }

  function toggleClassExpansion(id) {
    setExpandedClass(expandedClass === id ? null : id);
  }

  return (
    <main>
      <div id="main-content">
        <h3 style={{ textAlign: "center", marginTop: "40px" }}>
          Seja bem-vindo!
        </h3>
        {classes.map((classe) => (
          <div
            key={classe.id}
            className="container-class"
            style={{ margin: "10px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link to={`/class/${classe.id}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h3>{classe.turma}</h3>
                </div>
              </Link>
              <TfiMenuAlt onClick={() => toggleClassExpansion(classe.id)} />
            </div>

            {expandedClass === classe.id && (
              <div>
                <NavigationForClass turma={classe} deleteClass={deleteClass} />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
