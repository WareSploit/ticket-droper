/* ============================================================
   LOCALSTORAGE
   ============================================================ */
const STORAGE_KEY = 'easyshop_save_v3';

const Storage = {
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tickets: state.tickets,
        em: state.em,
        totalEarned: state.totalEarned,
        clicks: state.clicks,
        clicksToTicket: state.clicksToTicket,
        openedIds: Array.from(state.openedIds),
        completedTasks: Array.from(state.completedTasks),
        boughtUpgrades: Array.from(state.boughtUpgrades),
        history: state.history.slice(0, 50),
      }));
    } catch (e) { console.warn('save error', e); }
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      return {
        tickets: d.tickets || 0,
        em: d.em || 0,
        totalEarned: d.totalEarned || 0,
        clicks: d.clicks || 0,
        clicksToTicket: d.clicksToTicket || 0,
        openedIds: new Set(d.openedIds || []),
        completedTasks: new Set(d.completedTasks || []),
        boughtUpgrades: new Set(d.boughtUpgrades || []),
        history: d.history || [],
      };
    } catch (e) { return null; }
  },
};