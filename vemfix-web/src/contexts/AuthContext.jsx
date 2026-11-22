import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Inicializa o usuário a partir do localStorage para manter a sessão após F5
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem('vemfix_usuario');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    try {
      localStorage.setItem('vemfix_usuario', JSON.stringify(dadosUsuario));
    } catch (e) {
      console.error('Erro ao salvar usuário no localStorage:', e);
    }
  };

  const logout = () => {
    setUsuario(null);
    try {
      localStorage.removeItem('vemfix_usuario');
    } catch (e) {
      console.error('Erro ao remover usuário do localStorage:', e);
    }
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
