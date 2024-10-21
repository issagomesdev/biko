import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import styles from '../styles/Home.module.css';
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
        console.error('Erro ao realizar o logout:', error);
      }
  
      router.push('/');
  
    }
    return (
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
    );
};
