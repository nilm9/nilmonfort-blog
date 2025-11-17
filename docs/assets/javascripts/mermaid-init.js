(function () {
  if (typeof window === 'undefined') return;
  var init = function () {
    if (!window.mermaid || !window.mermaid.initialize) return;
    try {
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        fontFamily: '"Open Sans", system-ui, -apple-system, sans-serif',
        themeVariables: {
          primaryColor: '#B2EBF2',
          primaryTextColor: '#000000',
          primaryBorderColor: '#06b6d4',
          lineColor: '#333333',
          secondaryColor: '#06b6d4',
          tertiaryColor: '#E0F7FA',
          fontFamily: '"Open Sans", system-ui, -apple-system, sans-serif',
          fontSize: '14px'
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


