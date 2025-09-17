import { supabase } from './supabaseClient';

// Servizio di autenticazione con Supabase
class AuthService {
  // Login con Supabase Auth
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw { success: false, error: error.message };
      }

      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          username: data.user.email.split('@')[0], // Usa la parte prima di @ come username
        };

        return { success: true, user: user };
      }
    } catch (error) {
      throw { success: false, error: error.error || 'Errore durante il login' };
    }
  }

  // Registrazione nuovo utente
  async register(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw { success: false, error: error.message };
      }

      return { success: true, data: data };
    } catch (error) {
      throw { success: false, error: error.error || 'Errore durante la registrazione' };
    }
  }

  // Logout con Supabase
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      throw { success: false, error: error.error || 'Errore durante il logout' };
    }
  }

  // Ottieni utente corrente
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        return null;
      }

      if (user) {
        return {
          id: user.id,
          email: user.email,
          username: user.email ? user.email.split('@')[0] : 'User',
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  // Verifica se è autenticato
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  // Listener per cambiamenti di auth state
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.email ? session.user.email.split('@')[0] : 'User',
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

export default new AuthService();