import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/authService';
import { IBGEService } from '../services/ibgeService';
import { CategoryService } from '../services/categoryService';
import { isAuthenticated } from '../utils/auth';
import { toast } from 'react-toastify';
import styles from '../styles/form.module.css';
import { State } from '../models/State';
import { City } from '../models/City';
import { Category } from '../models/Category';
import { FormUser } from '../models/User';

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormUser>({
    name: '',
    email: '',
    password: '',
    cpf: '',
    state: '',
    city: '',
    neighborhood: '',
    categories: []
  });
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategories, setOpenCategories] = useState(false);
  const router = useRouter();

  useEffect(() => {

    const loadStates = async() => {
      const data = await IBGEService.getStates();
      setStates(data);
    }

    const loadCategories = async() => {
      const data = await CategoryService.getCategories();
      setCategories(data);
    }

    loadStates();
    loadCategories();

  }, [])

  useEffect(() => {
    const loadCities = async(id:string) => {
        const data = await IBGEService.getCities(id);
        setCities(data);
    }

    const index = states.findIndex(i => i.nome == formData.state);
    if(index > -1) loadCities((states[index].id).toString());

  }, [formData.state])

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const toast_id = toast.loading('Aguarde...', {
      position: "top-right",
    });
    try {
      const data = await authService.register(formData);
      if (data.success) {
        toast.update(toast_id, {
          render: data.message,
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

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStateChange = async(e:any) => {
    setFormData((prevState) => ({
      ...prevState,
      state: e.target.value,
      city: ''
    }));
  }

  const handleChangeCategories = async(categoryID:number) => {
    const exist = formData.categories.includes(categoryID);
    setFormData((prevState) => ({
      ...prevState,
      categories: exist
        ? prevState.categories.filter((id) => id !== categoryID)
        : [...prevState.categories, categoryID]
    }));
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainScreen}>
        <div className={styles.leftScreen}>
            <img src="/midia/icon.png" alt=""/>
            <h1>Junte-se <br/>
                a Biko!</h1>
        </div>
        <div className={`${styles.rightScreen} ${styles.full}`}>
            <div className={styles.cardLogin}>
                <h1>BIKO</h1>
                <form onSubmit={handleRegister} className={styles.form}>
                    <div className={styles.fieldsGroup}>
                      <div className={styles.fields}>
                        <div className={styles.textfield}>
                            <input type="text" id="name" name="name" placeholder="Nome completo" value={formData.name} onChange={handleChange} required/>
                        </div>
      
                        <div className={styles.textfield}>
                            <input type="email" id="email" name="email" placeholder="Email" value={formData.email}  onChange={handleChange} required/>
                        </div>
      
                        <div className={styles.textfield}>
                            <input type="password" id="password" name="password" placeholder="Senha" value= {formData.password} onChange={handleChange} required/>
                        </div>
                      </div>
                      <div className={styles.fields}>
                        <div className={styles.textfield}>
                            <input type="text" id="cpf" name="cpf" placeholder="CPF" value={formData.cpf} onChange= {handleChange} required/>
                        </div>
                        
                        <div className={styles.textfieldPair}>
                          <div className={styles.textfield}>
                            <select name="state" id="state" value={formData.state} onChange={handleStateChange}>
                              <option selected value=''>Selecione estado </option>
                              {states.map((state) => (
                                  <option key={state.id} value={state.nome}> {state.nome} </option>
                              ))}
                            </select>
                        </div>
                            
                        <div className={styles.textfield}>
                            <select name="city" id="city" value={formData.city} onChange={handleChange}>
                              <option selected value=''>Selecione cidade </option>
                              {cities.map((city) => (
                                  <option key={city.id} value={city.nome}> {city.nome} </option>
                              ))}
                            </select>
                          </div> 
                        </div> 
                            
                        <div className={styles.textfield}>
                          <input type="text" id="neighborhood" name="neighborhood" placeholder="Bairro" value=    {formData.neighborhood} onChange={handleChange} required/>
                        </div>
                      </div>
                    </div>

                    <div className={styles.categoriesContainer}>
                      <div className={styles.openCategories} onClick={() => setOpenCategories(openCategories? false : true)}>
                        <div className={styles.text}>
                          <h3>Quero ser um prestador de serviços</h3>
                          <p>{openCategories? 'Selecione os serviços que deseja anunciar e para minimizar esta área, clique aqui novamente' : 'Clique aqui para selecionar os serviços que deseja anunciar'}</p>
                        </div>
                        <span>{formData.categories.length}</span>
                        <i className={openCategories? "bi bi-caret-up-fill" : "bi bi-caret-down-fill"}></i>
                      </div>
                      {openCategories? <div className={styles.categoriesContent}>
                        <p onClick={() => setFormData((prevState) => ({...prevState, categories: []}))}>Limpar seleção</p>
                        <div className={styles.categories}>
                          {categories.map((category) => (
                              <div key={category.id} className={styles.category} onClick={() => handleChangeCategories(category.id)}>
                                <div className={styles.checkbox}>
                                  <div className={styles.box}>
                                     <i className={formData.categories.includes(category.id)? "bi bi-check" : ""}></i>
                                  </div>
                                </div>
                                <p>{category.name}</p>
                              </div>
                            ))}
                        </div>
                      </div> : ''}
                    </div>

                    <div className={styles.terms}>
                        <input type="checkbox" name="termos" id="termos" required/>
                        Aceito os <span>Termos e Serviços</span>
                    </div>
                    <button type="submit">Cadastrar</button>
                </form>
                <p><Link href="./login">Já tenho uma conta</Link></p>
            </div>
            <div className={styles.cardShadow}>.</div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (isAuthenticated(context.req)) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    
    return {
        props: {},
    };
  };
