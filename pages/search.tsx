import styles from '../styles/home.module.css';
import Sidebar from '../components/Sidebar';
import cselector from '../styles/ultils/categorySelector.module.css';
import search from '../styles/search.module.css';
import { Category } from '../models/Category';
import { useState, useEffect } from 'react';
import { State } from '../models/State';
import { City } from '../models/City';
import { CategoryService } from '../services/categoryService';
import { IBGEService } from '../services/ibgeService';
import { User } from '../models/User';
import { useRouter } from 'next/router';
import { UserService } from '../services/userService';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';

export default function Search() {
  const [openCategories, setOpenCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const token:string|undefined = Cookie.get('token');
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<any>({
    search: '',
    categories: [],
    state: '',
    city: '',
    neighborhood: ''
  });

  const FilterChange = (e:any) => {
    const { name, value } = e.target;
    setFilter((prevState:any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeCategoriesFilter = async(categoryID:number) => {
    const exist = filter.categories.includes(categoryID);
    setFilter((prevState:any) => ({
      ...prevState,
      categories: exist
        ? prevState.categories.filter((id:Number) => id !== categoryID)
        : [...prevState.categories, categoryID]
    }));
  }

  const handleStateChange = async(e:any) => {
    setFilter((prevState:any) => ({
      ...prevState,
      state: e.target.value,
      city: ''
    }));
    const data = await IBGEService.getCities(e.target.value);
    setCities(data);
  }

  const filterPublications = () => {
    setOpenCategories(false)
    setLoading(true);
  }

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
    const getUsers = async () => {
      try {
        const data:any = await UserService.getUsers(filter, token);
        setUsers(data.data);
        setLoading(false);
      } catch (error:any) {
        if(error.status == 401){ 
          console.error('Erro:', error);
          toast.error(error, {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }
    };
    getUsers();
  }, [loading]);

  const renderUsers = () => {
    return (
      <div className={search.users}>
      {users.map(data => {
            return (
              <div key={data.id} className={search.user}>
                <p>{data.name}</p>
                <div className={search.categories}>
                  <p>{data.categories.map(category => {
                    return (
                      <span key={category.id}>{category.name}, </span>
                    );
                  })
                    }</p>
                </div>
              </div>
            );
          })}
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <div className={search.header}>
                  <div className={search.search}>
                    <div className={search.customField}>
                      <div className={search.selectContainer}>
                      <i className={"bi bi-search"}></i>
                        <input type="search" name="search" id="search" placeholder='pesquisar prestador...' onChange={FilterChange}/>
                      </div>
                    </div>
    
                    <button onClick={filterPublications}>Buscar</button>
                  </div>
                  <div className={search.filters}>
                    <div className={search.customField}>
                      <div className={search.selectContainer} onClick={() => setOpenCategories(openCategories? false : true)}>
                        <p> Filtrar por categoria de serviço <span>{filter.categories.length > 0 ? filter.categories.length : 'todas'}</span></p>
                        <i className={openCategories? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i>
                      </div>
                      {openCategories? <div className={cselector.categoriesContent}>
                      <div className={cselector.categories}>
                            <div className={cselector.category} onClick={() => setFilter((prevState:any) => ({...prevState, categories: []}))}>
                              <div className={cselector.checkbox}>
                                <div className={cselector.box}>
                                  <i className={filter.categories.length < 1? "bi bi-check" : ""}></i>
                                </div>
                              </div>
                              <p>Todas</p>
                            </div>
                        {categories.map((category) => (
                            <div key={category.id} className={cselector.category} onClick={() => handleChangeCategoriesFilter(category.id)}>
                              <div className={cselector.checkbox}>
                                <div className={cselector.box}>
                                  <i className={filter.categories.includes(category.id)? "bi bi-check" : ""}></i>
                                </div>
                              </div>
                              <p>{category.name}</p>
                            </div>
                          ))}
                      </div>
                      </div> : ''}
                    </div>

                    <div className={search.customField}>
                      <div className={search.selectContainer}>
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

                  </div>
      </div> 
    );
  }

    return (
        <div className={styles.container}>
          <div className={styles.boxShadow}></div>
          <div className={styles.boxContent}>
            <div className={styles.content}>
              <Sidebar/>
              <div className={styles.screen} style={{flexDirection: 'column'}}>
                
              {renderHeader()}
                <div className={search.container}>

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
                    renderUsers()
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}