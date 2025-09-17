import { supabase } from './supabaseClient';

class PreventiviService {
  // Salva un nuovo preventivo
  async salvaPreventivo(preventivoData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Utente non autenticato');
      }

      const preventivo = {
        user_id: user.id,
        potenza_kwp: preventivoData.potenza_kwp,
        autoconsumo_percentuale: preventivoData.autoconsumo_percentuale,
        prezzo_kwh: preventivoData.prezzo_kwh,
        risparmio_mensile: preventivoData.risparmio_mensile
      };

      const { data, error } = await supabase
        .from('preventivi')
        .insert([preventivo])
        .select();

      if (error) {
        throw error;
      }

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      return { success: false, error: error.message };
    }
  }

  // Ottieni tutti i preventivi dell'utente corrente
  async getPreventivi() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Utente non autenticato');
      }

      const { data, error } = await supabase
        .from('preventivi')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, data: data };
    } catch (error) {
      console.error('Errore nel recupero preventivi:', error);
      return { success: false, error: error.message };
    }
  }

  // Elimina un preventivo
  async eliminaPreventivo(preventivoId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Utente non autenticato');
      }

      const { data, error } = await supabase
        .from('preventivi')
        .delete()
        .eq('id', preventivoId)
        .eq('user_id', user.id); // Sicurezza: può eliminare solo i propri preventivi

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new PreventiviService();