import './App.css'
import React, { useState, useEffect } from 'react';
import { HaeTaulunTiedot } from './Backend/Controllers/TauluController';


const App = () => {

  //arvo N = rivien määrä ,
  //arvo M = solujen määrä
  const [TaulunData, setTaulunData] = useState([]);
  const [TaulunData2, setTaulunData2] = useState([]);
  const [RivienMaaraN, setRivienMaaraN] = useState(0);
  const [SolumaaraM, setSolumaaraM] = useState(0);
  const [ShowOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [TauluID, setTauluID] = useState("");


  const handleRowChange = (e) => {
    const value = Number(e.target.value);
    if (Number.isInteger(value) && value >= 0) {
      setRivienMaaraN(value);
    } else {
      alert("Luku ei ole positiivinen");
    }
  }

  const handleColumnChange = (e) => {
    const value = Number(e.target.value);
    if (Number.isInteger(value) && value >= 0) {
      setSolumaaraM(value);
    } else {
      alert("Luku ei ole positiivinen");
    }
  }

  //Haetaan tietokannasta datat
  const HaeTaulunTiedot = async () => {
    try {
      const response = await fetch("http://localhost:5000/HaeTauluunTiedot/");
      const data = await response.json();
      console.log(data);
      if (data) {
        setTaulunData2(data);
        setShowOptions(true);

      }
    } catch (err) {
      setShowOptions(false);
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    HaeTaulunTiedot();
  }, []);

  const HandleUpdate = async () => {
    const PaivitaTaulu = {
      rivit: RivienMaaraN,
      solut: SolumaaraM,
    }
    try {
      const vastaus = await fetch(`http://localhost:5000/update/${TauluID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(PaivitaTaulu)
      });
      const data = await vastaus.json();
      HaeTaulunTiedot();

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
    } catch (err) {
      console.error(err);
    }
  }
  const LuoTaulu = async () => {
    try {
      const UusiTaulu = {
        rivit: RivienMaaraN,
        solut: SolumaaraM,
      };
      fetch('http://localhost:5000/createTaulu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(UusiTaulu)
      })
      HaeTaulunTiedot();
    } catch {

    }
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
  const HandleClick = (value, rivit, solut, id) => {
    setSelectedOption(value);
    setRivienMaaraN(Number(rivit));
    setSolumaaraM(Number(solut));
    setTauluID(id);
  }
  const handleCellClick = (value, rivit, solut) => {
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
      <br />
      <button onClick={HaeTaulunTiedot}>Paina jos haluat hakea taulun dataa </button>
      <button onClick={HandleUpdate}>Päivitä arvot tietokantaan</button>
      <br />
      {ShowOptions ? (
        <select onChange={(e) => {
          const [rivit, solut, id] = e.target.value.split('-');
          HandleClick(e.target.value, rivit, solut, id);
        }}
        >
          {TaulunData2.map((valinta, index) => (
            <option
              key={index}
              value={`${valinta.rivit}-${valinta.solut}-${valinta._id}`}
            >
              Rivit: {valinta.rivit} - Solut: {valinta.solut}
            </option>
          ))}
        </select>
      ) : (
        <div />
      )}

      <table border="1">
        <tbody>
          {TaulunData.map((rivi, riviID) => (
            <tr key={riviID} id='rivit'>
              {rivi.map((data, soluID) => (
                <td key={soluID} onClick={() => handleCellClick(data.value, riviID, soluID)} id='solut'>
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