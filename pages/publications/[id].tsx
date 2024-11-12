import Cookie from 'js-cookie';
import React from 'react';
import feed from '../../styles/feed.module.css';
import { useState, useEffect } from 'react';
import { Publication } from '../../models/Publication';
import { PublicationService } from '../../services/publicationService';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { User } from '../../models/User';
import { UserService } from '../../services/userService';
import Options from './../../components/ultils/Options';
import ModalConfirm from "./../../components/ultils/ModalConfirm";
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/home.module.css';


interface PageProps {
    id: number;
}

export default function PublicationPage() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const token:string|undefined = Cookie.get('token');
    const [user, setUser] = useState<User>();
    const [modalProps, setModalProps] = useState({
        open: false,
        onClose: () => setModalProps((prev) => ({ ...prev, open: false })),
        onConfirm: () => {},
        title: '',
        message: ''
    });
    const [publication, setPublication] = useState<Publication>({
        id: 0,
        title: '',
        text: '',
        type: 0,
        author: {
            id: 0,
            name: '',
            email: '',
            cpf: '',
            state: '',
            city: '',
            neighborhood: '',
            categories: [],
            created_at: '',
            updated_at: ''
        },
        categories: [],
        comments: [],
        comments_count: 0,
        likes: [],
        likes_count: 0,
        created_at: '',
        updated_at: ''
    });

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

    const getPublication = async () => {
        try {
            const data:any = await PublicationService.getPublication(id, token);
            setPublication(data.data);
            setLoading(false);
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
    };

    useEffect(() => {
        getPublication();
    }, [id]);
    
    getUser();
    
    const openModal = (title: string, message: string, onConfirm: () => void) => {
        setModalProps((prev) => ({
        ...prev,
        open: true,
        onConfirm,
        title,
        message,
        }));
    };

    const deletePublication = async() => {
        setModalProps((prev) => ({ ...prev, open: false }))
        const toast_id = toast.loading('Excluindo, aguarde...', {
        position: "top-right",
        });
        
        try {
            const data:any = await PublicationService.deletePublication(publication.id, token);
            if (data.success) {
                toast.update(toast_id, {
                render: "Publicação excluida com sucesso!",
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
            setLoading(true);
        } catch (error) {
            console.error('Erro ao publicar o anúncio:', error);
        } 
    }

    const updateLike = async () => {
        try {
        setPublication(() => {
            const hasLiked = publication.likes.some(like => like.user_id === user?.id);
            return {
                ...publication,
                likes: hasLiked
                    ? publication.likes.filter(like => like.user_id !== user?.id)
                    : [...publication.likes, { id: Date.now(), user_id: user?.id, publication_id: publication.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }] 
            };
        });

        const data: any = await PublicationService.likePublication(publication.id, token);
        if (!data.success)  throw new Error('Erro ao atualizar like');
        } catch (error: any) {
            if (error.status === 401) {
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
    };

    const formatDate = (value:string) => {
        const publicationDate = new Date(value);
        const now = new Date();
        const diffInMs = now.getTime() - publicationDate.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
    
        if (diffInMinutes < 60) {
        return `${diffInMinutes} minutos atrás`;
        } else if (diffInHours < 24) {
        return `${diffInHours} horas atrás`;
        } else {
        return publicationDate.toLocaleDateString('pt-BR');
        }
    };

    const renderPublication = () => {
        return (
            <div key={publication.id} className={feed.publication}>
                <div className={feed.publicationContainer}>
                    <div className={feed.header}>
                        <div className={feed.author}>
                            <i className={`bi bi-person-circle`}></i>
                            <h3>{publication.author.name}</h3>
                            <span>{publication.type === 0? 'cliente' : 'prestador de serviços'}</span>
                        </div>
                        <div className={feed.corner}>
                            <p>{formatDate(publication.created_at)}</p>
                            {publication.author.id === user?.id ?<Options 
                                trigger={<i className={"bi bi-three-dots-vertical"}></i>}
                                items={[{ label: 'Excluir Publicação', onClick: () => openModal('Confirmação de Exclusão', 'Você está prestes a excluir esta publicação. Essa ação é irreversível. Tem certeza de que deseja continuar?', () => { deletePublication() }) }]}/> : ''}
                        </div>
                    </div>
                    <div className={feed.publicationContent}>
                        <h2>{publication.title}</h2>
                        <p> {publication.text.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                {line}
                                <br />
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                    <div className={feed.tags}>
                        {publication.categories.map((category) => (
                        <p key={category.id}>{category.name}</p>
                        ))}
                    </div>
                    <div className={feed.footer}>
                        <div className={feed.items}>
                            <div className={feed.item}>
                                <i className={`bi bi-chat-left`}></i>
                                <p>{publication.comments.length} comentários</p>
                            </div>
                            <div className={feed.item}>
                                <i className={`bi bi-hand-thumbs-up${user && publication.likes.find(like => like.user_id == user.id) ? '-fill' : ''}`} onClick={() => updateLike()}></i>
                                <p>{publication.likes.length} curtidas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

  return (
        <div className={styles.container}>
        <div className={styles.boxShadow}></div>
        <div className={styles.boxContent}>
            <div className={styles.content}>
            <Sidebar/>
            <div className={styles.screen}>
                <ModalConfirm
                isOpen={modalProps.open}
                onClose={modalProps.onClose}
                onConfirm={modalProps.onConfirm}
                title={modalProps.title}
                message={modalProps.message}
                />
                { loading? 
                  <TailSpin
                  visible={true}
                  height="150"
                  width="150"
                  color="var(--secondary-bg-color)"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""/>  : 
                  renderPublication()
              }
                
            </div>
            </div>
        </div>
        </div>
  );
};