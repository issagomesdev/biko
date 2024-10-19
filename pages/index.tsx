import Cookie from 'js-cookie';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';
import { authService } from '../services/authService';
import styles from '../styles/Home.module.css';
import { toast } from 'react-toastify';

export default function HomePage() {
  const router = useRouter();

  const handleLogout = async (event:any) => {
    event.preventDefault();  
    const toast_id = toast.loading('Aguarde...', {
      position: "top-right",
    });

    try {
      const token:any = Cookie.get('token');
      const data = await authService.logout(token);
      
      if (data.success) {
        toast.update(toast_id, {
          render: data.message,
          type: "info",
          isLoading: false,
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        Cookie.remove('token');
        Cookie.remove('user');
      } 
    } catch (error) {
      console.error('Erro ao realizar o login:', error);
    }

    router.push('/');

  }

  return (
    <div className={styles.content}>
      <div className={styles.containerShadow}></div>
      <div className={styles.containerMain}>
        <div className={styles.sidebar}>
          <div className={styles.center}>
            <ul>
              <div className={styles.perfil}>
                <h2><i className={`bi bi-person-circle`}></i></h2>
              </div>
              <hr/>
              <li><i className={`bi bi-search`}></i></li>
              <hr/>
              <li><i className={`bi bi-chat-left`}></i></li>
              <hr/>
              <li><i className={`bi bi-gear`}></i></li>
              <hr/>
              <li><i className={`bi bi-bell-fill`}></i></li>
              <hr/>
              <li><i className={`bi bi-plus-square-dotted`}></i></li>
              <li onClick={handleLogout}> <i className={`bi bi-box-arrow-left`}></i> </li>
            </ul>
          </div>
        </div>
        <div className={styles['escrever_post']}>
          <textarea placeholder="Trabalhando em algo?"></textarea>
        </div>
      </div>
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!isAuthenticated(context.req)) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { }
  };
};