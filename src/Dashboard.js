import React, { useState, useEffect } from 'react';
import preventiviService from './preventiviService';

function Dashboard({ user, onLogout }) {
  const [formData, setFormData] = useState({
    potenza_kwp: '',
    autoconsumo_percentuale: '',
    prezzo_kwh: ''
  });

  const [risparmioMensile, setRisparmioMensile] = useState(null);
  const [preventivi, setPreventivi] = useState([]);
  const [loadingPreventivi, setLoadingPreventivi] = useState(false);
  const [savingPreventivo, setSavingPreventivo] = useState(false);
  const [message, setMessage] = useState('');

  // Carica i preventivi al mount del componente
  useEffect(() => {
    caricaPreventivi();
  }, []);

  const caricaPreventivi = async () => {
    setLoadingPreventivi(true);
    const result = await preventiviService.getPreventivi();

    if (result.success) {
      setPreventivi(result.data);
    } else {
      setMessage('Errore nel caricamento dei preventivi: ' + result.error);
    }

    setLoadingPreventivi(false);
  };

  const salvaPreventivo = async () => {
    if (!risparmioMensile) {
      setMessage('Calcola prima il risparmio');
      return;
    }

    setSavingPreventivo(true);
    setMessage('');

    const preventivoData = {
      potenza_kwp: parseFloat(formData.potenza_kwp),
      autoconsumo_percentuale: parseFloat(formData.autoconsumo_percentuale),
      prezzo_kwh: parseFloat(formData.prezzo_kwh),
      risparmio_mensile: parseFloat(risparmioMensile)
    };

    const result = await preventiviService.salvaPreventivo(preventivoData);

    if (result.success) {
      setMessage('Preventivo salvato con successo!');
      caricaPreventivi(); // Ricarica la lista
    } else {
      setMessage('Errore nel salvataggio: ' + result.error);
    }

    setSavingPreventivo(false);
    setTimeout(() => setMessage(''), 3000); // Nasconde il messaggio dopo 3 secondi
  };

  const eliminaPreventivo = async (preventivoId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo preventivo?')) {
      const result = await preventiviService.eliminaPreventivo(preventivoId);

      if (result.success) {
        setMessage('Preventivo eliminato con successo');
        caricaPreventivi(); // Ricarica la lista
      } else {
        setMessage('Errore nell\'eliminazione: ' + result.error);
      }

      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const calcolaRisparmio = () => {
    const { potenza_kwp, autoconsumo_percentuale, prezzo_kwh } = formData;

    // Converti stringhe in numeri
    const potenza = parseFloat(potenza_kwp);
    const autoconsumo = parseFloat(autoconsumo_percentuale) / 100; // Converti percentuale in decimale
    const prezzo = parseFloat(prezzo_kwh);

    // Formula: risparmio_mensile = potenza_kwp * 1200 / 12 * autoconsumo_percentuale * prezzo_kwh
    const risultato = potenza * 1200 / 12 * autoconsumo * prezzo;

    setRisparmioMensile(risultato.toFixed(2));
  };

  const resetForm = () => {
    setFormData({
      potenza_kwp: '',
      autoconsumo_percentuale: '',
      prezzo_kwh: ''
    });
    setRisparmioMensile(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <span>Benvenuto, {user.username}</span>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <h1>Simulatore Risparmio Fotovoltaico</h1>

      <div className="form-container">
        <div className="input-group">
          <label htmlFor="potenza_kwp">Potenza (kWp):</label>
          <input
            type="number"
            id="potenza_kwp"
            name="potenza_kwp"
            value={formData.potenza_kwp}
            onChange={handleInputChange}
            placeholder="es. 6"
            step="0.1"
          />
        </div>

        <div className="input-group">
          <label htmlFor="autoconsumo_percentuale">Autoconsumo (%):</label>
          <input
            type="number"
            id="autoconsumo_percentuale"
            name="autoconsumo_percentuale"
            value={formData.autoconsumo_percentuale}
            onChange={handleInputChange}
            placeholder="es. 70"
            min="0"
            max="100"
          />
        </div>

        <div className="input-group">
          <label htmlFor="prezzo_kwh">Prezzo kWh (€):</label>
          <input
            type="number"
            id="prezzo_kwh"
            name="prezzo_kwh"
            value={formData.prezzo_kwh}
            onChange={handleInputChange}
            placeholder="es. 0.22"
            step="0.01"
          />
        </div>

        <div className="button-group">
          <button onClick={calcolaRisparmio} className="calcola-btn">
            Calcola Risparmio
          </button>
          <button onClick={resetForm} className="reset-btn">
            Reset
          </button>
          {risparmioMensile && (
            <button
              onClick={salvaPreventivo}
              className="salva-btn"
              disabled={savingPreventivo}
            >
              {savingPreventivo ? 'Salvataggio...' : 'Salva Preventivo'}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={message.includes('successo') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      {risparmioMensile !== null && (
        <div className="risultato">
          <h2>Risparmio Mensile</h2>
          <div className="risparmio-amount">€ {risparmioMensile}</div>
        </div>
      )}

      {/* Sezione Storico Preventivi */}
      <div className="preventivi-section">
        <div className="preventivi-header">
          <h2>Storico Preventivi</h2>
          <button onClick={caricaPreventivi} className="refresh-btn" disabled={loadingPreventivi}>
            {loadingPreventivi ? 'Caricamento...' : 'Aggiorna'}
          </button>
        </div>

        {preventivi.length === 0 ? (
          <div className="empty-preventivi">
            <p>Nessun preventivo salvato</p>
          </div>
        ) : (
          <div className="preventivi-list">
            {preventivi.map((preventivo) => (
              <div key={preventivo.id} className="preventivo-card">
                <div className="preventivo-header">
                  <div className="preventivo-date">
                    {new Date(preventivo.created_at).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <button
                    onClick={() => eliminaPreventivo(preventivo.id)}
                    className="delete-btn"
                  >
                    ✕
                  </button>
                </div>
                <div className="preventivo-data">
                  <div className="data-row">
                    <span>Potenza:</span>
                    <strong>{preventivo.potenza_kwp} kWp</strong>
                  </div>
                  <div className="data-row">
                    <span>Autoconsumo:</span>
                    <strong>{preventivo.autoconsumo_percentuale}%</strong>
                  </div>
                  <div className="data-row">
                    <span>Prezzo kWh:</span>
                    <strong>€ {preventivo.prezzo_kwh}</strong>
                  </div>
                  <div className="data-row risparmio-row">
                    <span>Risparmio mensile:</span>
                    <strong className="risparmio-value">€ {preventivo.risparmio_mensile}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;