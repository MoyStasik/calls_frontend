'use client';

import { useState } from 'react';
import styles from './ProfilePage.module.scss';
import { useAuth } from '@/src/contexts/AuthContext';
import { User } from '@/app/utils/types';

export default function ProfilePage() {
  const {user, logout, updateUser} = useAuth();

  const [nickname, setNickname] = useState(user?.nickname);
  const [status, setStatus] = useState(user?.status);

  const onLogout = async() => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      await updateUser(data);
      console.log(user)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <img
            src={user?.avatar}
            alt="Аватар"
            className={styles.avatar}
          />
        </div>

        <div className={styles.profileInfo}>
          <h1 className={styles.nickname}>{user?.nickname}</h1>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            В сети
          </div>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Настройки</h2>

          <div className={styles.settingsGroup}>
            <h3 className={styles.settingsTitle}>Общие</h3>

            <div className={styles.settingItem}>
              <label htmlFor="nickname" className={styles.settingLabel}>
                Никнейм
              </label>
              <div className={styles.settingInputWrapper}>
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={styles.settingInput}
                  placeholder="Введите ваш никнейм"
                />
              </div>
            </div>

            <div className={styles.settingItem}>
              <label htmlFor="status" className={styles.settingLabel}>
                Статус
              </label>
              <textarea
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.settingTextarea}
                placeholder="Расскажите о себе..."
                rows={4}
              />
              <div className={styles.charCount}>
                {status?.length}/500 символов
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            onClick={() => updateProfile({ nickname: nickname, status: status })}
          >
            Сохранить изменения
          </button>

          <button
            className={styles.logoutButton}
            onClick={onLogout}
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
