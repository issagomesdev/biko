
import { GetServerSideProps } from 'next';
import { isAuthenticated } from '../utils/auth';
import styles from '../styles/home.module.css';
import { CategoryService } from '../services/categoryService';
import { Category } from '../models/Category';
import FeedPage from '../components/Feed';
import Sidebar from '../components/Sidebar';

interface Categories {
  categories: Category[];
}

export default function HomePage({ categories }: Categories) {

  return (
    <div className={styles.container}>
      <div className={styles.boxShadow}></div>
      <div className={styles.boxContent}>
        <div className={styles.content}>
          <Sidebar/>
          <div className={styles.screen}>
            <FeedPage/>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!isAuthenticated(context.req)) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const categories = await CategoryService.getCategories();
  return {
    props: { categories }
  };
};