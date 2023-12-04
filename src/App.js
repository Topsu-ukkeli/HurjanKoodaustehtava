import './App.css'
import React, { useState } from 'react';


const App = () => {

  //arvo N = rivien määrä ,
  //arvo M = solujen määrä
  const [TaulunData, setTaulunData] = useState([]);
  const [RivienMaaraN, setRivienMaaraN] = useState(0);
  const [SolumaaraM, setSolumaaraM] = useState(0);


  const handleRowChange = (e) => {
    //tämän voisi tehdä myös suodaan input kohdassa helpompi käyttää funktiota kutsuissa.
    setRivienMaaraN(Number(e.target.value));
  }

  const handleColumnChange = (e) => {
    setSolumaaraM(Number(e.target.value));
  }


  const LuoTaulu = () => {
    const ValikainenTaulu = [];

    let solujenArvo = 1;

    for (let i = 0; i < RivienMaaraN; i++) {
      const rivi = [];
      for (let j = 0; j < SolumaaraM; j++) {
        rivi.push({ value: solujenArvo++ });
      }
      //viedään väliaikaiseen tauluun rivien ja solujen määrät 
      ValikainenTaulu.push(rivi);
    }
    setTaulunData(ValikainenTaulu);

  };

  const Tyhjenna = () => {
    //tässä voidaan tyhjentää näyttö ilman että sivua päivitetään
    setTaulunData([]);
    setRivienMaaraN(0);
    setSolumaaraM(0)
  }
  const handleCellClick = (value) => {
    const tiedote = prompt("Valitse toiminto antamalla, jokin merkki + ,- ,/ tai *: ");
    let valinta = 0;

    if (tiedote === '+') {
      valinta = Number(prompt("Anna arvo: ", 10));
      setTaulunData((prevData) => {
        const UusiArvo = prevData.map((rivi, riviIndex) => {
          return rivi.map((solu, soluIndex) => {
            if (value === solu.value) {
              return { ...solu, value: solu.value + valinta };
            }
            return solu;
          });
        });
        return UusiArvo;
      });
    } else if (tiedote === '-') {
      valinta = Number(prompt("Anna arvo: ", 10));
      setTaulunData((prevData) => {
        const UusiArvo = prevData.map((rivi, riviIndex) => {
          return rivi.map((solu, soluIndex) => {
            if (value === solu.value) {
              return { ...solu, value: solu.value - valinta };
            }
            return solu;
          });
        });
        return UusiArvo;
      });
    } else if (tiedote === '/') {
      valinta = Number(prompt("Anna arvo: ", 10));
      if (valinta === 0) {
        alert("Nollalla ei voi jakaa!")
        return null;
      }
      setTaulunData((prevData) => {
        const UusiArvo = prevData.map((rivi, riviIndex) => {
          return rivi.map((solu, soluIndex) => {
            if (value === solu.value) {
              return { ...solu, value: solu.value / valinta };
            }
            return solu;
          });
        });
        return UusiArvo;
      });
    } else if (tiedote === '*') {
      valinta = Number(prompt("Anna arvo: ", 10));
      setTaulunData((prevData) => {
        const UusiArvo = prevData.map((rivi, riviIndex) => {
          return rivi.map((solu, soluIndex) => {
            if (value === solu.value) {
              return { ...solu, value: solu.value * valinta };
            }
            return solu;
          });
        });
        return UusiArvo;
      });
    }
    else {
      alert("Sinun täytyy valita jokin operaatio +,-,/,*")
    }
  };
  return (
    <div>
      <div>
        <label>Anna rivien määrä : </label>
        <input type="number" value={RivienMaaraN} onChange={handleRowChange} />
      </div>
      <div>
        <label>Anna solujen määrä : </label>
        <input type="number" value={SolumaaraM} onChange={handleColumnChange} />
      </div>
      <button onClick={LuoTaulu}>Luo taulu annetuilla arvoilla</button>
      <button onClick={Tyhjenna}>Paina tyhjentääksesi näyttö</button>
      <table border="1">
        <tbody>
          {TaulunData.map((rivi, riviID) => (
            <tr key={riviID} id='rivit'>
              {rivi.map((data, soluID) => (
                <td key={soluID} onClick={() => handleCellClick(data.value,riviID,soluID)} id='solut'>
                  {data.value !== null ? data.value : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default App;