"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import { IoLogOutOutline, IoPersonOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';

import api from '../services/api';

export default function Tarefas() {
  const [isSaving, setIsSaving] = useState(false);
  const [tarefas, setTarefas] = useState({
    titulo: '',
    descricao: '',
    status: 'pendente',
  });
  const router = useRouter();

  function logOff() {
    localStorage.clear();
    router.push('/login');
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      router.push('/login');
    } else {
      carregaTarefas(user.cod);
    }
  }, []);

  const valDefault = styles.formControl;
  const valSucesso = styles.formControl + ' ' + styles.success;
  const valErro = styles.formControl + ' ' + styles.error;

  async function carregaTarefas(user) {

    const dados = { id: user };

    try {
      const response = await api.post('/tarefas', dados);
      console.log(response.data.dados);
      setTarefas(response.data.dados);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.mensagem + '\n' + error.response.data.dados);
      } else {
        alert('Erro no front-end' + '\n' + error);
      }
    }
  }

  const [valida, setValida] = useState({
    titulo: {
      validado: valDefault,
      mensagem: []
    },
    descricao: {
      validado: valDefault,
      mensagem: []
    },
  });

  function validaTitulo() {

    let objTemp = {
      validado: valSucesso, // css referente ao estado de validação
      mensagem: [] // array de mensagens de validação
    };

    if (!tarefas?.titulo || tarefas.titulo.length < 5) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('Insira o nome completo da tarefa');
    }


    setValida(prevState => ({
      ...prevState, // mantém os valores anteriores
      titulo: objTemp // atualiza apenas o campo 'nome'
    }));

    const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
    return testeResult;
  }

  function validaDescricao() {

    let objTemp = {
      validado: valSucesso, // css referente ao estado de validação
      mensagem: [] // array de mensagens de validação
    };

    if (!tarefas?.descricao || tarefas.descricao.length < 5) {
      objTemp.validado = valErro;
      objTemp.mensagem.push('A descrição da tarefa é obrigatória');
    }

    setValida(prevState => ({
      ...prevState, // mantém os valores anteriores
      descricao: objTemp // atualiza apenas o campo 'nome'
    }));

    const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
    return testeResult;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let itensValidados = 0;

    itensValidados += validaTitulo();
    itensValidados += validaDescricao();

    if (itensValidados === 2) {
      try {
        const response = await api.post('/tarefasCadastrar', tarefas);
        if (response.data.sucesso) {
          // openModalAvisoCad();
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.mensagem + '\n' + error.response.data.dados);
        } else {
          alert('Erro no front-end' + '\n' + error);
        }
      }
    }
  }
  console.log(tarefas);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefas(prev => ({ ...prev, [name]: value }));
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

                <div className={styles.editarEdi}>
                  <button
                    className={styles.perfilButton}
                    onClick={() => router.push("/perfil")}>
                    <IoPersonOutline className={styles.tpicon} />
                    Perfil
                  </button>
                </div>

              </div>

              <form id="form" onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                  <div className={styles.inputGroup}>
                    <div className={styles.inputFlex}>

                      <div className={styles.inputMargin}>
                        <span className={styles.titleSuperior}>Título da tarefa:</span>
                        <div className={valida.titulo.validado + ' ' + styles.valTitulo} id="valTitulo">
                          <div className={styles.divInput}>
                            <input
                              type="text"
                              value={tarefas.titulo}
                              onChange={(e) => setTarefas({ ...tarefas, titulo: e.target.value })}
                              className={`${styles.inputField} ${styles.nomeInput}`}
                              aria-label="Titulo da tarefa"
                            />
                            <IoCheckmarkCircleOutline className={styles.sucesso} />
                            <IoAlertCircleOutline className={styles.erro} />
                          </div>
                          {
                            valida.titulo.mensagem.map(mens => <small key={mens} id="titulo" className={styles.small}>{mens}</small>)
                          }
                        </div>
                      </div>

                      <div className={styles.editar}>
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className={styles.saveButton}
                        >
                          {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </div>

                    <div className={styles.inputMargin}>
                      <span className={styles.titleSuperior}>Descrição da tarefa:</span>
                      <div className={valida.descricao.validado + ' ' + styles.validaDescricao} id="valDescricao">
                        <div className={styles.divInput}>
                          <input
                            type="text"
                            value={tarefas.descricao}
                            onChange={(e) => setTarefas({ ...tarefas, descricao: e.target.value })}
                            className={`${styles.inputField} ${styles.nomeInput}`}
                            aria-label="Descrição da tarefa"
                          />
                          <IoCheckmarkCircleOutline className={styles.sucesso} />
                          <IoAlertCircleOutline className={styles.erro} />
                        </div>
                        {
                          valida.descricao.mensagem.map(mens => <small key={mens} id="descricao" className={styles.small}>{mens}</small>)
                        }
                      </div>
                    </div>

                  </div>
                </div>
              </form>

              <div className={styles.container}>
                <div className={styles.alinhamento}>
                  {tarefas.length > 0 ? (
                    tarefas.map(tarefa => (
                      <div className={styles.Item} key={tarefa.id}>
                        <div className={styles.bookInfo}>
                          <div>
                          <button onClick={() => handleDelete(tarefa.id)}>Excluir</button>
                          <h2 className={styles.Title}>{tarefa.titulo}</h2>
                          </div>
                          <p className={styles.Description}>{tarefa.descricao}</p>
                         <button onClick={() => handleConfirm(tarefa.id)}>Concluir</button>
                         <button onClick={() => handleEdit(tarefa.id)}>Editar</button>
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