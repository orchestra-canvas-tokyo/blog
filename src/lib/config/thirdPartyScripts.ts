export interface ThirdPartyScript {
  id: string;
  src?: string;
  inlineContent?: string;
  async?: boolean;
  defer?: boolean;
  // dataBeaconArgs?: string; // Example for data-cf-beacon, not used for current GTM/Clarity
}

export const scriptsToManage: ThirdPartyScript[] = [
  {
    id: 'gtag-script',
    src: 'https://www.googletagmanager.com/gtag/js?id=G-FEL3WFK0YW',
    async: true
  },
  {
    id: 'gtag-inline-script',
    inlineContent: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-FEL3WFK0YW');
    `.trim() // Using trim() to remove leading/trailing whitespace from template literal
  },
  {
    id: 'clarity-script',
    inlineContent: `
(function (c, l, a, r, i, t, y) {
  c[a] =
    c[a] ||
    function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
  t = l.createElement(r);
  t.async = 1;
  t.src = 'https://www.clarity.ms/tag/' + i;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
  // cspell: disable-next-line
})(window, document, 'clarity', 'script', 'q3jweqrwcn');
    `.trim() // Using trim() to remove leading/trailing whitespace
  }
];
