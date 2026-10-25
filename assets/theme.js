// Runs before CSS to prevent a flash of the wrong theme.
(() => {
  let theme;
  try { theme = localStorage.getItem('nks-theme'); } catch {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
})();
