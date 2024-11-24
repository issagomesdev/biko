import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import styles from '../styles/home.module.css';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';

export default function Sidebar() {
    const router = useRouter();
    const handleLogout = async (event:any) => {
      event.preventDefault();  
      const toast_id = toast.loading('Aguarde...', {
        position: "top-right",
      });
      try {
        const token:string|undefined = Cookie.get('token');
        const data = await authService.logout(token ?? '');
        
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
        } 
      } catch (error) {
        console.error('Erro ao realizar o logout:', error);
      }
  
      router.push('/');
  
    }

    const goRoute = (route:string) => {
      router.push(route);
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.center}>
              <ul>
                <div className={styles.perfil}>
                  <h2><i className={`bi bi-person-circle`}></i></h2>
                </div>
                <li className={router.pathname === '/' ? styles.active : ''} onClick={() => goRoute('/')}> <i className={`bi bi-house-door`}></i> </li>
                <li className={router.pathname === '/edit-perfil' ? styles.active : ''} onClick={() => goRoute('/edit-perfil')}><i className={`bi bi-person-fill-gear`} onClick={() => goRoute('/edit-perfil')}></i></li>
                <li className={router.pathname === '/search' ? styles.active : ''} onClick={() => goRoute('/search')}><i className={`bi bi-search`}></i></li>
                <li><i className={`bi bi-chat-left`}></i></li>
                <li><i className={`bi bi-bell-fill`}></i></li>
                <li onClick={handleLogout}><i className={`bi bi-box-arrow-left`}></i></li>
              </ul>
            </div>
        </div>
    );
};
