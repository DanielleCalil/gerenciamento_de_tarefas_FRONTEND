"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { IoSearchOutline } from "react-icons/io5";
import { IoEye, IoEyeOff } from "react-icons/io5";

// import api from '../../../services/api';
import styles from './page.module.css';

export default function Login() {
    const router = useRouter();

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const valDefault = styles.formControl;
    const valSucesso = styles.formControl + ' ' + styles.success;
    const valErro = styles.formControl + ' ' + styles.error;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    function handleSubmit(event) {
        event.preventDefault();
        const validLogin = validaLogin();
        const validSenha = validaSenha();

        if (validLogin || validSenha) {
            logar();
        }
    }

    async function logar() {
        try {
            const dados = {
                usu_email_rm: login,
                usu_senha: senha,
            };
    
            const response = await api.post('/usu_login', dados);
    
            if (response.data.sucesso === true) {
                const usuario = response.data.dados;
    
                // **Validação de usu_tipo**
                if (usuario.usu_tipo !== 2 && usuario.usu_tipo !== 3) {
                    // Usuário com tipo inválido
                    alert('Acesso negado: Este usuário não tem permissão para acessar o sistema.');
                    return; // Interrompe o processo de login
                }
    
                // **Se for um usuário válido, continua o login**
                const objLogado = {
                    cod: usuario.usu_cod,
                    nome: usuario.usu_nome,
                    acesso: usuario.usu_tipo,
                    curso: usuario.cur_cod,
                };
                console.log(objLogado);
    
                // Salva os dados no localStorage
                localStorage.clear();
                localStorage.setItem('user', JSON.stringify(objLogado));
    
                // Redireciona para a página inicial
                router.push('/');
            } else {
                alert('Erro: ' + response.data.mensagem + '\n' + response.data.dados);
            }
        } catch (error) {
            if (error.response) {
                alert(
                    error.response.data.dados == null
                        ? error.response.data.mensagem
                        : error.response.data.mensagem + '\n' + error.response.data.dados
                );
            } else {
                alert('Erro no front-end' + '\n' + error);
            }
        }
    }
    

    // validação
    const [valida, setValida] = useState({
        login: {
            validado: valDefault,
            mensagem: []
        },
        senha: {
            validado: valDefault,
            mensagem: []
        },
    });

    function validaLogin() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (login === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Preencha o campo com RM ou E-mail');
        } else if (login.length < 6) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Informação inválida');
        }

        setValida(prevState => ({
            ...prevState,
            login: objTemp
        }));

        return objTemp.mensagem.length === 0;
    }

    function validaSenha() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (senha === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Preencha o campo senha');
        } else if (senha.length < 6) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Número de caracteres inválido');
        }

        setValida(prevState => ({
            ...prevState,
            senha: objTemp
        }));

        return objTemp.mensagem.length === 0;
    }

    return (
        <div className="containerGlobal">
            <div className={styles.background}>
                <div className={styles.container}>
                    <div className={styles.imgContainer}>
                        <Image
                            src="/imagens_telas/6737457.png"
                            alt="Imagem tela de login"
                            className={styles.imgLogin}
                            width={500}
                            height={500}
                        />
                    </div>
                    <form id="form" className={styles.conteudo} onSubmit={handleSubmit}>
                        <h1 className={styles.login}>Login</h1>
                        <input
                            type="text"
                            placeholder="RM ou E-mail"
                            className={`${styles.inputField} ${valida.login.validado}`}
                            onChange={v => setLogin(v.target.value)} //v: evento de mudança
                            value={login}
                        />
                        {valida.login.mensagem.length > 0 && (
                            <span className={styles.errorMessage}>{valida.login.mensagem[0]}</span>
                        )}
                        <div className={styles.passwordContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Senha"
                                className={`${styles.inputField} ${valida.senha.validado}`}
                                onChange={v => setSenha(v.target.value)}
                                value={senha}
                            />
                            <span
                                onClick={togglePasswordVisibility}
                                className={styles.eyeIcon}
                            >
                                {showPassword ? <IoEyeOff /> : <IoEye />}
                            </span>
                        </div>
                        {valida.senha.mensagem.length > 0 && (
                            <span className={styles.errorMessage}>{valida.senha.mensagem[0]}</span>
                        )}
                        <div className={styles.cadastre}>
                            Não tem cadastro? <Link href="/usuarios/signUp">Cadastre-se</Link>
                        </div>
                        <div className={styles.esqueceuSenha}>
                            <Link href="/usuarios/esqueceuSenha1">Esqueceu a senha?</Link>
                        </div>
                        <button type="submit" className={styles.loginButton}>Fazer login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
