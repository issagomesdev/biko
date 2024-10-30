import Cookie from 'js-cookie';
import React from 'react';
import styles from '../styles/feed.module.css';
import { useState, useEffect } from 'react';
import { Publication, newPublication, filterPublication } from '../models/Publication';
import { PublicationService } from '../services/publicationService';
import { IBGEService } from '../services/ibgeService';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { User } from '../models/User';
import { UserService } from '../services/userService';
import { Category } from '../models/Category';
import { CategoryService } from '../services/categoryService';
import { State } from '../models/State';
import { City } from '../models/City';

interface MultilineTextProps {
  text: string;
}

export default function FeedPage() {

  const router = useRouter();
  const [writePost, setWritePost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPublication, setNewPublication] = useState<newPublication>({
    title: '',
    text: '',
    type: 0,
    categories: []
  });
  const [filter, setFilter] = useState<filterPublication>({
    search: '',
    type: '',
    categories: [],
    orderBy: 'desc',
    state: '',
    city: '',
    neighborhood: ''
  })
  const [dataPublications, setDataPublications] = useState<Publication[]>([]);
  const token:string|undefined = Cookie.get('token');
  const [user, setUser] = useState<User>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategories, setOpenCategories] = useState(false);
  const [openCategoriesFilter, setOpenCategoriesFilter] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
      const getUser = async () => {
        try {
          const data:any = await UserService.getAuthUser(token ?? '');
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

      const loadCategories = async() => {
        const data = await CategoryService.getCategories();
        setCategories(data);
      }

      const loadStates = async() => {
        const data = await IBGEService.getStates();
        setStates(data);
      }

      getUser();
      loadCategories();
      loadStates();
  }, []);

  useEffect(() => {
      const getPublications = async () => {
        try {
          const data:any = await PublicationService.getPublications(filter, token ?? '');
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

  const FilterChange = (e:any) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
};

const handleStateChange = async(e:any) => {
  setFilter((prevState) => ({
    ...prevState,
    state: e.target.value,
    city: ''
  }));
  const data = await IBGEService.getCities(e.target.value);
  setCities(data);
}

  const handleChangeCategories = async(categoryID:number) => {
    const exist = newPublication.categories.includes(categoryID);
    setNewPublication((prevState) => ({
      ...prevState,
      categories: exist
        ? prevState.categories.filter((id) => id !== categoryID)
        : [...prevState.categories, categoryID]
    }));
  }

  const handleChangeCategoriesFilter = async(categoryID:number) => {
    const exist = filter.categories.includes(categoryID);
    setFilter((prevState) => ({
      ...prevState,
      categories: exist
        ? prevState.categories.filter((id) => id !== categoryID)
        : [...prevState.categories, categoryID]
    }));
  }
      
  const publish = async () => {
      const toast_id = toast.loading('Publicando, aguarde...', {
          position: "top-right",
      });
      try {
          const data:any = await PublicationService.createPublication(newPublication, token ?? '');
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
            setOpenCategories(false);
            setWritePost(false);
            setNewPublication({
              title: '',
              text: '',
              type: 0,
              categories: []
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

  const MultilineText: React.FC<MultilineTextProps> = ({text}) => (
    <p>
      {text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </p>
  );

  const checkRequerimentsPublish = () => {
    if(newPublication.title.trim().length < 1){
      toast.error('Dê um título a postagem', {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      return;
    }

    if(newPublication.text.trim().length < 1){
      toast.error('Escreva um texto para a postagem', {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      return;
    }

    if(newPublication.categories.length < 1){
      toast.error('Escolha pelo menos uma categoria para a postagem', {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      return;
    }

    publish();
  }
    
  const cancelPublish = () => {
    setWritePost(false);
    setOpenCategories(false);
    setNewPublication({
      title: '',
      text: '',
      type: 0,
      categories: []
    });
  }

  const filterPublications = () => {
    setOpenCategoriesFilter(false)
    setLoading(true);
  }

  const updateLike = (pubID: number) => {
    setDataPublications(prevData =>
      prevData.map(pub =>
        pub.id === pubID
          ? {
              ...pub,
              likes: [
                ...pub.likes,
                {
                  id: 435,
                  user_id: 5,
                  publication_id: 68,
                  created_at: "2024-09-22T21:28:17.000000Z",
                  updated_at: "2024-09-22T21:28:17.000000Z"
                }
              ]
            }
          : pub
      )
    );
  };
  
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
                          <span>{publication.type === 0? 'cliente' : 'prestador de serviços'}</span>
                      </div>
                      <div className={styles.period}>
                          <p>{formatDate(publication.created_at)}</p>
                      </div>
                  </div>
                  <div className={styles.publicationContent}>
                      <h2>{publication.title}</h2>
                      <MultilineText text={publication.text} />
                  </div>
                  <div className={styles.tags}>
                    {publication.categories.map((category) => (
                      <p key={category.id}>{category.name}</p>
                    ))}
                  </div>
                  <div className={styles.footer}>
                      <div className={styles.item}>
                          <i className={`bi bi-chat-left`}></i>
                          <p>{publication.comments.length} comentários</p>
                      </div>
                      <div className={styles.item}>
                          <i className={`bi bi-hand-thumbs-up`} onClick={() => updateLike(publication.id)}></i>
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
 
  const renderWritePost = () => {
    return (
      <div className={styles.writePost}>
        <div className={styles.textarea}>
            <input type="text" id="title" name="title" placeholder="Crie um título" onChange={publicationChange} style={!writePost ? { display: 'none' } : {}} value={newPublication.title}/>
            <textarea id="text" name="text" placeholder="Quer anunciar algo?" style={writePost ? { height: '200px' } : {}} onFocus={() => { setWritePost(true)}} onChange={publicationChange} value={newPublication.text}></textarea>
            <div className={styles.shortcuts} style={!writePost ? { display: 'none' } : {}}>
                <div className={styles.attach}>
                    <i className={`bi bi-image`}></i>
                    <p>Anexar Mídia</p>
                </div>
                <div className={styles.customField}>
                  <div className={styles.selectContainer}>
                    <p>Anunciar como: </p>
                    <select name="type" id="type" value={newPublication.type} onChange={publicationChange}>
                      <option value="0">Cliente</option>
                      <option value="1">Prestador</option>
                    </select>
                  </div>
                </div>
                <div className={styles.customField}>
                  <div className={styles.selectContainer} onClick={() => setOpenCategories(openCategories? false : true)}>
                    <p>Escolha uma ou mais categorias relacionadas ao anúncio <span>{newPublication.categories.length}</span></p>
                    <i className={openCategories? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i>
                  </div>
                  {openCategories? <div className={styles.categoriesContent}>
                  <p onClick={() => setNewPublication((prevState) => ({...prevState, categories: []}))}>Limpar seleção</p>
                  <div className={styles.categories}>
                    {categories.map((category) => (
                        <div key={category.id} className={styles.category} onClick={() => handleChangeCategories(category.id)}>
                          <div className={styles.checkbox}>
                            <div className={styles.box}>
                              <i className={newPublication.categories.includes(category.id)? "bi bi-check" : ""}></i>
                            </div>
                          </div>
                          <p>{category.name}</p>
                        </div>
                      ))}
                  </div>
                  </div> : ''}
                </div>
            </div>
        </div>
        <div className={styles.publish}>
            <button onClick={checkRequerimentsPublish} style={!writePost ? { display: 'none' } : {}}>Postar</button>
            <button onClick={cancelPublish} id="cancel" style={!writePost ? { display: 'none' } : {}}>Cancelar</button>
        </div>
      </div> 
    );
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <h1>Publicações</h1>
        
        <div className={styles.search}>
          <div className={styles.customField}>
            <div className={styles.selectContainer}>
            <i className={"bi bi-search"}></i>
              <input type="search" name="search" id="search" placeholder='pesquisar...' onChange={FilterChange}/>
            </div>
          </div>

          <button onClick={filterPublications}>Buscar</button>
        </div>

        <div className={styles.filters}>
          <div className={styles.customField}>
            <div className={styles.selectContainer}>
              <p>Filtrar postagens por: </p>
              <select name="type" id="type" value={filter.type} onChange={FilterChange}>
                <option value="">todos</option>
                <option value="0">Cliente</option>
                <option value="1">Prestador</option>
              </select>
            </div>
          </div>

          <div className={styles.customField}>
            <div className={styles.selectContainer} onClick={() => setOpenCategoriesFilter(openCategoriesFilter? false : true)}>
              <p>Categorias relacionadas as postagens <span>{filter.categories.length > 0 ? filter.categories.length : 'todas'}</span></p>
              <i className={openCategoriesFilter? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i>
            </div>
            {openCategoriesFilter? <div className={styles.categoriesContent}>
            <div className={styles.categories}>
                  <div className={styles.category} onClick={() => setFilter((prevState) => ({...prevState, categories: []}))}>
                    <div className={styles.checkbox}>
                      <div className={styles.box}>
                        <i className={filter.categories.length < 1? "bi bi-check" : ""}></i>
                      </div>
                    </div>
                    <p>Todas</p>
                  </div>
              {categories.map((category) => (
                  <div key={category.id} className={styles.category} onClick={() => handleChangeCategoriesFilter(category.id)}>
                    <div className={styles.checkbox}>
                      <div className={styles.box}>
                        <i className={filter.categories.includes(category.id)? "bi bi-check" : ""}></i>
                      </div>
                    </div>
                    <p>{category.name}</p>
                  </div>
                ))}
            </div>
            </div> : ''}
          </div>
          
          <div className={styles.customField}>
            <div className={styles.selectContainer}>
              <p>Filtrar por local: </p>
              <select name="state" id="state" value={filter.state} onChange={handleStateChange}>
                <option selected value=''>Selecione estado</option>
                {states.map((state) => (
                    <option key={state.id} value={state.id}> {state.nome} </option>
                ))}
              </select>
              <select name="city" id="city" value={filter.city} onChange={FilterChange}>
                <option selected value=''>Selecione cidade</option>
                {cities.map((city) => (
                    <option key={city.id} value={city.id}> {city.nome} </option>
                ))}
              </select>
              <input type="text" name="neighborhood" id="neighborhood" placeholder='digite um bairro...' onChange={FilterChange}/>
            </div>
          </div>

          <div className={styles.customField}>
            <div className={styles.selectContainer}>
              <p>Ordenar por: </p>
              <select name="orderBy" id="orderBy" value={filter.orderBy} onChange={FilterChange}>
                <option value="desc">mais recente</option>
                <option value="asc">mais antigo</option>
                <option value="popular">em destaque</option>
              </select>
            </div>
          </div>
        </div>
      </div> 
    );
  }

  return (
      <div className={styles.feedContainer}>
          {renderWritePost()}
          {renderHeader()}
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