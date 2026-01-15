'use client';

import { useState, useEffect } from 'react';
import styles from './LeftSidebar.module.scss';
import { useAuth } from '../../contexts/AuthContext';
import { api, Chat } from '../../utils/api';

interface LeftSidebarProps {
  onProfileClick: () => void;
  onHomeClick: () => void;
}

export default function LeftSidebar({ onProfileClick, onHomeClick }: LeftSidebarProps) {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await api.getUserChats();
        setChats(data);
        if (data.length > 0) {
          setActiveChat(data[0].id);
        }
      } catch (error) {
        console.error('Ошибка загрузки чатов:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadChats();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className={styles.sidebar}>
      <div className={styles.userProfile} onClick={onProfileClick}>
        <img
          src={user.avatar}
          alt={user.nickname}
          className={styles.userAvatar}
        />
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{user.nickname}</h3>
          <span className={`${styles.status} ${user.isOnline ? styles.online : styles.offline}`}>
            {user.isOnline ? 'В сети' : 'Не в сети'}
          </span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.chatsSection}>
        <div className={styles.sectionHeader}>
          <h2>Чаты</h2>
          <button className={styles.newChatButton} onClick={onHomeClick}>+</button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Загрузка чатов...</div>
        ) : (
          <div className={styles.chatList}>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`${styles.chatItem} ${activeChat === chat.id ? styles.active : ''}`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className={styles.chatAvatarWrapper}>
                  <img src={chat.avatar} alt={chat.name} className={styles.chatAvatar} />
                  {chat.unreadCount > 0 && (
                    <span className={styles.unreadBadge}>{chat.unreadCount}</span>
                  )}
                </div>

                <div className={styles.chatInfo}>
                  <div className={styles.chatHeader}>
                    <h4 className={styles.chatName}>{chat.name}</h4>
                    <span className={styles.chatTime}>{chat.lastMessageTime}</span>
                  </div>
                  <p className={styles.lastMessage}>
                    {chat.lastMessage || 'Нет сообщений'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
