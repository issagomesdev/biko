import styles from '../styles/home.module.css';
import Sidebar from '../components/Sidebar';
import chat from '../styles/chat.module.css';
import { useState, useEffect } from 'react';
import { User } from '../models/User';
import { useRouter } from 'next/router';
import { UserService } from '../services/userService';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';

export default function Notifications() { 
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const token:string|undefined = Cookie.get('token');

    useEffect(() => {
        const getUser = async () => {
          try {
            const data:any = await UserService.getAuthUser(token);
            setUser(data);
          } catch (error:any) {
            if(error.status == 401){ 
              console.error('Erro:', error);
              toast.info("Desconectado", {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              Cookie.remove('token');
              router.push('/');
            }
          }
        }
    
        getUser();
        if(user) setLoading(false);
      }, [user]);

    return (
        <div className={styles.container}>
        <div className={styles.boxShadow}></div>
        <div className={styles.boxContent}>
            <div className={styles.content}>
            <Sidebar/>
            <div className={chat.container}>
                <h1>Suas Notificações</h1>
                { loading? 
                <div className={chat.content}>
                    <TailSpin
                    visible={true}
                    height="150"
                    width="150"
                    color="var(--secondary-bg-color)"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""/>
                </div> : 
                <div className={chat.content}>
                    
                </div> 
                }
                
            </div>
            </div>
        </div>
        </div>
    )
}