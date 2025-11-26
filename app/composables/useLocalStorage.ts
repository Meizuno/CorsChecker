export const useLocalStorage = () => {
  const searchUrls = ref<string[]>([]);
  const requestMethod = ref<string>("GET");

  const addSearchUrl = (url: string) => {
    if (import.meta.client) {
      if (!searchUrls.value.includes(url)) {
        searchUrls.value.push(url);
        localStorage.setItem("search-urls", JSON.stringify(searchUrls.value));
      }
    }
  }

  const changeMethod = (method: string) => {
    if (import.meta.client) {
      requestMethod.value = method;
      localStorage.setItem("request-method", method);
    }
  };

  const readStorage = () => {
    if (import.meta.server) return null;

    searchUrls.value = JSON.parse(
      localStorage.getItem("search-urls") || "[]"
    );
    requestMethod.value = localStorage.getItem("request-method") || "GET";
  };

  return {
    searchUrls,
    requestMethod,

    addSearchUrl,
    changeMethod,
    readStorage,
  };
};
