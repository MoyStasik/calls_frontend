'use client';

import { useEffect, useState } from 'react';
import styles from './MainContent.module.scss';
import { Friend } from '../../../app/utils/types';
import { api } from '@/src/utils/api';

export default function MainContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[] | null>(null);

  useEffect(() => {
    async function fetchFriends() {
      if (friends) {
        return;
      }

      try {
        const response = await api.getUserFriends();
        setFriends(response);
      } catch (err) {
        console.error(err);
      }
    }

    fetchFriends();
  }, [friends]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>AG</div>
          <h1 className={styles.title}>АлёГараж</h1>
        </div>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Поиск друзей..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionButton}>
          Создать чат
        </button>
      </div>

      <div className={styles.friendsSection}>
        <h2 className={styles.sectionTitle}>Ваши друзья</h2>
        <p className={styles.sectionSubtitle}>Всего друзей: {friends?.length}</p>

        <div className={styles.friendsList}>
          {friends?.map((friend) => (
            <div key={friend.id} className={styles.friendCard}>
              <div className={styles.friendAvatarWrapper}>
                <img
                  src={friend.avatar}
                  alt={friend.nickname}
                  className={styles.friendAvatar}
                />
                <span className={`${styles.onlineStatus} ${friend.isOnline ? styles.online : styles.offline}`}></span>
              </div>

              <div className={styles.friendInfo}>
                <h3 className={styles.friendName}>{friend.nickname}</h3>
                <div className={styles.statusContainer}>
                  <span className={styles.statusCode}>{friend.status}</span>
                  <span className={styles.statusText}>{friend.statusText}</span>
                </div>
              </div>

              <div className={styles.friendActions}>
                <button className={styles.messageButton}>
                  💬
                </button>
                <button className={styles.moreButton}>
                  ⋮
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
