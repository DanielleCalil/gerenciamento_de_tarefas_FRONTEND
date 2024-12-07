"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';

export default function Tarefas() {
  const [isSaving, setIsSaving] = useState(false);
  const [tarefas, setTarefas] = useState([]);
  const router = useRouter();

  function logOff() {
    localStorage.clear();
    router.push('/login');
  }
  return (
    <div className="containerGlobal">
      <div className={styles.background}>
      <div className={styles.editarb}>
                  <button
                    className={styles.sairMenuGrande}
                    onClick={() => logOff()}>
                    <IoLogOutOutline className={styles.tpiconSair} />
                    Sair
                  </button>
                </div>
        <div className={styles.transparencia}>
          <div className={styles.conteudo}>
            <div className={styles.card}>
              <div className={styles.header}>
                
                <Link href="/" className={styles.titulo}>
                  <h1>Tarefas</h1>
                </Link>
                
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.inputGroup}>
                  <div className={styles.inputFlex}>
                    <div className={styles.inputMargin}>
                      <span className={styles.titleSuperior}>Nome da tarefa:</span>
                      <input
                        type="text"
                        // value={infoContatoEdt.esc_nome}
                        // onChange={(e) => setInfoContatoEdt({ ...infoContatoEdt, esc_nome: e.target.value })}
                        className={`${styles.inputField} ${styles.nomeInput}`}
                        aria-label="Nome da tarefa"
                      />
                    </div>
                    <div className={styles.editar}>
                      <button
                        type="submit"
                        // onClick={openModalConfirm}
                        className={styles.saveButton}
                      >
                        {isSaving ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.inputMargin}>
                    <span className={styles.titleSuperior}>Descrição da tarefa:</span>
                    <input
                      type="text"
                      // value={infoContatoEdt.esc_email}
                      // onChange={(e) => setInfoContatoEdt({ ...infoContatoEdt, esc_email: e.target.value })}
                      className={`${styles.inputField} ${styles.nomeInput}`}
                      aria-label="Descrição da tarefa"
                    />
                  </div>
                </div>

              </div>

              <div className={styles.container}>
                <div className={styles.bookList}>
                  {tarefas.length > 0 ? (
                    tarefas.map(tarefa => (
                      <div className={styles.bookItem} key={tarefa.id}>
                        <div className={styles.bookInfo}>
                          <h2 className={styles.bookTitle}>{tarefa.liv_nome}</h2>
                          <p className={styles.bookAuthor}>{tarefa.aut_nome}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h1>Não há resultados para a requisição</h1>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}