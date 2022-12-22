const localStorage = ({ getItem: jest.fn(), setItem: jest.fn() })

export const useLocalStorage = () => localStorage;
