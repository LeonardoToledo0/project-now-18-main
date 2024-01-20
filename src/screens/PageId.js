import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { db, storage } from '../firebase';
import ReactPlayer from 'react-player';
import "../styles/PageId.css";
import { Link } from "react-router-dom";

export default function HelloWorld() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [file, setFile] = useState(null);
    const [activityNames, setActivityNames] = useState([]);
    const [className, setClassName] = useState("");
    const [containerCreateAtt, setContainerCreateAtt] = useState(false);
    const [openContainerOpcoes, SetopenContainerOpcoes] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // Novo estado para a imagem selecionada

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleVideoUrlChange = (e) => {
        setVideoUrl(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleCreateActivity = async (e) => {
        e.preventDefault();

        let fileUrl = "";
        if (file) {
            const storageRef = storage.ref();
            const fileRef = storageRef.child(`files/${file.name}`);
            await fileRef.put(file);
            fileUrl = await fileRef.getDownloadURL();
        }

        db.collection("classes").doc(id).collection("activities").add({
            name: name,
            videoUrl: videoUrl,
            fileUrl: fileUrl,
            createdAt: new Date(),
        })
            .then((docRef) => {
                console.log("Activity created with ID:", docRef.id);
                setActivityNames(prevNames => [...prevNames, { name, videoUrl, fileUrl }]);
            })
            .catch((error) => {
                console.error("Error adding activity: ", error);
            });
    };

    const openContainerAtt = () => {
        setContainerCreateAtt(!containerCreateAtt);
    };
    const openContainerOpcoesFunction = () => {
        SetopenContainerOpcoes(!openContainerOpcoes);
    };

    const openImageModal = (image) => {
        setSelectedImage(image);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classSnapshot = await db.collection("classes").doc(id).get();
                if (classSnapshot.exists) {
                    const classData = classSnapshot.data();
                    setClassName(classData.turma);
                }

                const activitiesSnapshot = await db.collection("classes").doc(id).collection("activities").get();
                const activities = activitiesSnapshot.docs.map(doc => doc.data());
                setActivityNames(activities);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div id="pageId">
            <h1 style={{ textAlign: 'center', borderBottom: '3px solid black', width: '80%', margin: '30px auto', color: 'black' }}>Escola {className}</h1>
            <button className="button-create-att" onClick={openContainerOpcoesFunction}>+ Criar</button>
            {openContainerOpcoes ? (
                <div id="opcoes-button-create-att">
                    <div>
                        <h3 onClick={openContainerAtt}>Atividade</h3>
                    </div>
                    <div className="link-container-create-att">
                        <Link to={`/Chamada/${id}`}><h3>Chamada</h3></Link>
                    </div>
                </div>
            ) : ('')}
            {/* <div class="main-container-chamada">
                <h1>Chamada da Turma</h1>
            </div> */}

            {containerCreateAtt ? (
                <div id="containerCreateAtt">
                    <form>
                        <label>Título atividade:</label>
                        <input type="text" value={name} onChange={handleNameChange} />

                        <label>Instruções :</label>
                        <textarea></textarea>

                        <label>URL do Vídeo:</label>
                        <input type="text" value={videoUrl} onChange={handleVideoUrlChange} />

                        <label>Selecionar Arquivo:</label>
                        <input type="file" onChange={handleFileChange} />

                        <button onClick={(e) => handleCreateActivity(e)}>Criar Atividade</button>
                    </form>
                </div>
            ) : (
                ""
            )}

            {activityNames.length > 0 && (
                <div id="container-atividades-created">
                    <h2>Nomes das Atividades:</h2>
                    <ul>
                        {activityNames.map((activity, index) => (
                            <li key={index}>
                                {activity.name}
                                {activity.videoUrl && (
                                    <ReactPlayer url={activity.videoUrl} controls={true} width="100%" height="300px" />
                                )}
                                {activity.fileUrl && (
                                    <div>
                                        <span onClick={() => openImageModal(activity.fileUrl)} className="view-image-icon">🔍 Visualizar Imagem</span>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Modal de imagem em tamanho grande */}
            {selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <img src={selectedImage} alt="Imagem em tamanho grande" />
                </div>
            )}
        </div>
    );
}
