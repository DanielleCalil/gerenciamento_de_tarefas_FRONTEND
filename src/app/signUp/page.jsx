"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import InputMask from 'react-input-mask';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { IoEye, IoEyeOff, IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";

import ModalAvisoCadastro from '@/componentes/modalAvisoCadastro/page';
import api from '@/services/api';


export default function SignUp() {
    const router = useRouter();
    const [cursos, setCursos] = useState([]);
    const [selectedSexo, setSelectedSexo] = useState('');

    const [usuario, setUsuario] = useState({
        "usu_rm": '',
        "usu_nome": '',
        "usu_email": '',
        "usu_senha": '',
        "confSenha": '',
        "usu_sexo": '',
        "cur_cod": '',
        "usu_foto": '',
    });

    const valDefault = styles.formControl;
    const valSucesso = styles.formControl + ' ' + styles.success;
    const valErro = styles.formControl + ' ' + styles.error;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const [showModalAvisoCad, setShowModalAvisoCad] = useState(false);

    const openModalAvisoCad = () => setShowModalAvisoCad(true);
    const closeModalAvisoCad = () => setShowModalAvisoCad(false);

    const handleAvisoCad = () => {
        setShowModalAvisoCad(false); // Fecha o modal
        router.push('../../usuarios/login');
    };

    useEffect(() => {
        listaCursos();
    }, []);

    async function listaCursos() {
        try {
            const response = await api.post('/cursos');
            setCursos(response.data.dados);
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.mensagem + '\n' + error.response.data.dados);
            } else {
                alert('Erro no front-end' + '\n' + error);
            }
        }
    }

    // validação
    const [valida, setValida] = useState({
        foto: {
            validado: valDefault,
            mensagem: []
        },
        nome: {
            validado: valDefault,
            mensagem: []
        },
        rm: {
            validado: valDefault,
            mensagem: []
        },
        email: {
            validado: valDefault,
            mensagem: []
        },
        sexo: {
            validado: valDefault,
            mensagem: []
        },
        senha: {
            validado: valDefault,
            mensagem: []
        },
        confSenha: {
            validado: valDefault,
            mensagem: []
        },
        cur_cod: {
            validado: valDefault,
            mensagem: []
        },
    });

    const handleChange = (e) => {
        setUsuario(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleChangeSexo = (event) => {
        // Atualiza o valor de 'usu_sexo' com base na seleção do usuário
        console.log('Valor selecionado:', event.target.value);
        setSelectedSexo(event.target.value);
    };

    // const [selectCursos, setSelectCursos] = useState('');
    // const handleSelectCursosChange = (e) => {
    //     setSelectCursos(e.target.value);
    //     setError(''); // Limpa o erro se necessário
    // };

    function validaSelectCursos() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (!usuario.cur_cod) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Por favor, selecione uma opção no campo.');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            cur_cod: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaNome() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (usuario.usu_nome === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O nome do usuário é obrigatório');
        } else if (usuario.usu_nome.length < 5) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira o nome completo do usuário');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            nome: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaRM() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (usuario.usu_rm === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O RM do usuário é obrigatório');
        } else if (usuario.usu_rm.length < 6) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O RM deve ter pelo menos 6 digitos');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            rm: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function checkEmail(email) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
        );
    }

    function validaEmail() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (usuario.usu_email === "") {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O e-mail do usuário é obrigatório');
        } else if (!checkEmail(usuario.usu_email)) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira um e-mail válido');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            email: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;

    }

    function validaSenha() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        // Expressão regular para validar a senha
        const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (usuario.usu_senha === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O preenchimento da senha é obrigatório');
        } else if (!senhaForteRegex.test(usuario.usu_senha)) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Use uma senha forte com pelo menos 8 caracteres, combinando letras, números e símbolos.');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            senha: objTemp // atualiza apenas o campo 'senha'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }


    function validaConfSenha() {

        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (usuario.confSenha === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A confirmação da senha é obrigatória');
        } else if (usuario.confSenha !== usuario.usu_senha) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A senha e a confirmação devem ser iguais');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            confSenha: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaSexo() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };
    
        // Verifica se o sexo não foi selecionado, excluindo 0
        if (usuario.usu_sexo === null || usuario.usu_sexo === undefined || usuario.usu_sexo === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Selecione o sexo do usuário');
        }
    
        setValida(prevState => ({
            ...prevState,
            sexo: objTemp
        }));
    
        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }
    

    async function handleSubmit(event) {
        event.preventDefault();
        let itensValidados = 0;
        
        itensValidados += validaNome();
        itensValidados += validaRM();
        itensValidados += validaEmail();
        itensValidados += validaSelectCursos();
        itensValidados += validaSexo();
        itensValidados += validaSenha();
        itensValidados += validaConfSenha();

        if (itensValidados === 7) {
            try {
                const response = await api.post('/usu_cadastrar', usuario);
                if (response.data.sucesso) {
                    openModalAvisoCad();
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
    console.log(usuario);


    return (
        <div className="containerGlobal">
            <div className={styles.background}>
                <div className={styles.container}>
                    <div className={styles.imgContainer}>
                        <Image
                            src="/imagens_telas/img_cadastro.png"
                            alt="Imagem tela de cadastro"
                            className={styles.imgCadastro}
                            width={500}
                            height={453}
                        />
                    </div>
                    <div className={styles.conteudo}>
                        <h1 className={styles.cadastro}>Cadastro</h1>
                        <form id="form" onSubmit={handleSubmit}>

                            <div className={valida.rm.validado + ' ' + styles.valRM} id="valRM">
                                <div className={styles.divInput}>
                                    <input
                                        type="number"
                                        name="usu_rm"
                                        placeholder="RM"
                                        className={styles.inputField}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.rm.mensagem.map(mens => <small key={mens} id="rm" className={styles.small}>{mens}</small>)
                                }
                            </div>

                            {/* estiliza o campo de acordo com o estado da validação (visual feedback) */}
                            <div className={valida.nome.validado + ' ' + styles.valNome} id="valNome">
                                <div className={styles.divInput}>
                                    <input
                                        type="text"
                                        name="usu_nome"
                                        placeholder="Nome completo"
                                        className={styles.inputField}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.nome.mensagem.map(mens => <small key={mens} id="nome" className={styles.small}>{mens}</small>)
                                }
                            </div>

                            <div className={valida.email.validado + ' ' + styles.valNome} id="valEmail">
                                <div className={styles.divInput}>
                                    <input
                                        type="email"
                                        name="usu_email"
                                        placeholder="E-mail"
                                        className={styles.inputField}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.email.mensagem.map(mens => <small key={mens} id="email" className={styles.small}>{mens}</small>)
                                }
                            </div>

                            <div className={valida.cur_cod.validado + ' ' + styles.valSelectCursos} id="valSelectCursos">
                                <div className={styles.divInput}>
                                    <select id="cur_cod" name="cur_cod" defaultValue={usuario.cur_cod} onChange={handleChange} className={styles.opcao}>
                                        <option value="0" style={{ color: '#999' }}>Sel. Curso Técnico ou Médio</option>
                                        {
                                            cursos.map(cur => (
                                                <option key={cur.cur_cod} value={cur.cur_cod}>{cur.cur_nome}</option>
                                            ))
                                        }
                                    </select>
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.cur_cod.mensagem.map(mens => (
                                        <small key={mens} id="cursos" className={styles.small}>{mens}</small>
                                    ))
                                }

                            </div>

                            <div className={styles.doisItens}>
                                <div className={styles.passwordRow}>
                                    <div className={styles.passwordContainer}>
                                        <div className={valida.senha.validado} id="validaSn1">
                                            <div className={styles.divInput}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="usu_senha"
                                                    placeholder="Senha"
                                                    className={`${styles.inputField} ${styles.senhaField}`}
                                                    onChange={handleChange}
                                                />
                                                <IoCheckmarkCircleOutline className={styles.sucesso} />
                                                <IoAlertCircleOutline className={styles.erro} />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    className={styles.eyeIcon}
                                                >
                                                    {showPassword ? <IoEyeOff /> : <IoEye />}
                                                </span>
                                            </div>
                                            {
                                                valida.senha.mensagem.map(mens => <small key={mens} id="senha" className={styles.small}>{mens}</small>)
                                            }
                                        </div>
                                    </div>


                                    <div className={styles.passwordContainer}>
                                        <div className={valida.confSenha.validado} id="validaSn2">
                                            <div className={styles.divInput}>
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confSenha"
                                                    placeholder="Confirmar senha"
                                                    className={`${styles.inputField} ${styles.senhaField}`}
                                                    onChange={handleChange}
                                                />
                                                <IoCheckmarkCircleOutline className={styles.sucesso} />
                                                <IoAlertCircleOutline className={styles.erro} />
                                                <span
                                                    onClick={toggleConfirmPasswordVisibility}
                                                    className={styles.eyeIcon}
                                                >
                                                    {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                                                </span>
                                            </div>
                                            {
                                                valida.confSenha.mensagem.map(mens => <small key={mens} id="confSenha" className={styles.small}>{mens}</small>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.sexoForm} name="sexo" id="sexo" onChange={handleChange} defaultValue={usuario.usu_sexo}>
                                <div className={valida.sexo.validado + ' ' + styles.valSexo} id="valSexo">
                                    <div className={styles.divRadio}>
                                        <legend>Sexo:</legend>
                                        {[
                                            { label: 'Feminino', value: '0' },
                                            { label: 'Masculino', value: '1' },
                                            { label: 'Neutro', value: '2' },
                                            { label: 'Padrão', value: '3' }
                                        ].map((sexo) => (
                                            <label key={sexo.value} className={styles.buttonRadio}>
                                                <input
                                                    type="radio"
                                                    name="usu_sexo"
                                                    value={sexo.value}
                                                    defaultChecked={usuario.usu_sexo === sexo.value}
                                                />
                                                {sexo.label.charAt(0).toUpperCase() + sexo.label.slice(1)}
                                            </label>
                                        ))}
                                        <IoCheckmarkCircleOutline className={styles.sucesso} />
                                        <IoAlertCircleOutline className={styles.erro} />
                                    </div>
                                    {valida.sexo.mensagem.map((mens) => (
                                        <small key={mens} id="sexo" className={styles.small}>
                                            {mens}
                                        </small>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.logar}>
                                Já tem uma conta? <Link href="/usuarios/login">Faça login</Link>
                            </div>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className={styles.cadastroButton}
                            >
                                Fazer cadastro
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ModalAvisoCadastro
                show={showModalAvisoCad}
                onClose={closeModalAvisoCad}
                onConfirm={handleAvisoCad}
            />
        </div>
    );
}
