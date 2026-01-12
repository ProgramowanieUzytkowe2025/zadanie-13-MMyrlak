import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import { Autor } from './Autor';
import {CenaZlota} from './CenaZlota'
import { Kurs } from './Kurs'
import { Main } from './Main';
import { SzczegolyWaluty } from './SzczegolyWaluty';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className='main'>
        <Routes>
          <Route path="/" element={<Main />} />
      
          <Route path="/tabela-kursowa" element={<Kurs />} />
          <Route path="/tabela-kursowa/:table/:waluta" element={<SzczegolyWaluty />} />

          <Route path="/cena-zlota" element={<CenaZlota />} />
          <Route path="/autor" element={<Autor />} />
          
          <Route path="*" element={<h2>404 - Strona nie istnieje</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

