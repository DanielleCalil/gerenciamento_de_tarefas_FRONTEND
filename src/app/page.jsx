import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';

export default function SobreNos() {
  return (
    <div className="containerGlobal">
      <div className={styles.background}>
        <div className={styles.transparencia}>
          <div className={styles.conteudo}>
            <div className={styles.card}>
              <div className={styles.header}>
                <Link href="/" className={styles.titulo}>
                  <h1>Tarefas</h1>
                </Link>
                <p>Danikawari é a junsão dos nomes das três ingrantes que unidas pelo interesse comum em desenvolver e pela T.I.,
                  criaram a SmoakBook, um aplicativo que visa favorecer alunos e professores em prol da educação, atualizando o
                  sistema de bibliotecas, visualmente mais atrativo e sendo mais prático à todos.
                </p>
              </div>
              <div className={styles.membrosContainer}>
                <div className={styles.membros}>
                  <Image
                    src="/imagens_telas/avatarDani.jpeg"
                    alt="Avatar Danielle"
                    className={styles.imagemFlutuante}
                    width={1024}
                    height={1024}
                  />
                  <text className={styles.nome}>Danielle: </text><text>é formada como técnica em farmácia, uma área na qual ela
                    atuava anteriormente. No entanto, sua paixão pelo aprendizado e pela tecnologia a levou a se aventurar no
                    mundo do desenvolvimento. Ela se desafiou no front-end e foi a responsável por toda a parte visual do projeto,
                    mas tem bastante interesse no back-end.</text>
                </div>

                <div className={styles.membros}>
                  <Image
                    src="/imagens_telas/avatarKawany.jpeg"
                    alt="Avatar Kawany"
                    className={styles.imagemFlutuante}
                    width={1024}
                    height={1024}
                  />
                  <text className={styles.nome}>Kawany: </text><text>ela sempre teve uma afinidade pelas questões jurídicas, entretanto permitiu-se verificar se era realmente isso
                    que ela queria para a vida dela, ingressando na área de T.I. e conforme o decorrer das aulas, foi se interessando
                    pelo banco de dados e pela segurança de dados.
                  </text>
                </div>

                <div className={styles.membros}>
                  <Image
                    src="/imagens_telas/avatarKian.jpeg"
                    alt="Avatar Dylan"
                    className={styles.imagemFlutuante}
                    width={1024}
                    height={1024}
                  />
                  <text className={styles.nome}>Dylan: </text><text>Formado em design gráfico pela Univem em Marilía, mas decidiu se aprofundar na
                    área do desenvolvimento para conciliar os seus conhecimentos. Como já tinha conhecimento no front, ele resolveu se
                    desafiar no banco de dados e API, mas nunca abandonou o lado criativo.
                  </text>
                </div>
              </div>
              <div className={styles.suporte}>
                <text>Entre em contato:  </text>
                <Link href="mailto:danikawari@gmail.com" className={styles.email}>
                  danikawari@gmail.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}