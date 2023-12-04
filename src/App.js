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
  const handleCellClick = (value,riviID,soluID) => {
    console.log(value);
    console.log(riviID);
    console.log(soluID);

    const tiedote = prompt("Valitse toiminto antamalla, jokin merkki + ,- ,/ tai *: ");
    console.log(tiedote)

    // if (tiedote === '+'){
    //   const valinta = Number(prompt("Anna arvo: ", 10));
    //   setTaulunData((prevData) => {
    //     const UusiArvo = [...prevData];
    //     UusiArvo[value] += valinta;
    //     return UusiArvo;
    //   });
    // }
    if (tiedote === '+') {
      const valinta = Number(prompt("Anna arvo: ", 10));
      setTaulunData((prevData) => {
        const UusiArvo = prevData.map((item, index) => {
          if (index === value) {
            return { ...item, value: item.value + valinta };
          }
          return item;
        });
        return UusiArvo;
      });
    }    
    else if (tiedote === '-'){
      const valinta = Number(prompt("Anna arvo: ", 10));
      setTaulunData((prevData) => {
        const UusiArvo = [...prevData];
        value.valinta -= valinta;
        return UusiArvo;
      });
    }
    else if (tiedote === '/'){
      if(valinta === 0)
      {
        alert("Nollalla ei voi jakaa!")
        return null;
      }
      else
      {
        const valinta = Number(prompt("Anna arvo: ", 10));
        setTaulunData((prevData) => {
          const UusiArvo = [...prevData];
          UusiArvo[value].valinta /= valinta;
          return UusiArvo;
        });
      }
    }
    else if (tiedote === '*'){
      const valinta = Number(prompt("Anna arvo: ", 10));
      setTaulunData((prevData) => {
        const UusiArvo = [...prevData];
        UusiArvo[value].valinta *= valinta;
        return UusiArvo;
      });
    }
    else
    {

    }

  }
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

