import Cookie from 'js-cookie';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/authService';
import { isAuthenticated } from '../utils/auth';
import { toast } from 'react-toastify';
import styles from '../styles/Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const toast_id = toast.loading('Aguarde...', {
      position: "top-right",
    });
    try {
      const data = await authService.login(email, password);

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
        Cookie.set('token', data.data.token);
        Cookie.set('user', JSON.stringify(data.data.data));
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
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
      }
    } catch (error:any) {
      console.error('Erro ao realizar o login:', error);
    }
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
                <form onSubmit={handleLogin}>
                    <div className={styles.textfield}>
                        <input type="email" id="email" placeholder="Digite seu Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className={styles.textfield}>
                        <input type="password" id="password" placeholder="Digite sua Senha" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <button type="submit" className={styles.btnLogin}>Login</button>
                </form>
                <p><a href="/register">Não possuo uma conta</a></p>
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
