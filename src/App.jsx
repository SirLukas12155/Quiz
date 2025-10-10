import { useState, useRef, useEffect } from 'react';
import './App.css';

// === ZDE UPRAVUJETE KATEGORIE ===
const categories = [
  'Historie',
  'Věda',
  'Sport',
  'Zábava',
  // Přidejte další kategorie...
];

// === ZDE ZADÁVÁTE OTÁZKY KE KATEGORIÍM ===
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
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [pendingQuestions, setPendingQuestions] = useState({});
  const [gameFinished, setGameFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  // Cleanup časovače
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

  const confirmPlayers = () => {
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

  const selectCategory = (cat) => {
    if (isCategoryFinished(cat)) return;
    setCategory(cat);
    setStep(2);
    if (!answeredQuestions[cat]) {
      setAnsweredQuestions(prev => ({ ...prev, [cat]: Array(questions[cat].length).fill(null) }));
    }
    if (!pendingQuestions[cat]) {
      setPendingQuestions(prev => ({ ...prev, [cat]: Array(questions[cat].length).fill(false) }));
    }
  };

  const selectQuestion = (idx) => {
    if (answeredQuestions[category]?.[idx] !== null) return;
    
    setQuestionIdx(idx);
    setTimeLeft(30);
    setStep(3);
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

  const handleAnswer = (correct) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setLastAnswerCorrect(correct);
    setShowFeedback(true);
    
    const newScores = [...scores];
    if (correct) newScores[currentPlayer] += 1;
    setScores(newScores);
    
    setAnsweredQuestions(prev => {
      const updated = { ...prev };
      updated[category][questionIdx] = correct ? true : false;
      
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
    
    setPendingQuestions(prev => {
      const updated = { ...prev };
      updated[category][questionIdx] = false;
      return updated;
    });
    
    setTimeout(() => {
      setShowFeedback(false);
      setCurrentPlayer((currentPlayer + 1) % playerNames.length);
      setStep(1);
      setCategory(null);
      setQuestionIdx(null);
      setTimeLeft(30);
    }, 1500);
  };

  function isCategoryFinished(cat) {
    if (!answeredQuestions[cat]) return false;
    return answeredQuestions[cat].every(val => val !== null);
  }

  const getQuestionStatus = (cat, idx) => {
    const answered = answeredQuestions[cat]?.[idx];
    const pending = pendingQuestions[cat]?.[idx];
    
    if (answered === true) return 'correct';
    if (answered === false) return 'wrong';
    if (pending) return 'pending';
    return 'available';
  };

  const getTotalQuestions = () => {
    return categories.reduce((sum, cat) => sum + (questions[cat]?.length || 0), 0);
  };

  const getAnsweredCount = () => {
    let count = 0;
    categories.forEach(cat => {
      if (answeredQuestions[cat]) {
        count += answeredQuestions[cat].filter(val => val !== null).length;
      }
    });
    return count;
  };

  return (
    <div className="quiz-app show-style">
      <h1 className="main-title">VELKÝ SPOLEČENSKÝ QUIZ PRO SLOPEČENSTVÍ</h1>
      
      {!gameFinished && step > 0 && (
        <div className="game-progress">
          <div className="progress-text">
            Zodpovězeno: {getAnsweredCount()} / {getTotalQuestions()} otázek
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(getAnsweredCount() / getTotalQuestions()) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {!gameFinished && step > 0 && (
        <PlayerOverview names={playerNames} scores={scores} current={currentPlayer} />
      )}
      
      {gameFinished ? (
        <FinalResults names={playerNames} scores={scores} />
      ) : (
        <>
          {step === 0 && (
            <div className="setup-section fade-in">
              <h2 className="setup-title">⚙️ Nastavení hry</h2>
              <div className="player-count-selector">
                <label>Počet hráčů (1-8):</label>
                <input 
                  type="number" 
                  min={1} 
                  max={8} 
                  value={playerCount} 
                  onChange={handlePlayerCount}
                  className="number-input"
                />
              </div>
              <div className="setup-players">
                {Array(playerCount).fill('').map((_, i) => (
                  <div key={i} className="player-input fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                    <label>🎮 Hráč {i+1}:</label>
                    <input 
                      type="text" 
                      value={playerNames[i] || ''} 
                      onChange={e => handlePlayerName(i, e.target.value)}
                      placeholder={`Zadejte jméno hráče ${i+1}`}
                    />
                  </div>
                ))}
              </div>
              <button className="button button-large" onClick={confirmPlayers}>
                ZAČÍT HRU
              </button>
            </div>
          )}
          
          {step === 1 && (
            <div className="category-section fade-in">
              <h2 className="category-title"> VYBER KATEGORII</h2>
              <p className="turn-indicator">
                Otázku vybírá: <strong>{playerNames[currentPlayer]}</strong>
              </p>
              <div className="categories">
                {categories.map((cat, idx) => {
                  const finished = isCategoryFinished(cat);
                  const answeredCount = answeredQuestions[cat]?.filter(val => val !== null).length || 0;
                  const totalCount = questions[cat]?.length || 0;
                  
                  return (
                    <div
                      key={cat}
                      className={`category${finished ? ' finished-category' : ''} slide-in`}
                      style={{animationDelay: `${idx * 0.1}s`}}
                      onClick={() => selectCategory(cat)}
                    >
                      <div className="category-name">{cat}</div>
                      <div className="category-progress">
                        {answeredCount} / {totalCount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="question-section fade-in">
              <h2 className="question-title"> {category}</h2>
              <p className="section-subtitle">Vyberte otázku</p>
              <div className="questions">
                {questions[category].map((q, idx) => {
                  const status = getQuestionStatus(category, idx);
                  
                  return (
                    <button
                      key={idx}
                      className={`question-btn status-${status} pop-in`}
                      style={{animationDelay: `${idx * 0.05}s`}}
                      onClick={() => selectQuestion(idx)}
                      disabled={status === 'correct' || status === 'wrong'}
                    >
                      <span className="question-number">#{idx+1}</span>
                      {status === 'correct' && <span className="status-icon">✓</span>}
                      {status === 'wrong' && <span className="status-icon">✗</span>}
                      {status === 'pending' && <span className="status-icon">⏳</span>}
                    </button>
                  );
                })}
              </div>
              <button className="button button-back" onClick={() => setStep(1)}>
                ← Zpět na kategorie
              </button>
            </div>
          )}
          
          {step === 3 && (
            <div className="active-question-section fade-in">
              <div className="question-header">
                <span className="question-category">📌 {category}</span>
                <span className="question-badge">Otázka #{questionIdx+1}</span>
              </div>
              
              <div className="question-text">{questions[category][questionIdx]}</div>
              
              <div className={`timer ${timeLeft <= 10 ? 'timer-warning' : ''} ${timeLeft <= 5 ? 'timer-danger' : ''}`}>
                <div className="timer-icon">⏱️</div>
                <div className="timer-value">{timeLeft}s</div>
              </div>
              
              <div className="current-player-card">
                <div className="current-player-label">Na řadě:</div>
                <div className="current-player-name">{playerNames[currentPlayer]}</div>
              </div>
              
              {showFeedback ? (
                <div className={`feedback ${lastAnswerCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
                  <div className="feedback-icon">
                    {lastAnswerCorrect ? '🎉' : '😔'}
                  </div>
                  <div className="feedback-text">
                    {lastAnswerCorrect ? 'Správně!' : 'Špatně!'}
                  </div>
                </div>
              ) : (
                <div className="answer-btns">
                  <button className="button button-correct" onClick={() => handleAnswer(true)}>
                    ✓ Správně
                  </button>
                  <button className="button button-wrong" onClick={() => handleAnswer(false)}>
                    ✗ Špatně
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FinalResults({ names, scores }) {
  const sorted = names.map((n, i) => ({ name: n, score: scores[i] })).sort((a, b) => b.score - a.score);
  const maxScore = sorted[0]?.score || 0;
  
  const getMedal = (position) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return '🏅';
  };
  
  return (
    <div className="final-results fade-in">
      <h2 className="final-title">🏆 Konečné výsledky 🏆</h2>
      <div className="final-list">
        {sorted.map((p, i) => (
          <div key={i} className={`final-player pop-in ${i === 0 ? 'winner' : ''}`} style={{animationDelay: `${i * 0.15}s`}}>
            <span className="final-medal">{getMedal(i)}</span>
            <span className="final-rank">{i+1}.</span>
            <span className="final-name">{p.name}</span>
            <span className="final-score">
              {p.score} {p.score === 1 ? 'bod' : p.score < 5 ? 'body' : 'bodů'}
            </span>
            <div className="score-bar">
              <div 
                className="score-bar-fill" 
                style={{ width: `${maxScore > 0 ? (p.score / maxScore) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <button className="button button-large" onClick={() => window.location.reload()}>
         NOVÁ HRA
      </button>
    </div>
  );
}

function PlayerOverview({ names, scores, current }) {
  return (
    <div className="player-overview">
      <h3 className="overview-title">Přehled všech našich hráčů</h3>
      <div className="player-list">
        {names.map((n, i) => (
          <div key={i} className={`player-item${i === current ? ' active-player' : ''}`}>
            <div className="player-info">
              <span className="player-name">{n}</span>
              <span className="player-score"> {scores[i]}</span>
            </div>
            {i === current && (
              <div className="player-indicator">
                <span className="indicator-arrow"></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;