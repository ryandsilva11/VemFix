import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Inicializa o usuário a partir do sessionStorage (permite guias com contas independentes e persiste no F5)
  const [usuario, setUsuario] = useState(() => {
    try {
      // Limpa resquício de localStorage para não misturar contas entre diferentes guias
      localStorage.removeItem('vemfix_usuario');
      const salvo = sessionStorage.getItem('vemfix_usuario');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    try {
      sessionStorage.setItem('vemfix_usuario', JSON.stringify(dadosUsuario));
    } catch (e) {
      console.error('Erro ao salvar usuário no sessionStorage:', e);
    }
  };

  const logout = () => {
    setUsuario(null);
    try {
      sessionStorage.removeItem('vemfix_usuario');
      localStorage.removeItem('vemfix_usuario');
    } catch (e) {
      console.error('Erro ao remover usuário:', e);
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
