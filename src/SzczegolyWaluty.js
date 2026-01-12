import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './SzczegolyWaluty.css';

export const SzczegolyWaluty = () => {
  const { table,waluta } = useParams();
  const [currentDetails, setCurrentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calculationResult, setCalculationResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);

  useEffect(() => {
    axios.get(`https://api.nbp.pl/api/exchangerates/rates/${table}/${waluta}/?format=json`)
      .then(res => {
        setCurrentDetails(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [waluta]);

  const handleConvert = async (e) => {
    e.preventDefault();
    setCalcLoading(true);
    setCalculationResult(null);

    let dateToTry = new Date(selectedDate);
    let success = false;
    let attempts = 0;

    while (!success && attempts < 10) {
      const formattedDate = dateToTry.toISOString().split('T')[0];
      try {
        const response = await axios.get(
          `https://api.nbp.pl/api/exchangerates/rates/${table}/${waluta}/${formattedDate}/?format=json`
        );
        const fetchedRate = table === "c" 
        ? response.data.rates[0].bid 
        : response.data.rates[0].mid;
        setCalculationResult({
          pln: (amount * fetchedRate).toFixed(2),
          rate: fetchedRate,
          date: formattedDate
        });
        success = true;
      } catch (err) {
        dateToTry.setDate(dateToTry.getDate() - 1);
        attempts++;
      }
    }

    if (!success) {
      alert("Nie udało się pobrać kursu dla wybranego okresu.");
    }
    setCalcLoading(false);
  };

  if (loading) return <div className="details-container">Ładowanie...</div>;

  return (
    <div className="details-container">
      <div className="details-card">
        <Link to="/tabela-kursowa" className="back-link">Powrót</Link>
        <h1>{currentDetails?.code}</h1>
        <p>{currentDetails?.currency}</p>
        {table === "c" ? 
          <div className="current-rate-box">
            <span>Aktualna cena kupna:</span>
            <strong>{currentDetails?.rates[0].bid.toFixed(4)} PLN</strong>
          </div>
        :
          <div className="current-rate-box">
            <span>Aktualny kurs:</span>
            <strong>{currentDetails?.rates[0].mid.toFixed(4)} PLN</strong>
          </div>
        }

        <hr />

        <form className="calc-form" onSubmit={handleConvert}>
          <h3>Kalkulator walutowy</h3>
          
          <div className="form-group">
            <label>Kwota w {waluta}:</label>
            <input 
              type="number" 
              step="0.01" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Data kursu:</label>
            <input 
              type="date" 
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              required 
            />
          </div>

          <button type="submit" disabled={calcLoading}>
            {calcLoading ? "Pobieranie kursu..." : "Przelicz na PLN"}
          </button>
        </form>

        {calculationResult && (
          <div className="result-box">
            <h4>Wynik:</h4>
            <div className="final-value">{calculationResult.pln} PLN</div>
            <p className="info">
              Zastosowany kurs: {calculationResult.rate.toFixed(4)}<br />
              z dnia: {calculationResult.date} 
              {calculationResult.date !== selectedDate ? " (najbliższy dzień roboczy)" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
