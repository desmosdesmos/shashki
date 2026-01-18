// frontend/src/components/InviteSection.jsx
import React from 'react';

const InviteSection = ({ roomId }) => {
  const inviteLink = roomId 
    ? `${window.location.origin}/game/${roomId}` 
    : `${window.location.origin}/invite`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => alert('Ссылка скопирована!'))
      .catch(err => console.error('Ошибка при копировании:', err));
  };

  const shareViaTelegram = () => {
    // Открываем Telegram с предопределенным сообщением
    const text = `Давай сыграем в шашки! Перейди по ссылке: ${inviteLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="invite-section">
      <h3>Пригласить друга</h3>
      <p>Отправьте эту ссылку другу, чтобы сыграть вместе:</p>
      <div className="invite-link">{inviteLink}</div>
      <div className="invite-buttons">
        <button className="btn btn-secondary" onClick={copyToClipboard}>
          Копировать ссылку
        </button>
        <button className="btn btn-primary" onClick={shareViaTelegram}>
          Поделиться в Telegram
        </button>
      </div>
    </div>
  );
};

export default InviteSection;