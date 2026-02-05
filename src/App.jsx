import { useState, useRef, useEffect } from 'react';
import './App.css';

// === ZDE UPRAVUJETE KATEGORIE ===
const categories = [
  'Historie',
  'Věda',
  'Geografie',
  'Sport a volný čas',
  'Příroda',
  'Kultura a film',
  // Přidejte další kategorie...
];

// === ZDE ZADÁVÁTE OTÁZKY KE KATEGORIÍM ===
const questions = {
  'Historie': [
    'Kdy byla bitva na Bílé hoře?',
    'Kdo byl první prezident ČSR?',
    'První český král?',
    'Kdo byl poslední český král?',
    'Kdo byl poslední korunovaný český král?',
    'Kdo byl první český král?',
    'Mezi jakými roky proběhla 1. světová válka?',
    'Mezi jakými roky proběhla 2. světová válka?',
    'Kdo byl zavražděn v Sarajevu roku 1914?',
    'Komu náležela přezdívka pouštní liška?',
    'Kdo byl nejdéle vládnoucím králem v historii Evropy?',
    'Jak se jmenoval poslední absolutistický vládce Japonska?',
    'Kdy vznikla první Československá republika?',
    'Co je to Zlatá bula sicilská a kdy byla vydána?',
    'Co to byl Německý spolek?',
    'Jak se jmenoval poslední císař Francie?',
    'Kdy vzniklo Německo?',
    'Kdy vznikla Itálie?',
    'Který stát sjednotil Německo?',
    'Který stát sjednotil Itálii?',
    'Co byla rekonkvista?',
    'Kdo byl nejdéle vládnoucím českým králem?',
    'Nejdéle vládnoucí dynastie v Česku?',
    'Kdo byl poslední ruský car?',
    'Jak se jmenovaly série válek které Čínu uvedlo vobdobí zvané "století ponížení"?',

  ],

  'Věda': [
    'Co je fotosyntéza?',
    'Kdo objevil gravitaci?',
    'Jaká je chemická značka vody?',
    'Kdo objevil teorii relativity?',
    'Kdo vynalezl žárovku?',
    'Kdo popsal strukturu DNA?',
    'Kdo byl první člověk ve vesmíru?',
    'Kdo byl první člověk na Měsíci?',
    'Jaký prvek má chemickou značku O?',
    'Co je to H₂O?',
    'Kdo sestavil periodickou tabulku prvků?',
    'Kdo vynalezl penicilin?',
    'Kdo vynalezl rádio?',
    'Co měří teploměr?',
    'Co měří barometr?',
    'Co studuje biologie?',
    'Co studuje fyzika?',
    'Co studuje chemie?',
    'Jaký je největší orgán lidského těla?',
    'Kolik planet má sluneční soustava?',
    'Která planeta je nejblíže Slunci?',
    'Co je to DNA?',
    'Kdo jako první použil pojem radioaktivita?',
    'Co je to mykologie?',
    'Co se málo ví o Teslovi?',
    
  ],

  'Geografie': [
    'Nejvyšší hora ČR',
    'Hlavní město Estonska',
    'Hlavní město Islandu',
    'Nejvyšší hora Evropy',
    'Kolik států má Evropa?',
    'Kolik států má USA?',
    'Největší stát světa',
    'Nejmenší stát světa',
    'Nejdelší řeka světa',
    'Největší ostrov světa',
    'Nejhlubší jezero světa',
    'Který stát má nejvíc obyvatel?',
    'Který stát má největší hustotu zalidnění?',
    'Jaké moře omývá Itálii?',
    'Jaké pohoří odděluje Evropu a Asii?',
    'Jak se jmenuje hlavní město Kanady?',
    'Jak se jmenuje hlavní město Brazílie?',
    'Jaké je hlavní město Austrálie?',
    'Jaké je největší město světa podle populace?',
    'Jaký kontinent má nejvíce států?',
    'Který oceán je největší?',
    'Ke se Baskicko nachází?',
    'Jakými jazyky se mluví ve Švýcarsku?',
    'Jakými jazyky se mluví v Belgii?',
    'Dokážeš vymenovat tři národy bez státu?',
    
  ],

  'Sport a volný čas': [
    'Kolik hráčů má fotbalové mužstvo na hřišti?',
    'Jak se nazývá nejvyšší česká fotbalová soutěž?',
    'Kolik bodů dostane tým za výhru v hokeji?',
    'Kolik kilometrů je délka maratónu?',
    'Jak dlouho trvá jedna hokejová třetina?',
    'Kolik hráčů má basketbalové mužstvo na hřišti?',
    'První olympijské hry se konaly v jakém roce?',
    'Jaký je nejznámější český fotbalový klub?',
    'Kterému sportu se říká "královský sport"?',
    'Tři nejpopulárnější sporty na světě?',
    'Kolik figur má každý hráč v šachách na začátku?',
    'Kde se konaly první moderní olympijské hry?',
    'Jaký fotbalový klub hraje tradičně v "Edenu"?',
    'Jakou barvu má standardní tenisový míček?',
    'Kolik hráčů má volejbalové mužstvo na hřišti?',
    'Jedno české město, které hostilo slavný sportovní závod?',
    'Kdo je nejznámější český cyklista?',
    'Jak dlouho trvá basketbalový zápas?',
    'Kolik kol má Tour de France?',
    'Jaký sport je nejpopulárnější v České republice?',
    'Kolik hokejistů je v jednom mužstvu?',
    'Jak se jmenuje hrací plocha v tenise?',
    'Tři sporty ze zimních olympijských her?',
    'Kolik minut trvá normální fotbalový zápas?',
    'V jakém sportu se používá největší míč?',
  ],

  'Příroda': [
    'Jaký je největší savec na Zemi?',
    'Jaký je nejrychlejší suchozemský živočich?',
    'Jaký pták neumí létat, ale umí plavat?',
    'Jaké zvíře je považováno za nejchytřejší, hned po člověku?',
    'Která rostlina je největší na světě?',
    'Jak se nazývá proces, při kterém se housenka mění v motýla?',
    'Které zvíře má nejdelší život?',
    'Která ryba je největší na světě?',
    'Největší paryba na světě?',
    'Jak se nazývá samice jelena?',
    'Jak se nazývá mládě koně?',
    'Jak se nazývá rostlina, která chytá hmyz?',
    'Jak se jmenuje největší kočkovitá šelma?',
    'Který kontinent má nejvíce deštných pralesů?',
    'Jak se nazývá místo, kde včely žijí?',
    'Které zvíře umí měnit barvu podle prostředí?',
    'Jaký je hlavní zdroj kyslíku na Zemi?',
    'Jaký živočich dokáže přežít i ve vesmíru?',
    'Jak se nazývá proces, kdy stromy na podzim shazují listy?',
    'Jaký je největší druh medvěda na světě?',
    'Kolik nohou má stonožka?',
    'Který pták je největší na světě?',
    'Co je to fotosyntéza?',
    'Co je to depresní kužel?',
    'Jedno, dnes již vyhynulé zvíře?',

  ],

  'Kultura a film': [
    'Kdo je režisérem filmu "Pulp Fiction"?',
    'Jak se jmenuje nejznámější Hitchcockův film?',
    'Kolik Oscarů vyhrál film "Titanic"?',
    'Kdo napsal román "Zvoditel"?',
    'Jaké je nejznámější dílo Davida Bowieho?',
    'Jak se jmenuje nejznámější Pixarův film?',
    'Kdo režíroval "Avatar"?',
    'Jak se nazývá nejstarší filmový festival v Česku?',
    'Kdo je největší českou operní hvězdou?',
    'Které české město je centrum vysoké kultury?',
    'Kdo napsal "Krtek a jeho svět"?',
    'Jak se jmenuje nejznámější české divadlo?',
    'Kdo komponoval skladbu "Vltava"?',
    'Jaký je nejznámější český film všech dob?',
    'Kdo maloval "Noční můru"?',
    'Jak se jmenuje nejstarší knihovna v Česku?',
    'Kdo je nejznámějším českým režisérem?',
    'Jaký je nejznámější český román?',
    'Kolik Oscarů vyhrál "Amadeus"?',
    'Kdo je tvůrcem filmů "Hvězdné války"?',
    'Jak se jmenuje nejznámější české muzeum?',
    'Jakou cenu vyhrál film "Obecná škola"?',
    'Kdo režíroval "Americkou krásu"?',
    'Jaké je nejznámější české literární dílo?',
    'Nejlépe placený herec roku 2022?',
  ],

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Načtení stavu z localStorage při startu
  useEffect(() => {
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setStep(state.step || 0);
        setPlayerCount(state.playerCount || 2);
        setPlayerNames(state.playerNames || ['Hráč 1', 'Hráč 2']);
        setScores(state.scores || [0, 0]);
        setCurrentPlayer(state.currentPlayer || 0);
        setCategory(state.category || null);
        setQuestionIdx(state.questionIdx || null);
        setTimeLeft(state.timeLeft || 30);
        setAnsweredQuestions(state.answeredQuestions || {});
        setPendingQuestions(state.pendingQuestions || {});
        setGameFinished(state.gameFinished || false);
        setShowFeedback(state.showFeedback || false);
        setLastAnswerCorrect(state.lastAnswerCorrect || null);
      } catch (e) {
        console.error('Chyba při načítání stavu z localStorage:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Ukládání stavu do localStorage
  useEffect(() => {
    if (!isLoaded) return; // Nebude ukládat, dokud se stav nenačte z localStorage
    
    const state = {
      step,
      playerCount,
      playerNames,
      scores,
      currentPlayer,
      category,
      questionIdx,
      timeLeft,
      answeredQuestions,
      pendingQuestions,
      gameFinished,
      showFeedback,
      lastAnswerCorrect,
    };
    
    localStorage.setItem('quizState', JSON.stringify(state));
  }, [isLoaded, step, playerCount, playerNames, scores, currentPlayer, category, questionIdx, timeLeft, answeredQuestions, pendingQuestions, gameFinished, showFeedback, lastAnswerCorrect]);

  // Cleanup časovače
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePlayerCount = (e) => {
    const count = Math.max(1, Math.min(12, Number(e.target.value)));
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

  const resetGame = () => {
    localStorage.removeItem('quizState');
    window.location.reload();
  };

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
        <FinalResults names={playerNames} scores={scores} setConfirmDialog={setConfirmDialog} />
      ) : (
        <>
          {step === 0 && (
            <div className="setup-section fade-in">
              <h2 className="setup-title"> Nastavení hry</h2>
              <div className="player-count-selector">
                <label>Počet hráčů (1-12):</label>
                <input 
                  type="number" 
                  min={1} 
                  max={12} 
                  value={playerCount} 
                  onChange={handlePlayerCount}
                  className="number-input"
                />
              </div>
              <div className="setup-players">
                {Array(playerCount).fill('').map((_, i) => (
                  <div key={i} className="player-input fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                    <label> Hráč {i+1}:</label>
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
              <button className="button button-corner" onClick={() => setConfirmDialog({ type: 'newGame', location: 'setup' })}>
                Obnovit
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
              <div className="category-actions">
                <button className="button button-corner" onClick={() => setConfirmDialog({ type: 'newGame', location: 'game' })}>
                  Nová hra
                </button>
                <button className="button button-corner" onClick={() => setConfirmDialog({ type: 'endGame' })}>
                  Ukončit hru
                </button>
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
      
      {confirmDialog && (
        <ConfirmDialog 
          dialog={confirmDialog} 
          onConfirm={() => {
            if (confirmDialog.type === 'newGame') {
              localStorage.removeItem('quizState');
              window.location.reload();
            } else if (confirmDialog.type === 'endGame') {
              setGameFinished(true);
              setConfirmDialog(null);
            }
          }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}

function FinalResults({ names, scores, setConfirmDialog }) {
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
      <button className="button button-large" onClick={() => setConfirmDialog({ type: 'newGame', location: 'results' })}>
        Nová hra
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

function ConfirmDialog({ dialog, onConfirm, onCancel }) {
  const getMessage = () => {
    if (dialog.type === 'newGame') {
      return 'Opravdu chcete začít novou hru? Všechny pokroky budou smazány.';
    } else if (dialog.type === 'endGame') {
      return 'Opravdu chcete ukončit hru? Zobrazí se finální výsledky.';
    }
    return '';
  };

  const getTitle = () => {
    if (dialog.type === 'newGame') {
      return 'Nová hra';
    } else if (dialog.type === 'endGame') {
      return 'Ukončit hru';
    }
    return 'Potvrzení';
  };

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <h3 className="confirm-title">{getTitle()}</h3>
        <p className="confirm-message">{getMessage()}</p>
        <div className="confirm-buttons">
          <button className="button confirm-cancel" onClick={onCancel}>
            ✕ Zrušit
          </button>
          <button className="button confirm-ok" onClick={onConfirm}>
            ✓ Potvrdit
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;