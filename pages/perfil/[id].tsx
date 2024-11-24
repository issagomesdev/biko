import styles from '../../styles/home.module.css';
import Sidebar from  '../../components/Sidebar';
import cselector from '../../styles/ultils/categorySelector.module.css';
import perfil from '../../styles/perfil.module.css';
import { Category } from '../../models/Category';
import { useState, useEffect } from 'react';
import { State } from '../../models/State';
import { City } from '../../models/City';
import { CategoryService } from '../../services/categoryService';
import { IBGEService } from '../../services/ibgeService';
import { User } from '../../models/User';
import { useRouter } from 'next/router';
import { UserService } from '../../services/userService';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';

export default function EditPerfil() {
  const [openCategories, setOpenCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const token:string|undefined = Cookie.get('token');
  const [filterCategories, setFilterCategories] = useState<Number[]>([]);
  const [user, setUser] = useState<User>();
  const [profileUser, setProfileUser] = useState<User>();

  const handleChangeCategories = async(categoryID:number) => {
    const exist = filterCategories.includes(categoryID);
    setFilterCategories((prevState:any) => ({
      ...prevState,
      categories: exist
        ? prevState.categories.filter((id:Number) => id !== categoryID)
        : [...prevState.categories, categoryID]
    }));
  }

  const handleStateChange = async(e:any) => {
    setUser((prevState:any) => ({
      ...prevState,
      state: e.target.value,
      city: ''
    }));
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

    const getProfileUser = async () => {
        try {
          const data:any = await UserService.getUser(token, id);
          setProfileUser(data);
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

    getUser();
    getProfileUser();
    loadCategories();
    setLoading(false);
  }, []);

    return (
        <div className={styles.container}>
          <div className={styles.boxShadow}></div>
          <div className={styles.boxContent}>
            <div className={styles.content}>
              <Sidebar/>
              <div className={perfil.container}>
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
                    
                    <div>
                        <h2>{profileUser?.name}</h2>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}