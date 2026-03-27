document.addEventListener('DOMContentLoaded', () => {
  const tournaments = [
    { name: 'BARSIDE CUP #1', prize: '50000₽', format: '5x5', participants: '12/16', date: '04.03.2026' },
    { name: 'OPEN CUP', prize: '25000₽', format: '5x5', participants: '8/16', date: '05.03.2026' },
    { name: 'WEEKEND BATTLE', prize: '10000₽', format: '2x2', participants: '10/16', date: '06.03.2026' }
  ];

  const servers = [
    { name: 'DM #1', mode: 'dm', ip: '62.122.214.244', port: '27015', players: 24, max: 32, online: true },
    { name: '5x5 #1', mode: '5x5', ip: '45.92.38.55', port: '28031', players: 8, max: 10, online: true },
    { name: '2x2 #1', mode: '2x2', ip: '91.103.255.168', port: '28029', players: 4, max: 4, online: true },
    { name: 'BHOP #1', mode: 'bhop', ip: '91.103.255.168', port: '28033', players: 6, max: 12, online: true }
  ];

  const modeName = { dm: 'Deathmatch', '5x5': '5x5 Classic', '2x2': '2x2 Duo', bhop: 'Bunny Hop' };

  const tGrid = document.getElementById('mainTournamentsGrid');
  if (tGrid) {
    tGrid.innerHTML = tournaments.map((t) => `
      <div class="tournament-card-mini" onclick="window.location.href='/html/tournament.html'">
        <div class="tournament-card-header"><h3>${t.name}</h3><span class="status-badge status-open">Открыт</span></div>
        <div class="tournament-card-prize"><i class="fas fa-trophy"></i> ${t.prize}</div>
        <div class="tournament-card-details"><span><i class="fas fa-users"></i> ${t.format}</span><span><i class="fas fa-user-friends"></i> ${t.participants}</span></div>
        <div class="tournament-card-date"><i class="far fa-calendar"></i> ${t.date}</div>
      </div>`).join('');
  }

  const sGrid = document.getElementById('mainServersGrid');
  if (sGrid) {
    sGrid.innerHTML = servers.map((s) => `
      <div class="server-card-mini" onclick="window.location.href='/html/servers.html'">
        <div class="server-card-header"><h3>${s.name}</h3><div class="online-status ${s.online ? '' : 'offline'}"></div></div>
        <div class="server-card-mode"><i class="fas fa-tag"></i> ${modeName[s.mode] || s.mode}</div>
        <div class="server-card-players"><i class="fas fa-users"></i> ${s.players}/${s.max}</div>
        <div class="server-card-ip"><i class="fas fa-map-marker-alt"></i> ${s.ip}:${s.port}</div>
      </div>`).join('');
  }

  const cards = document.querySelectorAll('.stat-card, .advantage-card, .tournament-card-mini, .server-card-mini');
  if ('IntersectionObserver' in window && cards.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        // После анимации появления убираем inline transform/transition,
        // чтобы :hover-анимации из CSS снова работали.
        setTimeout(() => {
          e.target.style.removeProperty('transform');
          e.target.style.removeProperty('transition');
        }, 650);
        observer.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    cards.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity .6s, transform .6s';
      observer.observe(el);
    });
  }
});
