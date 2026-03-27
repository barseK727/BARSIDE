document.addEventListener('DOMContentLoaded', () => {
  const servers = [
    { id: 1, name: 'DM #1', mode: 'dm', ip: '62.122.214.244', port: '27015', map: 'de_dust2', players: 24, max: 32, connect: 'connect 62.122.214.244:27015', steamUrl: 'steam://connect/62.122.214.244:27015', online: true, playersList: ['ProPlayer (42 фрага)', 'Sniper (38)', 'RushB (35)', 'NoobMaster (12)'] },
    { id: 2, name: '5x5 #1', mode: '5x5', ip: '45.92.38.55', port: '28031', map: 'de_mirage', players: 8, max: 10, connect: 'connect 45.92.38.55:28031', steamUrl: 'steam://connect/45.92.38.55:28031', online: true, playersList: ['TeamLeader (18)', 'AWPer (22)', 'Support (12)', 'Entry (15)'] },
    { id: 3, name: '2x2 #1', mode: '2x2', ip: '91.103.255.168', port: '28029', map: 'de_inferno', players: 4, max: 4, connect: 'connect 91.103.255.168:28029', steamUrl: 'steam://connect/91.103.255.168:28029', online: true, playersList: ['Duo1 (15)', 'Duo2 (11)'] },
    { id: 4, name: 'BHOP #1', mode: 'bhop', ip: '91.103.255.168', port: '28033', map: 'bhop_simple', players: 6, max: 12, connect: 'connect 91.103.255.168:28033', steamUrl: 'steam://connect/91.103.255.168:28033', online: true, playersList: ['BunnyHop', 'SpeedDemon', 'JumpKing'] },
    { id: 5, name: 'DM #2', mode: 'dm', ip: '185.250.149.18', port: '27015', map: 'de_cache', players: 18, max: 28, connect: 'connect 185.250.149.18:27015', steamUrl: 'steam://connect/185.250.149.18:27015', online: true, playersList: ['FragMaster (54)', 'HeadHunter (47)', 'RifleGod (33)'] },
    { id: 6, name: '5x5 #2', mode: '5x5', ip: '94.103.92.44', port: '27020', map: 'de_overpass', players: 6, max: 10, connect: 'connect 94.103.92.44:27020', steamUrl: 'steam://connect/94.103.92.44:27020', online: true, playersList: ['StratMaster (12)', 'Clutch (8)', 'Lurker (6)'] },
    { id: 7, name: '2x2 #2', mode: '2x2', ip: '91.103.255.168', port: '28030', map: 'de_nuke', players: 0, max: 4, connect: 'connect 91.103.255.168:28030', steamUrl: 'steam://connect/91.103.255.168:28030', online: false, playersList: [] },
    { id: 8, name: 'BHOP #2', mode: 'bhop', ip: '91.103.255.168', port: '28034', map: 'bhop_advanced', players: 0, max: 12, connect: 'connect 91.103.255.168:28034', steamUrl: 'steam://connect/91.103.255.168:28034', online: true, playersList: [] }
  ];

  const modeName = { dm: 'Deathmatch', '5x5': '5x5 Classic', '2x2': '2x2 Duo', bhop: 'Bunny Hop' };
  const grid = document.getElementById('serversGrid');
  if (!grid) return;

  const modal = document.getElementById('serverModal');
  const closeModalBtn = document.getElementById('closeServerModal');
  let currentServer = null;
  const syncBodyScrollLock = () => {
    const hasOpenModal = Boolean(document.querySelector('.modal.open'));
    document.body.classList.toggle('modal-open', hasOpenModal);
  };
  const openModal = () => {
    if (!modal) return;
    modal.classList.add('open');
    syncBodyScrollLock();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    syncBodyScrollLock();
  };

  const getServer = (id) => servers.find((s) => s.id === Number(id));

  const toast = (message, isError = false) => {
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText = `position:fixed;bottom:20px;right:20px;background:${isError ? '#f44336' : '#4caf50'};color:#fff;padding:10px 20px;border-radius:8px;z-index:9999;opacity:0;transition:opacity .3s;font-size:14px;`;
    document.body.appendChild(el);
    requestAnimationFrame(() => (el.style.opacity = '1'));
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 2000);
  };

  window.connectToServer = (serverId, event) => {
    event?.stopPropagation();
    const s = getServer(serverId);
    if (!s) return;
    if (!s.online) return toast('Сервер недоступен', true);
    window.location.href = s.steamUrl;
  };

  window.copyConnectCommand = async (serverId, event) => {
    event?.stopPropagation();
    const s = getServer(serverId);
    if (!s) return;
    try { await navigator.clipboard.writeText(s.connect); toast('IP скопирован!'); } catch { toast('Не удалось скопировать', true); }
  };

  const openServerModal = (id) => {
    currentServer = getServer(id);
    if (!currentServer || !modal) return;

    document.getElementById('modalServerName').textContent = currentServer.name;
    document.getElementById('modalServerStatus').innerHTML = currentServer.online
      ? '<span style="color:#4caf50;"><i class="fas fa-circle"></i> Онлайн</span>'
      : '<span style="color:#f44336;"><i class="fas fa-circle"></i> Оффлайн</span>';
    document.getElementById('modalServerPlayers').textContent = `${currentServer.players}/${currentServer.max}`;
    document.getElementById('modalServerIp').textContent = `${currentServer.ip}:${currentServer.port}`;
    document.getElementById('modalServerMap').textContent = currentServer.map;
    document.getElementById('connectCommand').textContent = currentServer.connect;

    const list = document.getElementById('modalPlayersList');
    list.innerHTML = currentServer.playersList.length
      ? currentServer.playersList.map((p) => `<div class="player-item"><i class="fas fa-user"></i> ${p}</div>`).join('')
      : '<div class="player-item">Нет игроков онлайн</div>';

    openModal();
  };

  window.connectFromModal = () => currentServer && window.connectToServer(currentServer.id);
  window.copyFromModal = () => currentServer && window.copyConnectCommand(currentServer.id);

  const render = (filter = 'all') => {
    const list = filter === 'all' ? servers : servers.filter((s) => s.mode === filter);
    if (!list.length) {
      grid.innerHTML = '<div style="text-align:center;padding:50px;">Нет серверов в этом режиме</div>';
      return;
    }

    grid.innerHTML = list.map((s) => `
      <div class="server-card" data-id="${s.id}">
        <div class="server-card-header"><h3>${s.name}</h3><div class="online-status ${s.online ? '' : 'offline'}"></div></div>
        <div class="server-card-details">
          <p><i class="fas fa-gamepad"></i> ${modeName[s.mode] || s.mode}</p>
          <p><i class="fas fa-location-dot"></i> ${s.ip}:${s.port}</p>
          <p><i class="fas fa-map"></i> ${s.map}</p>
        </div>
        <div class="server-card-footer">
          <span><i class="fas fa-users"></i> ${s.players}/${s.max}</span>
          <div class="card-buttons">
            <button class="connect-btn-card" onclick="connectToServer(${s.id}, event)"><i class="fas fa-plug"></i> Играть</button>
            <button class="copy-btn-card" onclick="copyConnectCommand(${s.id}, event)"><i class="fas fa-copy"></i></button>
          </div>
        </div>
      </div>`).join('');

    grid.querySelectorAll('.server-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.connect-btn-card,.copy-btn-card')) return;
        openServerModal(card.dataset.id);
      });
    });
  };

  closeModalBtn?.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => e.target === modal && closeModal());

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.mode);
    });
  });

  render('all');
});
