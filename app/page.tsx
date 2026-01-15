'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import LeftSidebar from '@/src/components/LeftSidebar/LeftSidebar';
import MainContent from '@/src/components/MainContent/MainContent';
import ProfilePage from '@/src/components/ProfilePage/ProfilePage';
import styles from './page.module.scss';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activePage, setActivePage] = useState<'home' | 'profile'>('home');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!user) {
    return null;
  }

  const handleProfileClick = () => {
    setActivePage('profile');
  };

  const handleHomeClick = () => {
    setActivePage('home');
  };

  return (
    <div className={styles.mainLayout}>
      <LeftSidebar
        onProfileClick={handleProfileClick}
        onHomeClick={handleHomeClick}
      />
      <div className={styles.middleColumn}>
        {activePage === 'home' ? <MainContent /> : null}
      </div>
      <div className={styles.rightColumn}>
        <ProfilePage />
      </div>
    </div>
  );
}
