import Cookie from 'js-cookie';
import React from 'react';
import styles from '../styles/feed.module.css';
import { useState, useEffect } from 'react';
import { Publication } from '../models/Publication';
import { PublicationService } from '../services/publicationService';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

export default function FeedPage() {

    const router = useRouter();
    const [writePost, setWritePost] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newPublication, setNewPublication] = useState({
        title: '',
        text: ''
    });
    const [dataPublications, setDataPublications] = useState<Publication[]>([]);
    const token:any = Cookie.get('token');

    useEffect(() => {

        const getPublications = async () => {
          try {
            const data:any = await PublicationService.getPublications(token);
            setDataPublications(data.data);
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
              Cookie.remove('user');
              router.push('/');
            }
          }
        };
    
        getPublications();
      }, [loading]);

    const publicationChange = (e:any) => {
        const { name, value } = e.target;
        setNewPublication((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };
      
      const publish = async () => {
        
        const toast_id = toast.loading('Publicando, aguarde...', {
            position: "top-right",
        });

        try {
            const data:any = await PublicationService.createPublication(newPublication, token);
            if (data.success) {
              toast.update(toast_id, {
                render: "Anúncio publicado com sucesso!",
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
              setWritePost(false);
              setNewPublication({
                title: '',
                text: ''
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
    
      const cancelPublish = () => {
        setWritePost(false);
        setNewPublication({
          title: '',
          text: ''
        });
      }

      const renderPublications = () => {
        return (
          <div className={styles.publications}>
            {dataPublications.map(publication => {

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
      
              return (
                <div key={publication.id} className={styles.publication}>
                  <div className={styles.publicationContainer}>
                    <div className={styles.header}>
                        <div className={styles.author}>
                            <i className={`bi bi-person-circle`}></i>
                            <h3>{publication.author.name}</h3>
                        </div>
                        <div className={styles.period}>
                            <p>{formatDate(publication.created_at)}</p>
                        </div>
                    </div>
                    <div className={styles.publicationContent}>
                        <h2>{publication.title}</h2>
                        <h4>{publication.text}</h4>
                    </div>
                    <div className={styles.footer}>
                        <div className={styles.item}>
                            <i className={`bi bi-chat-left`}></i>
                            <p>{publication.comments.length} comentários</p>
                        </div>
                        <div className={styles.item}>
                            <i className={`bi bi-hand-thumbs-up`}></i>
                            <p>{publication.likes.length} curtidas</p>
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      };

    return (
        <div className={styles.feedContainer}>
            <div className={styles.writePost}>
                <div className={styles.textarea}>
                    <input type="text" id="title" name="title" placeholder="Crie um título" onChange={publicationChange} style={!writePost ? { display: 'none' } : {}} value={newPublication.title}/>
                    <textarea id="text" name="text" placeholder="Quer anunciar algo?" style={writePost ? { height: '200px' } : {}} onFocus={() => { setWritePost(true)}} onChange={publicationChange} value={newPublication.text}></textarea>
                    <div className={styles.shortcuts} style={!writePost ? { display: 'none' } : {}}>
                        <div className={styles.item}>
                            <i className={`bi bi-image`}></i>
                            <p>Anexar Mídia</p>
                        </div>
                    </div>
                </div>
                <div className={styles.publish}>
                    <button onClick={publish} style={newPublication.title.length < 1 || newPublication.text.length < 1 ? { display: 'none' } : {}}>Postar</button>
                    <button onClick={cancelPublish} id="cancel" style={!writePost ? { display: 'none' } : {}}>Cancelar</button>
                </div>
            </div> 
                <div className={styles.feedContent}>
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
                        renderPublications()
                    }
                </div>
        </div>
    );
};