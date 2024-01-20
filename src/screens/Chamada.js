import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import jsPDF from "jspdf";
import moment from "moment";
import { useParams } from 'react-router-dom';
import "../styles/Chamada.css";

const ChamadaTurma = () => {
    const { id } = useParams();
    const [students, setStudents] = useState([]);
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentPhoto, setNewStudentPhoto] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsCollection = await db.collection("students").where("classId", "==", id).get();
                const studentsData = studentsCollection.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    isPresent: false,
                }));
                setStudents(studentsData);
            } catch (error) {
                console.error("Error fetching students: ", error);
            }
        };

        fetchStudents();
    }, [id]);

    const handleTogglePresence = (id) => {
        setStudents((prevStudents) => {
            return prevStudents.map((student) => {
                if (student.id === id) {
                    return { ...student, isPresent: !student.isPresent };
                }
                return student;
            });
        });
    };

    const handleGeneratePDF = async () => {
        const pdf = new jsPDF();
        pdf.text("Lista de Presença", 20, 10);

        students.forEach((student, index) => {
            if (student.isPresent) {
                pdf.text(`${index + 1}. ${student.name} - Presente`, 20, 20 + index * 10);
            }
        });

        // Adicionar a data e o horário no PDF
        const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
        pdf.text(`Data e Hora: ${timestamp}`, 20, pdf.internal.pageSize.height - 10);

        const pdfBlob = pdf.output("blob");

        // Enviar o PDF para o Firebase Storage
        const storageRef = storage.ref();
        const pdfRef = storageRef.child(`pdfs/${id}/lista_presenca_${timestamp}.pdf`);
        await pdfRef.put(pdfBlob);

        // Adicionar informações do PDF à coleção "pdfs" no Firestore
        const pdfInfo = {
            timestamp: new Date(),
            classId: id,
            pdfUrl: await pdfRef.getDownloadURL(),
        };

        await db.collection("pdfs").add(pdfInfo);

        alert("PDF gerado e informações salvas com sucesso!");
    };

    const handleAddStudent = async () => {
        if (newStudentName.trim() !== "") {
            try {
                const photoUrl = await uploadStudentPhoto();
                const newStudentRef = await db.collection("students").add({
                    name: newStudentName,
                    classId: id,
                    photoUrl: photoUrl, // URL da foto do aluno
                });
                setStudents((prevStudents) => [
                    ...prevStudents,
                    { id: newStudentRef.id, name: newStudentName, isPresent: false, photoUrl: photoUrl },
                ]);
                setNewStudentName("");
                setNewStudentPhoto(null);
            } catch (error) {
                console.error("Error adding new student: ", error);
            }
        }
    };

    const uploadStudentPhoto = async () => {
        try {
            if (newStudentPhoto) {
                const storageRef = storage.ref();
                const photoRef = storageRef.child(`photos/${id}/${newStudentName}_${moment().format("YYYY-MM-DD_HH:mm:ss")}.jpg`);
                await photoRef.put(newStudentPhoto);
                return await photoRef.getDownloadURL();
            }
            return null;
        } catch (error) {
            console.error("Error uploading student photo: ", error);
            return null;
        }
    };

    const handlePhotoChange = (e) => {
        if (e.target.files.length > 0) {
            const photo = e.target.files[0];
            setNewStudentPhoto(photo);
        }
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Lista de Chamada</h2>

            <table border={1} className="main-table-chamada">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Foto</th>
                        <th>Presente</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.photoUrl && <img src={student.photoUrl} alt={student.name} style={{ width: '50px', height: '50px' }} />}</td>
                            <td>
                                <div
                                    className={`larger-checkbox ${student.isPresent ? 'checked' : ''}`}
                                    onClick={() => handleTogglePresence(student.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleGeneratePDF} className="button-gerar-PDF">Gerar PDF</button>
            <div>
                <h2 style={{ textAlign: 'center' }}>Adicionar Novo Aluno</h2>
                <input className="input-add-new-aluno"
                    type="text"
                    placeholder="Nome do novo aluno"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                />
                <input type="file" accept="image/*" className="input-add-image-aluno" onChange={handlePhotoChange} />
                <button onClick={handleAddStudent} className="button-add-new-aluno">Adicionar Aluno</button>
            </div>

            <div id="lista-de-PDFS"></div>
        </div>
    );
};

export default ChamadaTurma;
