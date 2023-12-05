
import './App.css'
import React, { useState, useEffect } from 'react';


const App = () => {
  const [TaulunData, setTaulunData] = useState([]); //Alkuperäinen TaulunData, joka näkyy rivillä 226 olevassa koodissa
  const [TaulunData2, setTaulunData2] = useState([]); //tämä helpottaa select mappausta rivillä 212
  const [RivienMaaraN, setRivienMaaraN] = useState(0); // RivienMaaraN = arvo N
  const [SolumaaraM, setSolumaaraM] = useState(0); // SolujenMaaraM = arvo M
  const [ShowOptions, setShowOptions] = useState(true); //Tämän pitäisi piilottaa select vaihtoehto, ennen kuin sivun hae tiedot painiketta on painettu
  const [TauluID, setTauluID] = useState(""); //Katsotaan taulunID kun päivitetään tietokantaan tiedot rivillä 60



  //tällä funktiolla katsotaan input kentän arvo, jotta se ei ole negatiivinen samanlainen koodi on rivillä 26
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
  //Haetaan tietokannasta rivit ja solut ja viedään ne TaulunData2 taulukkoon jota käytetään 212 rivillä
  const HaeTaulunTiedot = async () => {
    try {
      const response = await fetch("http://localhost:5000/HaeTauluunTiedot/");
      const data = await response.json();
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


  useEffect(() => {
    //Kun taulun id vaihtuu näytetään valittu taulu
    TaulunHaku();
  }, [TauluID]);

  //Funktio vie tietokantaan käyttäjän päivittämät tiedot
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
      TaulunHaku();
    } catch (err) {
      console.error(err);
    }
  }
  //Funktiossa luodaan käyttäjän antamilla parametreillä taulu tietokantaan
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
    //Haetaan taulu tieto ja tulostetaan se näytölle
    TaulunHaku();
  };

  const Tyhjenna = () => {
    //tässä voidaan tyhjentää näyttö ilman että sivua päivitetään
    setTaulunData([]);
    setRivienMaaraN(0);
    setSolumaaraM(0)
  }
  const HandleClick = (value, rivit, solut, id) => {

    //Select valinnan arvo tulee muutujiin, joka näytetään käyttäjälle
    setRivienMaaraN(Number(rivit));
    setSolumaaraM(Number(solut));
    setTauluID(id);
    TaulunHaku();

  }
  const TaulunHaku = async () => {
    //tiedo haetaan tietokannasta ja näytetään käyttäjälle
    try {
      const valinta = await fetch(`http://localhost:5000/IDhaku/${TauluID}`);
      const data = await valinta.json();

      if (data) {
        const ValiaikainenData = [];
        let solujenArvo = 1;
        for (let i = 0; i < RivienMaaraN; i++) {
          const row = [];
          for (let j = 0; j < SolumaaraM; j++) {
            row.push({ value: solujenArvo++ });
          }
          ValiaikainenData.push(row);
        }
        setTaulunData(ValiaikainenData);
      } else {
        console.error('data ei ole oikeassa muodossa', data);
      }
    } catch (err) {
      console.error('Datan haku epäonnistui', err);
    }
  };



  const handleCellClick = (value, rivit, solut) => {
    //katsotaan käyttäjän valitsema solu ja minkä toiminnon hän haluaa tehdä toiminto ei voi olla mikään muu kuin +,-,/ tai * muuten tulee ilmoitus
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
      //tässä tarkistetaan rivillä 135 oleva teksti
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