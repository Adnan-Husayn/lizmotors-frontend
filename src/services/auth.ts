// auth.ts
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('authToken');
};
