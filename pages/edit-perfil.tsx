import styles from '../styles/home.module.css';
import Sidebar from '../components/Sidebar';
import cselector from '../styles/ultils/categorySelector.module.css';
import perfil from '../styles/perfil.module.css';
import { Category } from '../models/Category';
import { useState, useEffect } from 'react';
import { State } from '../models/State';
import { City } from '../models/City';
import { CategoryService } from '../services/categoryService';
import { IBGEService } from '../services/ibgeService';
import { FormUser } from '../models/User';
import { useRouter } from 'next/router';
import { UserService } from '../services/userService';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';

export default function EditPerfil() {
  const [openCategories, setOpenCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const token:string|undefined = Cookie.get('token');
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [userID, setUserID] = useState<number>();
  const [user, setUser] = useState<FormUser>({
    name: '',
    email: '',
    password: '',
    cpf: '',
    state: '',
    city: '',
    neighborhood: '',
    categories: []
  });

  const handleChangeCategories = async(categoryID:number) => {
    const exist = user.categories.includes(categoryID);
    setUser((prevState:any) => ({
      ...prevState,
      categories: exist
        ? prevState.categories.filter((id:Number) => id !== categoryID)
        : [...prevState.categories, categoryID]
    }));
  }

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStateChange = async(e:any) => {
    setUser((prevState:any) => ({
      ...prevState,
      state: e.target.value,
      city: ''
    }));
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const toast_id = toast.loading('Aguarde...', {
      position: "top-right",
    });
    try {
      const data = await UserService.UpdateAuthUser(userID, user, token);
      if (data.success) {
        toast.update(toast_id, {
          render: "Perfil atualizado com sucesso!",
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
        router.push('/login');
      }
    } catch (error:any) {
      const data = await error.data;
      console.error('Erro ao realizar o cadastro:', data);
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

      const erros: string[] = data.data; 
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
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const data:any = await UserService.getAuthUser(token);
        setUserID(data.id);
        setUser(() => ({
            ...data,
            categories: data.categories.map((i:Category) => i.id),
          }));
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
    setLoading(false);
  }, []);


  useEffect(() => {
    const loadCities = async(id:string) => {
        const data = await IBGEService.getCities(id);
        setCities(data);
    }

    const index = states.findIndex(i => i.nome == user.state);
    if(index > -1) loadCities((states[index].id).toString());

  }, [user.state])

    return (
        <div className={styles.container}>
          <div className={styles.boxShadow}></div>
          <div className={styles.boxContent}>
            <div className={styles.content}>
              <Sidebar/>
              <div className={perfil.container}>
                <h1>Editar Perfil</h1>
                <div className={perfil.content}>
                  { loading? 
                    <TailSpin
                    visible={true}
                    height="150"
                    width="150"
                    color="var(--secondary-bg-color)"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""/> : 
                    
                    <form onSubmit={handleSubmit} className={perfil.form}>  
                        <div className={perfil.fieldsGroup}>
                            <div className={perfil.textfield}>
                                <label htmlFor="name">Nome completo</label>
                                <input type="text" id="name" name="name" placeholder="Nome completo" value={user.name} onChange={handleChange} required/>
                            </div>
            
                            <div className={perfil.textfield}>
                             <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required/>
                            </div>
        
                            <div className={perfil.textfield}>
                                <label htmlFor="password">Nova Senha</label>
                                <input type="password" id="password" name="password" placeholder="Nova Senha" onChange={handleChange}/>
                            </div>

                            <div className={perfil.textfield}>
                                <label htmlFor="cpf">CPF</label>
                                <input type="text" id="cpf" name="cpf" placeholder="CPF" value={user.cpf} onChange= {handleChange} required/>
                            </div>

                            <div className={perfil.textfieldPair}>
                                <div className={perfil.textfield}>
                                    <label htmlFor="state">Estado</label>
                                    <select name="state" id="state" value={user.state} onChange={handleStateChange}>
                                    <option selected value=''>Selecione estado </option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.nome}> {state.nome} </option>
                                    ))}
                                    </select>
                                </div>
                                    
                                <div className={perfil.textfield}>
                                    <label htmlFor="city">Cidade</label>
                                    <select name="city" id="city" value={user.city} onChange={handleChange}>
                                    <option selected value=''>Selecione cidade </option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.nome}> {city.nome} </option>
                                    ))}
                                    </select>
                                </div> 
                            </div> 

                            <div className={perfil.textfield}>
                                <label htmlFor="neighborhood">Bairro</label>
                                <input type="text" id="neighborhood" name="neighborhood" placeholder="Bairro" value={user.neighborhood}onChange={handleChange} required/>
                            </div>

                            <div className={perfil.categoriesContainer}>
                                <div className={perfil.openCategories} onClick={() => setOpenCategories(openCategories? false : true)}>
                                    <div className={perfil.text}>
                                    <h3>Serviços prestados</h3>
                                    <p>{openCategories? 'Selecione os serviços que deseja anunciar e para minimizar esta área, clique aqui novamente' : 'Clique aqui para selecionar os serviços que deseja anunciar'}</p>
                                    </div>
                                    <span>{user.categories.length}</span>
                                    <i className={openCategories? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i>
                                </div>
                                {openCategories? <div className={perfil.categoriesContent}>
                                    <p onClick={() => setUser((prevState) => ({...prevState, categories: []}))}>Limpar seleção</p>
                                    <div className={perfil.categories}>
                                    {categories.map((category) => (
                                        <div key={category.id} className={perfil.category} onClick={() => handleChangeCategories(category.id)}>
                                            <div className={perfil.checkbox}>
                                            <div className={perfil.box}>
                                                <i className={user.categories.includes(category.id)? "bi bi-check" : ""}></i>
                                            </div>
                                            </div>
                                            <p>{category.name}</p>
                                        </div>
                                        ))}
                                    </div>
                                </div> : ''}
                            </div>
                                
                        </div>
                        <button type="submit" className={perfil.btnLogin}>Salvar</button>
                    </form>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}