
import { useState } from 'react';

export default function App() {
  const [results, setResults] = useState([]);
  const [decision, setDecision] = useState('');
  const [wins, setWins] = useState(0);
  const [fails, setFails] = useState(0);
  const [comp, setComp] = useState(0);
  const [profit, setProfit] = useState(0);
  const [seed, setSeed] = useState(0);
  const [step1, setStep1] = useState(10000);
  const [step2, setStep2] = useState(20000);
  const [step3, setStep3] = useState(30000);
  const [compPerRoutine, setCompPerRoutine] = useState(0.0);

  const [lastEntry, setLastEntry] = useState(null); // 최근 진입 저장

  const handleAddResult = (value) => {
    const updated = [...results, { type: '관망', value }].slice(-100);
    setResults(updated);
    evaluate(updated.map(r => r.value));
  };

  const handleEntry = (value, step) => {
    setLastEntry({ value, step });
  };

  const handleWin = () => {
    if (lastEntry) {
      const amount = lastEntry.step === 2 ? step2 : lastEntry.step === 3 ? step3 : step1;
      const isBanker = lastEntry.value === 'b';
      const winAmount = isBanker ? amount * 0.95 : amount;
      setProfit(profit + winAmount);
      setComp(comp + (compPerRoutine * amount) / 100);
      setWins(wins + 1);
      setResults(prev => [...prev, { type: '결과', value: lastEntry.value }].slice(-100));
      evaluate([...results, { type: '결과', value: lastEntry.value }].map(r => r.value));
      setLastEntry(null);
    }
  };

  const handleLose = () => {
    if (lastEntry) {
      const amount = lastEntry.step === 2 ? step2 : lastEntry.step === 3 ? step3 : step1;
      setProfit(profit - amount);
      setComp(comp + (compPerRoutine * amount) / 100);
      setFails(fails + 1);
      const result = lastEntry.value === 'b' ? 'p' : 'b';
      setResults(prev => [...prev, { type: '결과', value: result }].slice(-100));
      evaluate([...results, { type: '결과', value: result }].map(r => r.value));
      setLastEntry(null);
    }
  };

  const evaluate = (recent) => {
    if (recent.length < 6) return setDecision('관망 유지 (데이터 부족)');
    const last = recent[recent.length - 1];
    if (last === 't') return setDecision('관망 유지 (T 직후)');

    const last20 = recent.slice(-20);
    const patternCount = { bb: 0, pp: 0, bp: 0, pb: 0 };

    for (let i = 0; i < last20.length - 1; i++) {
      const pair = last20[i] + last20[i + 1];
      if (patternCount[pair] !== undefined) {
        patternCount[pair]++;
      }
    }

    let recommended = '';
    let reason = '';
    if (patternCount.bb > patternCount.pp) {
      recommended = 'p';
      reason = '최근 BB 빈도 > PP → P 진입 추천';
    } else if (patternCount.pp > patternCount.bb) {
      recommended = 'b';
      reason = '최근 PP 빈도 > BB → B 진입 추천';
    } else {
      recommended = '관망';
      reason = 'BB/PP 패턴 균형 → 관망 권장';
    }

    const successRate = wins + fails > 0 ? Math.round((wins / (wins + fails)) * 100) : 0;
    setDecision("AI 추천 진입 → " + recommended.toUpperCase() + " | 근거: " + reason + " | 성공률: " + successRate + "%");
  };

  const getColor = (val) => {
    if (val === 'p') return 'blue';
    if (val === 'b') return 'red';
    if (val === 't') return 'green';
    return 'black';
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        <h2>🧠 Baccarat Flow AI</h2>
        <div><strong>{decision}</strong></div>

        <div style={{ margin: '10px 0' }}>
          <h4>📌 최근 결과</h4>
          <div>
            {results.slice(-10).map((r, i) => (
              <span key={i} style={{
                backgroundColor: r.type === '결과' ? getColor(r.value) : '#eee',
                color: r.type === '결과' ? 'white' : getColor(r.value),
                padding: '4px 6px',
                marginRight: '4px',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}>
                {r.value.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div style={{ margin: '10px 0' }}>
          <button onClick={() => handleAddResult('p')} style={{ backgroundColor: 'skyblue', marginRight: '10px' }}>관망 P</button>
          <button onClick={() => handleAddResult('b')} style={{ backgroundColor: 'salmon', marginRight: '10px' }}>관망 B</button>
          <button onClick={() => handleAddResult('t')} style={{ backgroundColor: 'lightgreen' }}>관망 T</button>
        </div>

        <div>
          <button onClick={() => handleEntry('p', 1)} style={{ backgroundColor: 'blue', color: 'white', marginRight: '5px' }}>P 1단계</button>
          <button onClick={() => handleEntry('b', 1)} style={{ backgroundColor: 'red', color: 'white', marginRight: '5px' }}>B 1단계</button>
          <button onClick={() => handleEntry('p', 2)} style={{ backgroundColor: 'blue', color: 'white', marginRight: '5px' }}>P 2단계</button>
          <button onClick={() => handleEntry('b', 2)} style={{ backgroundColor: 'red', color: 'white', marginRight: '5px' }}>B 2단계</button>
          <button onClick={() => handleEntry('p', 3)} style={{ backgroundColor: 'blue', color: 'white', marginRight: '5px' }}>P 3단계</button>
          <button onClick={() => handleEntry('b', 3)} style={{ backgroundColor: 'red', color: 'white' }}>B 3단계</button>
        </div>

        <div style={{ marginTop: '10px' }}>
          <button onClick={handleWin} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>이김</button>
          <button onClick={handleLose} style={{ backgroundColor: 'black', color: 'white' }}>짐</button>
        </div>
      </div>

      <div style={{ flex: 0.4, marginLeft: '30px' }}>
        <h4>📊 통계</h4>
        <p>시드: {seed.toLocaleString()} 원</p>
        <p>수익: {profit.toLocaleString()} 원</p>
        <p>콤프: {comp.toFixed(2)}</p>
        <p>승: {wins} / 패: {fails}</p>

        <h4>⚙️ 설정</h4>
        <label>시드머니: </label>
        <input type="number" value={seed} onChange={e => setSeed(parseInt(e.target.value))} /><br/>
        <label>콤프 요율 (%): </label>
        <input type="number" step="0.01" value={compPerRoutine} onChange={(e) => setCompPerRoutine(parseFloat(e.target.value))} /><br/>
        <label>Step1: </label>
        <input type="number" value={step1} onChange={e => setStep1(parseInt(e.target.value))} /><br/>
        <label>Step2: </label>
        <input type="number" value={step2} onChange={e => setStep2(parseInt(e.target.value))} /><br/>
        <label>Step3: </label>
        <input type="number" value={step3} onChange={e => setStep3(parseInt(e.target.value))} />
      </div>
    </div>
  );
}
