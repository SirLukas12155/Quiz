
import { useState, useRef } from 'react';
import './App.css';

// Zde upravujete kategorie (přidávejte další do pole)
const categories = [
  'Historie',
  'Věda',
  'Sport',
  'Zábava',
  // Přidejte další kategorie...
];

// Zde zadáváte otázky ke kategoriím (přidávejte další otázky do pole dané kategorie)
const questions = {
  'Historie': [
    'Kdy byla bitva na Bílé hoře?',
    'Kdo byl první prezident ČSR?',
    'Ve kterém roce začala 2. světová válka?',
    // Přidejte další otázky...
  ],
  'Věda': [
    'Co je fotosyntéza?',
    'Kdo objevil gravitaci?',
    'Jaká je chemická značka vody?',
    // Přidejte další otázky...
  ],
  'Sport': [
    'Kolik hráčů je ve fotbalovém týmu?',
    'Kdo vyhrál MS ve fotbale 2018?',
    'Jak dlouhá je maraton?',
    // Přidejte další otázky...
  ],
  'Zábava': [
    'Kdo hrál Harryho Pottera?',
    'Jak se jmenuje hlavní postava v Simpsonových?',
    'Kdo zpívá píseň "Imagine"?',
    // Přidejte další otázky...
  ],
  // Přidejte další kategorie...
};

