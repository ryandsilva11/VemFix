import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // null = não logado; objeto { id, nome, email, ... } = logado
  const [usuario, setUsuario] = useState(null);

  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario);
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAutenticado: Boolean(usuario),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
