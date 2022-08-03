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

export { getUrl };
