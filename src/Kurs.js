import { useEffect, useState } from 'react';
import './Kurs.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
export function Kurs() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const [rates, setRates] = useState([])
  const [table, setTable] = useState("a")
  const tabelChoice = ["a", "b", "c"]
  useEffect(() => {
    setLoading(true)
    axios.get(`https://api.nbp.pl/api/exchangerates/tables/${table}?format=json`)
      .then(res => {
        setRates(res.data[0].rates);
        setLoading(false);
      })
      .catch(error => {
        setError("Błąd pobierania danych");
        setLoading(false);
      });
  }, [table]);

  
  if (loading) return <div className="container">Ładowanie...</div>;
  if (error) return <div className="container error-msg">Błąd: {error}</div>;
  return (
    <div className="tabela-wrapper">
      <div className='tabela-header'>
        <h2>Tabela Kursów NBP (Tabela {table.toUpperCase()})</h2>
        <select value={table} onChange={(e) => setTable(e.target.value)}>
            {tabelChoice.map(t => (
            <option key={t} value={t}>
                Tabela {t.toUpperCase()}
            </option>
            ))}
        </select>
      </div>
      <div className="table-container">
        <table className="nbp-table">
          <thead>
            <tr>
              <th>Waluta</th>
              <th>Kod</th>
              {table === 'c' ? 
              <>
              <th>Cena Kupna</th>
              <th>Cena Sprzedaży</th>
              </>
              :
              <th>Kurs (PLN)</th>
              }
              <th>Link do szczegółów</th>
              
            </tr>
          </thead>
          <tbody>
            {rates.map(rate => (
              <tr key={rate.code}>
                <td>{rate.currency}</td>
                <td>{rate.code}</td>
                {table === 'c' ? 
                    <>
                    <td>
                    {rate.bid?.toFixed(4)}
                    </td>
                    <td >
                    {rate.ask?.toFixed(4)}
                    </td>
                    </>
                : 
                    <td>
                    {rate.mid?.toFixed(4)}
                    </td>
                }
                <td>
                    <Link to={"/tabela-kursowa/"+table+"/"+rate.code} className='nbp-table-link'> Szczegóły</Link>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
