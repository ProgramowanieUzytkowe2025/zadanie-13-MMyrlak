import React, { useState, useEffect } from 'react';
import './CenaZlota.css';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

export const CenaZlota = () => {
  const [goldPrice, setGoldPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistoricalGoldPrice, setLoadingHistoricalGoldPrice] = useState(true);
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);
  const [historicalGoldPrice, setHistoricalGoldPrice] = useState([])
  useEffect(() => {
    function getGoldPrice() {
      axios.get("https://api.nbp.pl/api/cenyzlota?format=json")
      .then(res => {
        setGoldPrice(res.data[0].cena);
      setLoading(false);
      })
      .catch(err => {
        setError(err.message);
      setLoading(false);
      });
    }

    function getHistoricalGoldPrice() {
      axios.get("https://api.nbp.pl/api/cenyzlota/last/30?format=json")
      .then(res => {
        setHistoricalGoldPrice(res.data);
        setLoadingHistoricalGoldPrice(false)
      })
      .catch(err => {
        setError2(err.message);
        setLoadingHistoricalGoldPrice(false)
      })
    }
    
    getGoldPrice();
    getHistoricalGoldPrice();
  }, []);

  

  if (loading) return <div className="container">Ładowanie...</div>;
  if (error || error2) return <div className="container error-msg">Błąd: {error} | {error2}</div>;

  return (
    <div className="container">
      <div className="gold-card">
        <h2>Aktualna cena złota</h2>
        <div className="price-value">
          {goldPrice} <small>PLN/g</small>
        </div>
        <p>Kurs Narodowego Banku Polskiego</p>
      </div>
      <div className="chart-container">
        <h3>Historia zmian cen złota</h3>
        <div className="chart-wrapper">
          {!loadingHistoricalGoldPrice &&
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalGoldPrice} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line 
                  type="monotone" 
                  dataKey="cena" 
                  stroke="#d4af37" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#d4af37' }}
                  activeDot={{ r: 8 }}
                />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                <XAxis 
                  dataKey="data" 
                  fontSize={12} 
                  tickFormatter={(str) => str.split('-').slice(1).join('.')}
                />
                <YAxis 
                  fontSize={12} 
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} PLN`, 'Cena']}
                />
              </LineChart>
            </ResponsiveContainer>
          }
        </div>
      </div>
    </div>
  );
};
