import React, { createContext, useState, useContext, useEffect } from "react";
import * as secureStore from "expo-secure-store";
import { useRouter, useSegments } from "expo-router";
import { jwtDecode } from "jwt-decode";

/**
 * Interface que define os dados disponíveis no contexto de autenticação
 * - isAuthenticated: indica se o usuário está autenticado
 * - isLoading: indica se está verificando a autenticação
 * - checkAuth: função para verificar se há token salvo
 * - setAuthenticated: função para atualizar o estado de autenticação
 */
interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
  user: { id: number; email: string } | null;
  setUser: (user: { id: number; email: string } | null) => void;
}

// Criação do contexto de autenticação com valores padrão
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

/**
 * Provider do contexto de autenticação
 * Envolve toda a aplicação e fornece o estado de autenticação para todos os componentes
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado que indica se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Estado que indica se ainda está carregando/verificando a autenticação
  const [isLoading, setIsLoading] = useState(true);

  // Hook para navegação entre rotas
  const router = useRouter();

  // Hook que retorna os segmentos da URL atual (ex: ["tabs", "dash", "settings"])
  const segments = useSegments();

  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  /**
   * Função que verifica se o usuário possui um token salvo no secure store
   * Se houver token, marca como autenticado e recupera os dados do usuário
   * Se não houver ou der erro, marca como não autenticado
   */
  const checkAuth = async () => {
    try {
      const token = await secureStore.getItemAsync("accessToken");

      if (token) {
        // Token existe, marca como autenticado
        setIsAuthenticated(true);

        // Decodifica o token para recuperar os dados do usuário
        const decoded: any = jwtDecode(token);
        setUser({ id: decoded.sub, email: decoded.email });
      } else {
        // Não há token, marca como não autenticado
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      // Independente do resultado, marca que terminou de carregar
      setIsLoading(false);
    }
  };

  /**
   * useEffect que executa apenas uma vez quando o componente é montado
   * Verifica se há um token salvo na inicialização da app
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * useEffect que monitora mudanças na autenticação e na rota atual
   * Implementa a lógica de proteção de rotas
   */
  useEffect(() => {
    // Se ainda está carregando, não faz nada (aguarda checkAuth terminar)
    if (isLoading) return;

    // Verifica se o usuário está tentando acessar a rota protegida "settings"
    const inProtectedRoute = segments.includes("settings");

    // Se está em rota protegida E não está autenticado, redireciona para login
    if (inProtectedRoute && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, segments, isLoading]); // Executa sempre que algum desses valores mudar

  /**
   * Função auxiliar para atualizar manualmente o estado de autenticação
   * Útil após login/logout para atualizar o contexto
   */
  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
  };

  // Retorna o Provider com todos os valores e funções disponíveis para os componentes filhos
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        checkAuth,
        setAuthenticated,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook customizado para facilitar o acesso ao contexto de autenticação
 * Uso: const { isAuthenticated, setAuthenticated } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  // Verifica se o hook está sendo usado dentro do AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
