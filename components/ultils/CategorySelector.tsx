
import { Category } from "../../models/Category";
import styles from "../../styles/ultils.module.css"
interface CategorySelectorProps {
    categories: Category[];
    selectedCategories: number[];
    onChangeCategory: (categoryID: number) => void;
  }

const CategorySelector:React.FC<CategorySelectorProps> = ({categories, selectedCategories, onChangeCategory }) => {

  const handleSelectAll = () => {
    onChangeCategory(-1);
  };

  const handleToggleCategory = (categoryId: number) => {
    onChangeCategory(categoryId);
  };

  return (
    <div className={styles.categoriesContent}>
        <div className={styles.categories}>
            <div className={styles.category} onClick={handleSelectAll}>
                <div className={styles.checkbox}>
                <div className={styles.box}>
                    <i className={selectedCategories.length === 0 ? "bi bi-check" : ""}></i>
                </div>
                </div>
                <p>Todas</p>
            </div>
            {categories.map((category) => (
                <div key={category.id} className={styles.category} onClick={() => handleToggleCategory(category.id)}>
                <div className={styles.checkbox}>
                    <div className={styles.box}>
                    <i className={selectedCategories.includes(category.id) ? "bi bi-check" : ""}></i>
                    </div>
                </div>
                <p>{category.name}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default CategorySelector;
