import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/authService';
import { isAuthenticated } from '../utils/auth';
import { toast } from 'react-toastify';
import styles from '../styles/Register.module.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    categories: []
  });
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const toast_id = toast.loading('Aguarde...', {
      position: "top-right",
    });
    try {
      const data = await authService.register(formData);
      if (data.success) {
        toast.update(toast_id, {
          render: data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          router.push('/login');
        }, 500);
      } else {

        const erros: string[] = data.data; 

        toast.update(toast_id, {
          render: data.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        erros.forEach((error) => {
            toast.error(error, {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
        });
      }
    } catch (error:any) {
      console.error('Erro ao realizar o cadastro:', error);
    }
  };

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={styles.content}>
      <div className={styles.mainScreen}>
        <div className={styles.leftScreen}>
            <img src="/midia/icon-biko-removebg-preview.png" alt=""/>
            <h1>Junte-se <br/>
                a Biko!</h1>
        </div>
        <div className={styles.rightScreen}>
            <div className={styles.cardLogin}>
                <h1>BIKO</h1>
                <form onSubmit={handleRegister} className={styles.form}>
                    <div className={styles.textfield}>
                        <input type="text" id="name" name="name" placeholder="Digite seu nome completo" value={formData.name} onChange={handleChange} required/>
                    </div>
                    <div className={styles.textfield}>
                        <input type="email" id="email" name="email" placeholder="Digite seu Email" value={formData.email} onChange={handleChange} required/>
                    </div>
                    <div className={styles.textfield}>
                        <input type="password" id="password" name="password" placeholder="Digite sua senha" value={formData.password} onChange={handleChange} required/>
                    </div>
                    <div className={styles.textfield}>
                        <input type="text" id="cpf" name="cpf" placeholder="Digite seu CPF" value={formData.cpf} onChange={handleChange} required/>
                    </div>
                    <div className={styles.checkbox}>
                        <input type="checkbox" name="termos" id="termos" required/>
                        Aceito os <span>Termos e Serviços</span>
                    </div>
                    <button type="submit" className={styles.btnLogin}>Login</button>
                </form>
                <p><Link href="./login">Já tenho uma conta</Link></p>
            </div>
            <div className={styles.cardShadow}>.</div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (isAuthenticated(context.req)) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    
    return {
        props: {},
    };
  };
