import styles from '../styles/home.module.css';
import Sidebar from '../components/Sidebar';
import chat from '../styles/chat.module.css';
import { useState, useEffect } from 'react';
import { User } from '../models/User';
import { ChatItem } from '../models/Chat';
import { useRouter } from 'next/router';
import { UserService } from '../services/userService';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';

export default function Chat() { 
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const token:string|undefined = Cookie.get('token');
    const [chatList, setChatList] = useState<ChatItem[]>([
      {
        id: 1,
        name: 'Wade Parker Mason',
        online: true,
        last_time: 'is online',
        messages: 205232
      },
      {
        id: 2,
        name: 'Nollan Beaumont',
        online: true,
        last_time: 'is online',
        messages: 154694
      },
      {
        id: 3,
        name: 'Lucas Descott',
        online: false,
        last_time: 'left 2 mins ago',
        messages: 151456
      },
      {
        id: 4,
        name: 'Gotham Novasc',
        online: false,
        last_time: 'left 11 mins ago',
        messages: 165093
      },
    ]);
    const [chatSelected, setChatSelected] = useState<ChatItem>({
      id: 1,
      name: 'Wade Parker Mason',
      online: true,
      last_time: 'is online',
      messages: 205232
    });
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
                <h1>Suas Conversas</h1>
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
                    <div className={chat.list}>
                      <div className={chat.search}>
                        <input type="search" placeholder='pesquise...'/>
                      </div>
                      <div className={chat.chats}>
                      {chatList.map((data:ChatItem) => {
                            return <div key={data.id} onClick={() => setChatSelected(data)} className={`${chat.item} ${chatSelected?.id == data.id? chat.selected : ''} ${data.online? chat.on : ''}`}>
                                <div className={chat.icon}>
                                  <i className={`bi bi-person-circle`}></i>
                                </div>
                                <div className={chat.info}>
                                  <h3>{data.name}</h3>
                                  <p>{data.last_time}</p>
                                </div>
                            </div>
                        })}
                      </div>
                    </div>
                    <div className={chat.chat}>
                      <div className={`${chat.header} ${chatSelected.online? chat.on : ''}`}>
                        <div className={chat.icon}>
                          <i className={`bi bi-person-circle`}></i>
                        </div>
                        <div className={chat.infos}>
                          <h2>{chatSelected.name}</h2>
                          <p>{chatSelected.messages} Messages</p>
                        </div>
                      </div>
                        
                    </div>
                </div> 
                }
                
            </div>
            </div>
        </div>
        </div>
    )
}