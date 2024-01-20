// NavigationForClass.js
import React from "react";
import "../styles/NavigationForClass.css"

const NavigationForClass = ({ turma, deleteClass }) => {
  return (
    <div id="NavigationForClass">
      <p>Materia: {turma.materia}</p>
      <p>Sala: {turma.sala}</p>

      <button onClick={() => deleteClass(turma.id)}>Excluir Turma</button>
    </div>
  );
};

export default NavigationForClass;