function App() {
  const [step, setStep] = useState(0);
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Hráč 1', 'Hráč 2']);
  const [scores, setScores] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [category, setCategory] = useState(null);
  const [questionIdx, setQuestionIdx] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);
  // Stav otázek: správně zodpovězené, vybrané, nezodpovězené
  const [answeredQuestions, setAnsweredQuestions] = useState({}); // { [category]: [true/false/null] }
  const [pendingQuestions, setPendingQuestions] = useState({}); // { [category]: [true/false] }
  const [gameFinished, setGameFinished] = useState(false);

  // Zadání počtu hráčů a jmen

  // Zadání počtu hráčů a jmen
  const handlePlayerCount = (e) => {
    const count = Math.max(1, Math.min(8, Number(e.target.value)));
    setPlayerCount(count);
    setPlayerNames(Array(count).fill('').map((_, i) => playerNames[i] || `Hráč ${i+1}`));
    setScores(Array(count).fill(0).map((_, i) => scores[i] || 0));
  };

  const handlePlayerName = (idx, value) => {
    const names = [...playerNames];
    names[idx] = value;
    setPlayerNames(names);
  };

  // Potvrzení hráčů
  const confirmPlayers = () => {
    // Inicializace stavu otázek pro všechny kategorie
    const initialAnswered = {};
    const initialPending = {};
    categories.forEach(cat => {
      initialAnswered[cat] = Array(questions[cat]?.length || 0).fill(null);
      initialPending[cat] = Array(questions[cat]?.length || 0).fill(false);
    });
    setAnsweredQuestions(initialAnswered);
    setPendingQuestions(initialPending);
    setStep(1);
  };

  // Výběr kategorie
  const selectCategory = (cat) => {
    // Pokud už v kategorii došly otázky, nevybírej ji
    if (isCategoryFinished(cat)) return;
    setCategory(cat);
    setStep(2);
    // Inicializace stavu otázek pokud není
    if (!answeredQuestions[cat]) {
      setAnsweredQuestions(prev => ({ ...prev, [cat]: Array(questions[cat].length).fill(null) }));
    }
    if (!pendingQuestions[cat]) {
      setPendingQuestions(prev => ({ ...prev, [cat]: Array(questions[cat].length).fill(false) }));
    }
  };

  // Výběr otázky
  const selectQuestion = (idx) => {
    setQuestionIdx(idx);
    setTimeLeft(30);
    setStep(3);
    // Označ otázku jako "pending"
    setPendingQuestions(prev => {
      const updated = { ...prev };
      updated[category][idx] = true;
      return updated;
    });
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Odpověď hráče
  const handleAnswer = (correct) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newScores = [...scores];
    if (correct) newScores[currentPlayer] += 1;
    setScores(newScores);
    // Označ otázku jako zodpovězenou
    setAnsweredQuestions(prev => {
      const updated = { ...prev };
      updated[category][questionIdx] = correct ? true : false;
      // Kontrola zda je konec hry (všechny otázky ve všech kategoriích mají hodnotu true nebo false)
      let allAnswered = true;
      for (const cat of categories) {
        if (!updated[cat]) continue;
        if (updated[cat].some(val => val === null)) {
          allAnswered = false;
          break;
        }
      }
      if (allAnswered) setGameFinished(true);
      return updated;
    });
    // Odznač "pending"
    setPendingQuestions(prev => {
      const updated = { ...prev };
      updated[category][questionIdx] = false;
      return updated;
    });
    setCurrentPlayer((currentPlayer + 1) % playerNames.length);
    setStep(1); // zpět na výběr kategorie
    setCategory(null);
    setQuestionIdx(null);
    setTimeLeft(30);
  };
  // Pomocná funkce: je kategorie hotová?
  function isCategoryFinished(cat) {
    if (!answeredQuestions[cat]) return false;
    return answeredQuestions[cat].every(val => val !== null);
  }

  // UI
  return (
    <div className="quiz-app show-style">
      <h1 className="main-title">VELKÉ SPOLEČENSKÉ HRY SPOLEČENSTVÍ</h1>
      {!gameFinished && <PlayerOverview names={playerNames} scores={scores} current={currentPlayer} />}
      {gameFinished ? (
        <FinalResults names={playerNames} scores={scores} />
      ) : (
        <>
          {step === 0 && (
            <div className="setup-section">
              <h2 className="setup-title">Zadejte počet hráčů</h2>
              <input type="number" min={1} max={8} value={playerCount} onChange={handlePlayerCount} />
              <div className="setup-players">
                {Array(playerCount).fill('').map((_, i) => (
                  <div key={i} className="player-input">
                    <label>Jméno hráče {i+1}: </label>
                    <input type="text" value={playerNames[i] || ''} onChange={e => handlePlayerName(i, e.target.value)} />
                  </div>
                ))}
              </div>
              <button className="button" onClick={confirmPlayers}>Potvrdit hráče</button>
            </div>
          )}
          {step === 1 && (
            <div className="category-section">
              <h2 className="category-title">Vyberte kategorii</h2>
              <div className="categories">
                {categories.map(cat => {
                  const finished = isCategoryFinished(cat);
                  return (
                    <div
                      key={cat}
                      className={`category${finished ? ' finished-category' : ''}`}
                      onClick={() => selectCategory(cat)}
                      style={
                        finished
                          ? { background: '#dc3545', color: '#fff', textDecoration: 'line-through', cursor: 'not-allowed' }
                          : {}
                      }
                    >
                      {cat}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="question-section">
              <h2 className="question-title">{category} - Vyberte otázku</h2>
              <div className="questions">
                {questions[category].map((q, idx) => {
                  const isAnswered = answeredQuestions[category]?.[idx] === true;
                  const isPending = pendingQuestions[category]?.[idx] === true;
                  return (
                    <button
                      key={idx}
                      className={`button question-btn${isAnswered ? (answeredQuestions[category][idx] === true ? ' answered' : ' wrong') : ''}${isPending ? ' pending' : ''}`}
                      onClick={() => (answeredQuestions[category]?.[idx] !== true) && selectQuestion(idx)}
                      disabled={answeredQuestions[category]?.[idx] === true}
                      style={
                        answeredQuestions[category]?.[idx] === true
                          ? { background: '#28a745', color: '#fff', border: '2px solid #218838' }
                          : answeredQuestions[category]?.[idx] === false
                            ? { background: '#232526', color: '#fff', border: '2px solid #232526' }
                            : isPending
                              ? { background: '#ffc107', color: '#343a40', border: '2px solid #ffcd39' }
                              : {}
                      }
                    >
                      Otázka {idx+1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="active-question-section">
              <h2 className="active-question-title">{category} - Otázka {questionIdx+1}</h2>
              <div className="question-text">{questions[category][questionIdx]}</div>
              <div className="timer">Čas: {timeLeft} s</div>
              <div className="current-player">Na řadě: <span>{playerNames[currentPlayer]}</span></div>
              <div className="answer-btns">
                <button className="button" style={{background:'#28a745'}} onClick={() => handleAnswer(true)}>Správně</button>
                <button className="button" style={{background:'#dc3545'}} onClick={() => handleAnswer(false)}>Špatně</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

function FinalResults({ names, scores }) {
  // Seřadit hráče podle bodů (od nejvyššího)
  const sorted = names.map((n, i) => ({ name: n, score: scores[i] })).sort((a, b) => b.score - a.score);
  return (
    <div className="final-results">
      <h2 className="final-title">Konečné pořadí hráčů</h2>
      <div className="final-list">
        {sorted.map((p, i) => (
          <div key={i} className="final-player">
            <span className="final-rank">{i+1}.</span>
            <span className="final-name">{p.name}</span>
            <span className="final-score">{p.score} bodů</span>
          </div>
        ))}
      </div>
    </div>
  );
}
}


function PlayerOverview({ names, scores, current }) {
  return (
    <div className="player-overview">
      <h3>Přehled všech hráčů</h3>
      <div className="player-list">
        {names.map((n, i) => (
          <div key={i} className={`player-item${i === current ? ' active-player' : ''}`}>
            <span className="player-name">{n}</span>
            <span className="player-score">{scores[i]} bodů</span>
            {i === current && <span className="player-turn"></span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
