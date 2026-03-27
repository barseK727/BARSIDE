(() => {
  const $ = (id) => document.getElementById(id);
  const setHTML = (el, html) => el && (el.innerHTML = html);

  const loadPart = (id, url) => {
    const el = $(id);
    if (!el) return;
    fetch(url)
      .then((r) => r.text())
      .then((html) => setHTML(el, html))
      .catch(() => {});
  };

  loadPart('header', '/html/header.html');
  loadPart('footer', '/html/footer.html');

  const els = {
    modal: $('my-modal'),
    openBtn: $('open-modal'),
    closeBtn: $('close-my-modal'),
    form: $('form'),
    message: $('message-delivered'),
    tournamentModal: $('tournament-modal'),
    closeTournamentModal: $('close-tournament-modal'),
    registerBtn: $('register-tournament-btn'),
    backToTournamentBtn: $('back-to-tournament'),
    registrationModal: $('registration-modal'),
    closeRegistrationModal: $('close-registration-modal'),
    registrationForm: $('registration-form')
  };

  // Настройки Telegram:
  // TELEGRAM_TOKEN - токен бота от @BotFather
  // TELEGRAM_CHAT_ID - id чата/группы, куда отправляются заявки
  const TELEGRAM_TOKEN = '8514499815:AAFBke3vKTems9glQ4mfZbTgWlLXYkuta20';
  const TELEGRAM_CHAT_ID = '-5182905509';

  const tournaments = [
    {
      id: 1,
      name: 'BARSIDE CUP #1',
      prize: '50000₽',
      format: '5x5',
      participants: '12/16',
      date: '04.03.2026, 23:27:11',
      status: 'open',
      description: 'Крупный турнир для профессиональных команд. Призовой фонд 50,000₽.',
      rules: '1. Формат Best of 3\n2. Обязательная явка за 1 час до начала\n3. Карты выбираются по системе veto\n4. Читы и баги запрещены',
      schedule: 'Групповой этап: 05.03.2026\nПлей-офф: 07.03.2026\nФинал: 10.03.2026'
    },
    {
      id: 2,
      name: 'OPEN CUP',
      prize: '25000₽',
      format: '5x5',
      participants: '8/16',
      date: '05.03.2026, 20:00:00',
      status: 'open',
      description: 'Открытый турнир для всех желающих. Призовой фонд 25,000₽.',
      rules: '1. Формат Best of 1\n2. Регистрация до 19:00\n3. Карты: Dust2, Mirage, Inferno',
      schedule: 'Турнир проводится в один день: 05.03.2026 с 20:00'
    },
    {
      id: 3,
      name: 'WEEKEND BATTLE',
      prize: '10000₽',
      format: '2x2',
      participants: '10/16',
      date: '06.03.2026, 18:00:00',
      status: 'open',
      description: 'Еженедельный турнир для пар. Призовой фонд 10,000₽.',
      rules: '1. Формат Best of 3\n2. Участвуют только пары\n3. Обязательный стрим финалов',
      schedule: 'Каждую субботу в 18:00'
    }
  ];

  let currentTournament = null;

  const syncBodyScrollLock = () => {
    const hasOpenModal = Boolean(document.querySelector('.modal.open'));
    document.body.classList.toggle('modal-open', hasOpenModal);
  };

  const openModal = (el) => {
    if (!el) return;
    el.classList.add('open');
    syncBodyScrollLock();
  };

  const closeModal = (el) => {
    if (!el) return;
    el.classList.remove('open');
    syncBodyScrollLock();
  };
  const showSuccessToast = (text) => {
    if (!els.message) return;
    els.message.textContent = text;
    els.message.classList.remove('disp');
    setTimeout(() => els.message.classList.add('disp'), 3000);
  };

  if (els.openBtn) els.openBtn.onclick = () => openModal(els.modal);
  if (els.closeBtn) els.closeBtn.onclick = () => closeModal(els.modal);
  if (els.closeTournamentModal) els.closeTournamentModal.onclick = () => closeModal(els.tournamentModal);
  if (els.closeRegistrationModal) els.closeRegistrationModal.onclick = () => closeModal(els.registrationModal);

  window.addEventListener('click', (e) => {
    if (e.target === els.modal) closeModal(els.modal);
    if (e.target === els.tournamentModal) closeModal(els.tournamentModal);
    if (e.target === els.registrationModal) closeModal(els.registrationModal);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeModal(els.modal);
    closeModal(els.tournamentModal);
    closeModal(els.registrationModal);
  });

  const setTournamentInfo = (t) => {
    const status = $('tournament-status');
    $('tournament-name').textContent = t.name;
    $('tournament-prize').innerHTML = `<i class="fas fa-trophy"></i> ${t.prize}`;
    $('tournament-format').innerHTML = `<i class="fas fa-users"></i> ${t.format}`;
    $('tournament-participants').innerHTML = `<i class="fas fa-user-friends"></i> ${t.participants}`;
    $('tournament-date').innerHTML = `<i class="far fa-calendar"></i> ${t.date}`;
    $('tournament-description').textContent = t.description;
    $('tournament-rules').textContent = t.rules;
    $('tournament-schedule').textContent = t.schedule;
    if (status) {
      status.className = `status-badge ${t.status === 'open' ? 'status-open' : 'status-closed'}`;
      status.textContent = t.status === 'open' ? 'Открыт' : 'Закрыт';
    }
  };

  const resetRegistrationForm = () => {
    ['team-name', 'coach-name', 'captain-telegram', 'captain-phone'].forEach((id) => {
      const el = $(id);
      if (el) el.value = '';
    });
    document.querySelectorAll('#players-container .player-nickname').forEach((input) => {
      input.value = '';
    });
  };

  const collectPlayers = () => {
    const players = [];
    const rows = document.querySelectorAll('#players-container .player-item');
    for (let i = 0; i < rows.length; i += 1) {
      const nickname = rows[i].querySelector('.player-nickname')?.value.trim();
      if (!nickname) return alert(`Введите никнейм игрока ${i + 1}`), null;
      players.push({ number: i + 1, nickname, isCaptain: i === 0 });
    }
    if (players.length < 5) return alert('Необходимо указать 5 игроков'), null;
    return players;
  };

  // Быстрый POST с таймаутом, чтобы форма не зависала при долгом ответе Telegram.
  const postJsonWithTimeout = async (url, payload, timeoutMs = 2500) => {
    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data?.ok);
    } catch (_) {
      return false;
    } finally {
      clearTimeout(timerId);
    }
  };

  // Fire-and-forget fallback: отправляет GET без ожидания ответа.
  const sendByImageBeacon = (url, chatId, text) => {
    try {
      const params = new URLSearchParams({ chat_id: chatId, text });
      const beacon = new Image();
      beacon.referrerPolicy = 'no-referrer';
      beacon.src = `${url}?${params.toString()}`;
      return true;
    } catch (_) {
      return false;
    }
  };

  // Отправка в Telegram без Python/PHP backend.
  const sendTelegramDirect = async (text) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const payload = { chat_id: TELEGRAM_CHAT_ID, text };

    // 1) Основной путь: POST JSON (работает там, где разрешён CORS-ответ).
    const postOk = await postJsonWithTimeout(url, payload, 2500);
    if (postOk) return true;

    // 2) Fallback: GET через Image beacon.
    // Нужен, когда браузер не даёт прочитать CORS-ответ, но запрос отправить может.
    return sendByImageBeacon(url, TELEGRAM_CHAT_ID, text);
  };

  const sendTelegram = async (text) => {
    // Единая функция отправки для обеих форм на странице.
    const directOk = await sendTelegramDirect(text);
    if (directOk) console.info('Telegram sent via direct API');
    return directOk;
  };

  if (els.backToTournamentBtn) {
    els.backToTournamentBtn.onclick = () => {
      closeModal(els.registrationModal);
      openModal(els.tournamentModal);
    };
  }

  if (els.registerBtn) {
    els.registerBtn.onclick = () => {
      closeModal(els.tournamentModal);
      resetRegistrationForm();
      openModal(els.registrationModal);
    };
  }

  if (els.registrationForm) {
    els.registrationForm.onsubmit = async (e) => {
      e.preventDefault();
      const teamName = $('team-name')?.value.trim();
      const coachName = $('coach-name')?.value.trim();
      const captainTelegram = $('captain-telegram')?.value.trim();
      const captainPhone = $('captain-phone')?.value.trim();

      if (!teamName) return alert('Введите название команды');
      if (!captainTelegram || !captainPhone) return alert('Заполните контактные данные капитана');
      if (!currentTournament) return alert('Турнир не выбран');

      const players = collectPlayers();
      if (!players) return;

      const playersText = players.map((p) => `${p.number}. ${p.nickname}${p.isCaptain ? ' (Капитан)' : ''}`).join('\n');
      const text = `🎮 НОВАЯ РЕГИСТРАЦИЯ НА ТУРНИР\n\n🏆 Турнир: ${currentTournament.name}\n
      🎯 Призовой фонд: ${currentTournament.prize}\n\n👥 Команда: ${teamName}\n
      👨‍💼 Тренер: ${coachName || 'Не указан'}\n\n👤 Капитан:\n├─ Telegram: ${captainTelegram}\n
      └─ Телефон: ${captainPhone}\n\n👥 Состав команды (5x5):\n${playersText}\n\n📅 Дата турнира: ${currentTournament.date}`;

      const ok = await sendTelegram(text);
      if (!ok) return alert('Ошибка отправки заявки. Откройте консоль браузера (F12) для диагностики.');

      showSuccessToast('Заявка на турнир успешно отправлена');
      closeModal(els.registrationModal);
      els.registrationForm.reset();
    };
  }

  if (els.form) {
    els.form.onsubmit = async (e) => {
      e.preventDefault();
      const tournamentName = $('create-tournament-name')?.value.trim();
      const prizeFund = $('create-prize-fund')?.value.trim();
      const playersCount = $('create-players-count')?.value.trim();
      const tournamentDate = $('create-date')?.value;
      const telegram = $('create-telegram')?.value.trim();
      const phone = $('create-phone')?.value.trim();
      const additionalInfo = $('create-additional-info')?.value.trim();

      if (!tournamentName || !prizeFund || !playersCount || !tournamentDate || !telegram || !phone) {
        return alert('Заполните все обязательные поля');
      }

      const formattedDate = tournamentDate.replace('T', ' ');
      const text = `🎮 НОВАЯ ЗАЯВКА НА СОЗДАНИЕ ТУРНИРА\n\n📋 Название турнира: ${tournamentName}\n💰 Призовой фонд: ${prizeFund}\n👥 Количество игроков: ${playersCount}\n📅 Дата проведения: ${formattedDate}\n\n📞 Контакты организатора:\n├─ Telegram: ${telegram}\n└─ Телефон: ${phone}\n\n📝 Дополнительная информация:\n${additionalInfo || 'Не указана'}`;

      const ok = await sendTelegram(text);
      if (!ok) return alert('Ошибка отправки. Откройте консоль браузера (F12) для диагностики.');

      showSuccessToast('Сообщение доставлено');
      els.form.reset();
      closeModal(els.modal);
    };
  }

  document.querySelectorAll('.card').forEach((card, i) => {
    card.addEventListener('click', () => {
      currentTournament = tournaments[i];
      if (!currentTournament || !els.tournamentModal) return;
      setTournamentInfo(currentTournament);
      openModal(els.tournamentModal);
    });
  });
})();
