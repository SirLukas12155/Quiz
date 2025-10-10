import { useState, useRef, useEffect } from 'react';
import './App.css';

// === ZDE UPRAVUJETE KATEGORIE ===
const categories = [
  'Historie',
  'Věda',
  'Zeměpis',
  'Bizár CZ/SK',
  'Příroda',
  'Potřebuju body',
  // Přidejte další kategorie...
];

// === ZDE ZADÁVÁTE OTÁZKY KE KATEGORIÍM ===
const questions = {
  'Historie': [
    'Kdy byla bitva na Bílé hoře?',
    'Kdo byl první prezident ČSR?',
    'Ve kterém roce začala 2. světová válka?',
    'Kdo byl poslední český král?',
    'Kdo byl poslední korunovaný český král?',
    'Kdo byl první český král?',
    'Mezi jakými roky proběhla 1. světová válka?',
    'Mezi jakými roky proběhla 2. světová válka?',
    'Kdo byl zavražděn v Sarajevu roku 1914?',
    'Jak se jmenoval německý generál zvaný „Pouštní liška“?',
    'Kdo byl nejdéle vládnoucím králem v historii Evropy?',
    'Jak se jmenoval poslední absolutistický vládce Japonska?',
    'Kdy vznikla první Československá republika?',
    'Co je to Zlatá bula sicilská a kdy byla vydána?',
    'Kdo měl přezdívku „Noční můra Evropy“?',
    'Jak se jmenoval poslední císař Francie?',
    'Kdy vzniklo Německo?',
    'Kdy vznikla Itálie?',
    'Který stát sjednotil Německo?',
    'Který stát sjednotil Itálii?',
    'Co byla rekonkvista?',
    'Kdo byl nejdéle vládnoucím českým králem?',
    'Který politik chtěl, aby bylo Československo monarchií s ruským carem v čele?',
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
    'Jak vyrobím louč?',
    'Co je to mykologie?',
    'Co se málo ví o Teslovi?',
    
  ],

  'Zeměpis': [
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
    'Úřední jazyk Vatikánu?',
    
  ],

  'Bizár CZ/SK': [
    'Co Václav Klaus označil jako "levičácký dopravní prostředek"?',
    'Jak zněla celá hláška dnes známá jako flákanec politika Lubomíra Volného?',
    'Jak se přezdívalo Václavu Klausovi po pokusu ukrást pero osázené diamanty?',
    'Jak nazvala Jana Maláčová otázku "jak na to vezmeme"?',
    'Jak se jmenovala žena, která uvízla pod kořenem celým jménem?',
    'Kdo prohlásil větu "Pořád jste sympatičtější než Jirka Paroubek"?',
    'Kdo v televizní debatě ztratil botu?',
    'Jak pokračuje věta "já mám právo..."?',
    'Jaké bylo jméno komunistky, které to bohužel nestačilo?',
    'Jak se jmenuje píseň, na kterou tancoval Andrej Babiš po výhře ve volbách 2025?',
    'Jak zněla odpověď Andreje Babiše na otázku "Kde jste ty peníze vzal"?',
    'Jak se jmenoval politik, který ve sněmovně prohlásil "Cikáni by měli být trestně odpovědní už od narození..."?',
    'Odkud pochází hláška "Jste si to vymačkal, vás zbiju ještě"?',
    'Komu koupili přátelé k Vánocům mobil Aligátor?',
    'Jak se jmenovala žena, kterou málem srazili cyklisti?',
    'Žena si myslela, že je reinkarnací koho?',
    'Kdo je autorem slov "hodně budeš někde"?',
    'Který politik lhal o tom, že jede na dálnici v Německu, ale jel v Česku?',
    'Který slovenský politik, aby ukázal sílu, rozstřílel ve videu televizor brokovnicí?',
    'Jaký nástroj využívá pan Cibulka k identifikaci agentů KGB a GRU?',
    'Jaké dva tajné spolky ovládají naši společnost a vidí to jen jeden vyvolený muž?',
    'Jak reagoval pan Cibulka, když mu pan Paroubek skákal do řeči?',
    'Kam jsem dal řetízek?',
    'Jak moc je svarovy?',
    'Co se spívá v písničce od řezníka "Každej komouš"?',
  ],

  'Příroda': [
    'Jaký je největší savec na Zemi?',
    'Jaký je nejrychlejší suchozemský živočich?',
    'Které zvíře je symbolem Austrálie?',
    'Jaký pták neumí létat, ale umí plavat?',
    'Jaké zvíře je považováno za nejchytřejší savce po člověku?',
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
    'Když budeš žrát sirové maso dostaneš?',
    'Co je to fotosyntéza?',
    'Co je to depresní kužel?',

  ],

  'Potřebuju body': [
    'Máš radši kočky nebo psy?',
    'Máš radši kávu nebo čaj?',
    'Která kniha tě nejvíc ovlivnila?',
    'Nejvíc ZALOŽNÁ země dnes?',
    'Jak vyřešit blízký východ?',
    'Máš alobalovou čepici?',
    'Řekni mi upřímně, proč ne?',
    'Názor na černochy?',
    'Kolik mám nohou?',
    'Kolik má noha židlí?',
    'Je Luko psychopat?',
    'Nejlepší forma vlády',
    'Skákal pes přes oves...',
    'Skákal pes přes oves?',
    'Co si myslím o EU?',
    'Kdo nebo co je to Enďucha?',
    'Jak porazit Ondřeje v debatě?',
    'Proč je Ondřej tak tvrdohlavej?',
    'Má Luko HIV?',
    'Přistáli jsme na měsíci?',
    'Byli jsme a budem! kdo je autorem této věty?',
    'Jak se jmenuje hlavní město Francie?',
    'Kdo napsal knihu "1984"?',
    'Kdo namaloval "Mona Lisu"?',
    'Kdo napsal "Hamleta"?',


    











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