// Anti-debugging protections
export function initAntiDebug() {
  if (!(import.meta as any).env?.PROD) return;

  // 1. Disable Right Click & F12 DevTools shortcuts
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) ||
      (e.ctrlKey && ['U', 'u'].includes(e.key))
    ) {
      e.preventDefault();
      return false;
    }
  });

  // 2. Continuous debugger loop to freeze DevTools if opened
  setInterval(() => {
    const startTime = performance.now();
    (function () {
      return false;
    })
      ['constructor']('debugger')
      ();
    const endTime = performance.now();
    if (endTime - startTime > 100) {
      window.location.reload();
    }
  }, 1000);
}
