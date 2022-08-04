const getUrl = () => {
  try {
    const query = new URLSearchParams(window.location.search);
    const urlsearch = query.get("url");
    const urlString = new URL(urlsearch as string);
    const url = urlString.origin + urlString.pathname + urlString.search;
    return url;
  } catch (_) {
    return false;
  }
};

const stringToColour = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

export { getUrl, stringToColour };
