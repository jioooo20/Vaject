const fontLinks = [
  'https://fonts.googleapis.com/css?family=Merriweather',
  'https://fonts.googleapis.com/css?family=Roboto',
];

export function loadFonts() {
  fontLinks.forEach((href) => {
    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  });
};