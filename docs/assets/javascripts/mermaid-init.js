(function () {
  if (typeof window === 'undefined') return;
  var init = function () {
    if (!window.mermaid || !window.mermaid.initialize) return;
    try {
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          primaryColor: '#00BCD4',
          primaryTextColor: '#fff',
          primaryBorderColor: '#0097A7',
          lineColor: '#00ACC1',
          secondaryColor: '#B2EBF2',
          tertiaryColor: '#E0F7FA'
        }
      });
    } catch (e) {
      // no-op
    }
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();


