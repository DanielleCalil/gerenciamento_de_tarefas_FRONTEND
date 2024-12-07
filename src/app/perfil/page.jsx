"use client";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect } from 'react';
import styles from "./page.module.css";
import Link from "next/link";
import api from '@/services/api';

export default function Perfil() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiPorta = process.env.NEXT_PUBLIC_API_PORTA;

    const imageLoader = ({ src, width, quality }) => {
        return `${apiUrl}:${apiPorta}${src}?w=${width}&q=${quality || 75}`;
    };

    const router = useRouter();
    // const [error, setError] = useState(null);
    const [perfil, setPerfil] = useState([]);

    useEffect(() => { 
        const user = JSON.parse(localStorage.getItem('user')); 
        if (!user) {
            router.push('/usuarios/login');
        } else {
            carregaPerfil(user.cod); 
            // console.log(user.cod);            
        }
        
    }, []);

    async function carregaPerfil(user) {

        const dados = { usu_cod: user };
        
        try {
            const response = await api.post('/usuarios', dados);
            console.log(response.data.dados);
            setPerfil(response.data.dados);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.mensagem + '\n' + error.response.data.dados);
            } else {
                alert('Erro no front-end' + '\n' + error);
            }
        }
    }

    // const handleChange = (e) => {
    //     setPerfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // }

    return (
        <main className={styles.main}>
            <div className="containerGlobal">
                <div className={styles.contentWrapper}>
                    <h1 className={styles.perfil}>Perfil</h1>
                    {perfil.length > 0 ? (
                        perfil.map(infoUsu => (
                            <div key={infoUsu.usu_rm} className={styles.parentContainer}>
                                <div className={styles.PIContainer}>
                                    <div className={styles.profileContainer}>
                                        <div className={styles.imgContainer}>
                                            <Image
                                                src={infoUsu.usu_foto}
                                                alt="Foto de perfil"
                                                width={512}
                                                height={512}
                                                loader={imageLoader}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputGroup}>
                                            <label className={styles.textInput}>RM:</label>
                                            <p className={styles.infos}>{infoUsu.usu_rm}</p>
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label className={styles.textInput}>Nome social:</label>
                                            <p className={styles.infos}>{infoUsu.usu_social}</p>
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label className={styles.textInput}>Nome completo:</label>
                                            <p className={styles.infos}>{infoUsu.usu_nome}</p>
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label className={styles.textInput}>E-mail:</label>
                                            <p className={styles.infos}>{infoUsu.usu_email}</p>
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label className={styles.textInput}>Curso técnico ou médio:</label>
                                            {infoUsu.cursos.length > 0 ? (
                                                infoUsu.cursos.map((curso) => (
                                                    <p key={curso.cur_cod} className={styles.infos} >{curso.cur_nome}</p>
                                                ))
                                            ) : (
                                                <p>Não há cursos registrados.</p>
                                            )}
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
                                                        checked={Number(infoUsu.usu_sexo) === Number(opcao.value)}
                                                        disabled
                                                    />
                                                    {opcao.label.charAt(0).toUpperCase() + opcao.label.slice(1)}
                                                </label>
                                            ))}
                                        </form>
                                    </div>
                                </div>
                                <div className={styles.editar}>
                                    <Link href={`/perfil/${infoUsu.usu_cod}`}>
                                        <button className={styles.editarButton}>
                                            <Image
                                                src="/imagens_telas/editar_perfil.png"
                                                width={500}
                                                height={500}
                                                alt="Editar perfil"
                                            />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h1 className={styles.aviso}>Não há resultados para a requisição</h1>
                    )}
                    <div className={styles.redefinir}>
                        <Link href="/usuarios/esqueceuSenha1">Esqueceu a senha?</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
