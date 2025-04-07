
import { useState } from 'react';

export default function App() {
  const [manualInput, setManualInput] = useState('');
  const [decision, setDecision] = useState('');

  const analyzeRecent = () => {
    const sequence = manualInput.trim().toLowerCase().replace(/[^pb]/g, '').slice(-20);
    if (sequence.length < 6) {
      setDecision('데이터 부족: 최소 6회 이상 필요');
      return;
    }

    const count = { bb: 0, pp: 0, bp: 0, pb: 0 };
    for (let i = 0; i < sequence.length - 1; i++) {
      const pair = sequence[i] + sequence[i + 1];
      if (count[pair] !== undefined) count[pair]++;
    }

    let recommendation = '';
    let reason = '';

    if (count.bb > count.pp && count.bb > count.pb) {
      recommendation = 'P';
      reason = '최근 BB 패턴 우세 → 플레이어 진입 추천';
    } else if (count.pp > count.bb && count.pp > count.bp) {
      recommendation = 'B';
      reason = '최근 PP 패턴 우세 → 뱅커 진입 추천';
    } else {
      recommendation = '관망';
      reason = '패턴 균형 or 불분명 → 관망 권장';
    }

    setDecision(`AI 추천: ${recommendation} | 이유: ${reason}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🧠 Baccarat Flow AI 예측</h2>
      <p>최근 10~20회 결과 (예: pbpbppbbpb...)</p>
      <textarea
        rows="2"
        value={manualInput}
        onChange={(e) => setManualInput(e.target.value)}
        style={{ width: '100%', fontSize: '16px' }}
      />
      <button onClick={analyzeRecent} style={{ marginTop: '10px' }}>
        AI 진입 추천 분석
      </button>
      <div style={{ marginTop: '20px', fontWeight: 'bold', color: 'darkgreen' }}>{decision}</div>
    </div>
  );
}
