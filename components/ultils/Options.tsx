import React, { useState, useRef, ReactNode, useEffect } from 'react';
import styles from '../../styles/ultils/options.module.css'

interface OptionsItem {
  label: string;
  onClick: () => void;
}

interface OptionsProps {
  trigger: ReactNode;
  items: OptionsItem[];
}

const Options: React.FC<OptionsProps> = ({ trigger, items }) => {
    
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <div onClick={toggleMenu}>{trigger}</div>
      {isOpen && (
        <div className={styles.menu}>
          {items.map((item, index) => (
            <div
              key={index}
              onClick={item.onClick}
              className={styles.item}>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Options;