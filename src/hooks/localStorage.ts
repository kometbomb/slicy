export const useLocalStorage = (): Storage => typeof window === "undefined" ? {
    length: 0,
    setItem: () => 0,
    getItem: () => "",
    clear: () => 0,
    removeItem: () => 0,
    key: () => ""
} : localStorage;
