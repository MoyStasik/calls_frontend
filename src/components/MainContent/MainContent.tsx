// components/MainContent/MainContent.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './MainContent.module.scss';
import { Friend } from '@/app/utils/types';
import { api } from '../../utils/api';

export default function MainContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const loadFriends = async () => {
    try {
      const data = await api.getUserFriends();
      setFriends(data);
    } catch (error) {
      console.error('Ошибка загрузки друзей:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await api.searchFriends(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      await api.addFriend(friendId);
      await loadFriends(); // Перезагружаем список друзей
      setSearchResults(prev => prev.filter(f => f.id !== friendId)); // Убираем из результатов поиска
    } catch (error) {
      console.error('Ошибка добавления друга:', error);
    }
  };

  const displayList = searchQuery.trim() ? searchResults : friends;

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
        <h2 className={styles.sectionTitle}>
          {searchQuery.trim() ? 'Результаты поиска' : 'Ваши друзья'}
        </h2>
        <p className={styles.sectionSubtitle}>
          {searchQuery.trim()
            ? `Найдено: ${searchResults.length}`
            : `Всего друзей: ${friends.length}`}
        </p>

        <div className={styles.friendsList}>
          {displayList.map((person) => (
            <div key={person.id} className={styles.friendCard}>
              <div className={styles.friendAvatarWrapper}>
                <img
                  src={person.avatar}
                  alt={person.nickname}
                  className={styles.friendAvatar}
                />
                <span className={`${styles.onlineStatus} ${person.isOnline ? styles.online : styles.offline}`}></span>
              </div>

              <div className={styles.friendInfo}>
                <h3 className={styles.friendName}>{person.nickname}</h3>
                <div className={styles.statusContainer}>
                  <span className={styles.statusCode}>
                    {person.status === 'В пути' ? 'gps' :
                     person.status === 'На тренировке' ? 'baa' :
                     person.status === 'Ищет приключения' ? 'tav' :
                     person.status}
                  </span>
                  <span className={styles.statusText}>{person.status}</span>
                </div>
              </div>

              <div className={styles.friendActions}>
                {searchQuery.trim() && !friends.some(f => f.id === person.id) ? (
                  <button
                    className={styles.actionButton}
                    onClick={() => handleAddFriend(person.id)}
                  >
                    Добавить
                  </button>
                ) : (
                  <>
                    <button className={styles.messageButton}>
                      💬
                    </button>
                    <button className={styles.moreButton}>
                      ⋮
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
