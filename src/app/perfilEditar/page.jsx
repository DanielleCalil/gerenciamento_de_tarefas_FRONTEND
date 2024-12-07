"use client";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import Link from "next/link";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import FileInput from "@/componentes/FileInput/page";
import ModalConfirmar from '@/componentes/modalConfirmar/page';
import Usuario from "@/../../public/Icons TCC/perfil.jpg";
import api from '@/services/api';


export default function PerfilEditar({ codUsu }) {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiPorta = process.env.NEXT_PUBLIC_API_PORTA;

    const imageLoader = ({ src, width, quality }) => {
        return `${apiUrl}:${apiPorta}${src}?w=${width}&q=${quality || 75}`;
    };

    const router = useRouter();
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [selectedSexo, setSelectedSexo] = useState('');
    // const [img, setImg] = useState('');
    const [cursoSelecionadoAluno, setCursoSelecionadoAluno] = useState(null);
    const [cursoSelecionadoEscola, setCursoSelecionadoEscola] = useState(null);
    console.log('aluno:', cursoSelecionadoAluno);


    const handleClickAluno = (cur_cod) => {
        setCursoSelecionadoAluno(cur_cod);
    };
    const handleClickEscola = (cur_cod) => {
        setCursoSelecionadoEscola(cur_cod);
    };

    const handleAddCurso = async (cur_cod) => {
        try {
            const response = await api.post(`/usuarios_cursos`, { usu_cod: codUsu, cur_cod: cursoSelecionadoEscola });
            if (response.data.sucesso) {
                alert('Curso adicionado com sucesso!');
                listaCursos();
                handleCarregaPerfil();
            }
        } catch (error) {
            console.error("Erro ao adicionar curso:", error);
            alert(error.response ? error.response.data.mensagem : 'Erro ao adicionar curso. Tente novamente.');
        }
    };

    const handleRemoveCurso = async (cur_cod) => {
        try {
            const response = await api.delete(`/usuarios_cursos/${cursoSelecionadoAluno}`);
            if (response.data.sucesso) {
                alert('Curso removido com sucesso!');
                listaCursos();
                handleCarregaPerfil();
            }
        } catch (error) {
            console.error("Erro ao remover curso:", error);
            alert(error.response ? error.response.data.mensagem : 'Erro ao remover curso. Tente novamente.');
        }
    };

    const [perfilEdt, setPerfilEdt] = useState({
        "usu_cod": '',
        "usu_rm": '',
        "usu_social": '',
        "usu_nome": '',
        "usu_email": '',
        "usu_senha": null,
        "usu_sexo": '',
        "usu_foto": '',
        "usu_ativo": '',
        "ucu_cod": '',
        "cur_cod": '',
        "cur_nome": '',
        // img: imgUp
    });

    const [imageSrc, setImageSrc] = useState(perfilEdt.liv_foto_capa || '');
    const handleFileSelect = (imageUrl) => {
        setImageSrc(imageUrl);
    };

    const handleImageChange = (imageURL) => {
        setImageSrc(imageURL);
        setPerfilEdt((prev) => ({ ...prev, usu_foto: imageURL }));
    };

    const [showModalConfirm, setShowModalConfirm] = useState(false);

    const openModalConfirm = () => setShowModalConfirm(true);
    const closeModalConfirm = () => setShowModalConfirm(false);

    const handleConfirm = async () => {
        try {
            closeModalConfirm();
            await handleSave();
        } catch (error) {
            console.error("Erro ao confirmar a ação:", error);
            alert('Ocorreu um erro ao tentar salvar. Por favor, tente novamente.');
        }
    };

    useEffect(() => {
        if (codUsu) listaCursos();
    }, [codUsu]);

    async function listaCursos() {
        const dados = { usu_cod: codUsu };

        try {
            const response = await api.post('/usuc_disp', dados);
            setCursos(response.data.dados);
            // console.log("codUsu:", codUsu);
            // console.log("Resposta da API:", response.data);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.mensagem + '\n' + error.response.data.dados);
            } else {
                alert('Erro no front-end' + '\n' + error);
            }
        }
    }
    console.log(cursos);


    useEffect(() => {
        if (!codUsu) return;

        handleCarregaPerfil();
    }, [codUsu]);

    const handleCarregaPerfil = async () => {
        const dados = { usu_cod: codUsu };
        try {
            const response = await api.post('/usuarios', dados);
            if (response.data.sucesso) {
                const edtPerfilApi = response.data.dados[0];
                // console.log("Perfil carregado:", edtPerfilApi);
                setPerfilEdt(edtPerfilApi);
                setSelectedSexo(edtPerfilApi.usu_sexo);
            } else {
                alert(response.data.mensagem);
            }
        } catch (error) {
            alert(error.response ? error.response.data.mensagem : 'Erro no front-end');
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerfilEdt(prev => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Verifica se o arquivo foi selecionado
        if (!file) {
            setValida((prevState) => ({
                ...prevState,
                foto: { validado: valErro, mensagem: ["Por favor, selecione uma foto."] },
            }));
            return;
        }

        // Verifica o tipo do arquivo
        const validFileTypes = ["image/jpeg", "image/png"];
        if (!validFileTypes.includes(file.type)) {
            setValida((prevState) => ({
                ...prevState,
                foto: { validado: valErro, mensagem: ["O formato do arquivo deve ser PNG ou JPEG."] },
            }));
            return;
        }

        // Verifica o tamanho do arquivo (limite de 5MB, por exemplo)
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            setValida((prevState) => ({
                ...prevState,
                foto: { validado: valErro, mensagem: ["O tamanho do arquivo deve ser menor que 5MB."] },
            }));
            return;
        }

        // Se o arquivo for válido
        setLivro((prev) => ({ ...prev, usu_foto: file }));
        setValida((prevState) => ({
            ...prevState,
            foto: { validado: valSucesso, mensagem: [] },
        }));
    };


    const handleChangeSexo = (e) => {
        // Atualiza o valor de 'usu_sexo' com base na seleção do usuário
        setSelectedSexo(e.target.value);
    };

    const handleSave = async () => {
        const { usu_rm, usu_nome, usu_email, cur_nome, usu_sexo } = perfilEdt;

        // Adiciona um log para ver os dados que estão sendo enviados
        // console.log("Dados a serem enviados:", {
        //     usu_rm,
        //     usu_nome,
        //     usu_email,
        //     cur_nome,
        //     usu_sexo,
        //     usu_foto
        // });

        if (!usu_email) {
            alert('Todos os campos devem ser preenchidos');
            return;
        }

        setIsSaving(true); // Inicia o salvamento

        try {
            const response = await api.patch(`/usuarios/${perfilEdt.usu_cod}`, {
                ...perfilEdt,
                usu_foto: imageSrc
            });

            if (response.data.sucesso) {
                alert('Usuário atualizado com sucesso!');
                router.push('/perfil'); // Redireciona após o sucesso
            }
        } catch (error) {
            console.error("Erro ao salvar informações do usuário:", error);
            alert(error.response ? error.response.data.mensagem : 'Erro ao salvar informações. Tente novamente.');
        } finally {
            setIsSaving(false); // Finaliza o salvamento
        }
    };

    // const upload = async () => {
    //     try {
    //         const formdata = new FormData();
    //         formdata.append('img', img);
    //         const res = await api.post('/upload', formdata);
    //         setImg(res.data.dados);
    //         return res.data.dados;
    //     } catch (err) {
    //         alert(`Erro no upload, tente novamente. ${"\n"} ${err}${err.mensagem}`);
    //     }
    // };

    // async function handleSubmitImagem(event) {
    //     event.preventDefault();
    //     let imgUrl = "";
    //     if (img) imgUrl = await upload();
    //     await handleCreate(imgUrl);
    // }

    // console.log(perfilEdt);
    return (
        <main className={styles.main}>
            <div className="containerGlobal">
                <h1 className={styles.perfil}>Perfil</h1>
                {perfilEdt.usu_cod ? (
                    <div className={styles.PIContainer}>
                        <div className={styles.profileContainer}>
                            <div className={styles.imgContainer}>
                                <Image
                                    src={imageSrc || perfilEdt.usu_foto}
                                    alt="Foto de perfil"
                                    width={512}
                                    height={512}
                                    loader={imageLoader}
                                    priority
                                />
                            </div>
                            {/* <FileInput onFileSelect={handleImageChange} onChange={handleFileChange} /> */}
                            {/* <div>
                                <input
                                    type="file"
                                    id="fileinput"
                                    name='perfil'
                                    className={styles.customFile}
                                    onChange={v => setImg(v.target.files[0])}
                                />
                                <label htmlFor="fileInput" className={styles.customFileUpload}>Escolha o arquivo</label>
                            </div> */}
                        </div>

                        <div className={styles.inputContainer}>
                            <div className={styles.inputGroup}>
                                <p className={styles.textInput}>RM:</p>
                                <input
                                    type="number"
                                    value={perfilEdt.usu_rm}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        setPerfilEdt({ ...perfilEdt, usu_rm: isNaN(value) ? 0 : value });
                                    }}
                                    className={`${styles.inputField} ${styles.inputRm}`}
                                    aria-label="Registro de matrícula"
                                    disabled
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <p className={styles.textInput}>Nome social:</p>
                                <input
                                    type="text"
                                    value={perfilEdt.usu_social}
                                    onChange={(e) => setPerfilEdt({ ...perfilEdt, usu_social: e.target.value })}
                                    className={styles.inputField}
                                    aria-label="Nome Social"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <p className={styles.textInput}>Nome completo:</p>
                                <input
                                    type="text"
                                    value={perfilEdt.usu_nome}
                                    onChange={(e) => setPerfilEdt({ ...perfilEdt, usu_nome: e.target.value })}
                                    className={styles.inputField}
                                    aria-label="Nome Completo"
                                    disabled
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.textInput}>E-mail:</label>
                                <input
                                    type="email"
                                    value={perfilEdt.usu_email}
                                    onChange={(e) => setPerfilEdt({ ...perfilEdt, usu_email: e.target.value })}
                                    className={styles.inputField}
                                    aria-label="E-mail"
                                />
                            </div>
                            <div className={styles.listaCursos}>

                                <div className={styles.inputCursos}>
                                    <label className={styles.textInput}>Cursos já selecionados:</label>
                                    <ul
                                        id="cur_cod"
                                        name="cur_cod"
                                        value={perfilEdt.cur_cod}
                                        onChange={handleChange}
                                        className={styles.opcaoCursos}
                                    >

                                        {perfilEdt.cursos.length > 0 ? (
                                            perfilEdt.cursos.map((cur) => (
                                                <li
                                                    key={cur.ucu_cod}
                                                    value={cur.ucu_cod}
                                                    onClick={() => handleClickAluno(cur.ucu_cod)}
                                                    className={cursoSelecionadoAluno === cur.ucu_cod ? styles.selected : ''}>
                                                    {cur.cur_nome}
                                                </li>
                                            ))
                                        ) : (
                                            <p>Não há cursos registrados.</p>
                                        )}
                                    </ul>
                                </div>
                                <div className={styles.buttons}>
                                    <button className={styles.cursosButton}
                                        onClick={() => cursoSelecionadoEscola && handleAddCurso(cursoSelecionadoAluno)}>
                                        <IoChevronBack size={20} color="#FFF" />
                                    </button>
                                    <button className={styles.cursosButton}
                                        onClick={() => cursoSelecionadoAluno && handleRemoveCurso(cursoSelecionadoEscola)}>
                                        <IoChevronForward size={20} color="#FFF" />
                                    </button>
                                </div>
                                <div className={styles.inputCursos}>
                                    <label className={styles.textInput}>Selecione o curso:</label>
                                    <ul
                                        id="cur_cod"
                                        name="cur_cod"
                                        value={perfilEdt.cur_cod}
                                        onChange={handleChange}
                                        className={styles.opcaoCursos}
                                    >

                                        {cursos.length > 0 ? (
                                            cursos.map((cur) => (
                                                <li
                                                    key={cur.cur_cod}
                                                    value={cur.cur_cod}
                                                    onClick={() => handleClickEscola(cur.cur_cod)}
                                                    className={cursoSelecionadoEscola === cur.cur_cod ? styles.selected : ''}>
                                                    {cur.cur_nome}
                                                </li>
                                            ))
                                        ) : (
                                            <p>Não há cursos registrados.</p>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <form className={styles.sexoForm}>
                                <legend>Sexo:</legend>
                                {[
                                    { label: 'Feminino', value: '0' },
                                    { label: 'Masculino', value: '1' },
                                    { label: 'Neutro', value: '2' },
                                    { label: 'Padrão', value: '3' }
                                ].map((opcao) => (
                                    <label key={opcao.value}>
                                        <input
                                            type="radio"
                                            name="usu_sexo"
                                            value={opcao.value}
                                            checked={Number(perfilEdt.usu_sexo) === Number(opcao.value)}
                                            onChange={(e) => {
                                                setSelectedSexo(e.target.value); // Atualiza selectedSexo
                                                setPerfilEdt({ ...perfilEdt, usu_sexo: e.target.value }); // Atualiza perfilEdt
                                            }}
                                        />
                                        {opcao.label.charAt(0).toUpperCase() + opcao.label.slice(1)}
                                    </label>
                                ))}
                            </form>
                        </div>
                    </div>

                ) : (
                    <h1 className={styles.aviso}>Não há resultados para a requisição</h1>
                )}
            </div>
            <div className={styles.editar}>
                <button
                    type="submit"
                    onClick={() => { handleSave() }}
                    className={styles.saveButton}
                >
                    {isSaving ? 'Salvando...' : 'Salvar alterações'}
                </button>
            </div>
            <ModalConfirmar
                show={showModalConfirm}
                onClose={closeModalConfirm}
                onConfirm={handleConfirm}
            />
        </main >
    );
}
