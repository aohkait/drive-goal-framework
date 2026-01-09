import React, { useState, useEffect } from 'react';

const VALUES_LIST = [  'Achievement', 'Adventure', 'Authenticity', 'Balance', 'Compassion',
  'Creativity', 'Curiosity', 'Family', 'Finances', 'Freedom', 'Friendship',
  'Fun', 'Growth', 'Health', 'Honesty', 'Independence', 'Innovation',
  'Integrity', 'Justice', 'Kindness', 'Knowledge', 'Leadership', 'Learning',
  'Love', 'Loyalty','Nature', 'Peace', 'Recognition', 'Respect', 'Security',
  'Service', 'Simplicity','Spirituality', 'Stability', 'Success', 'Tradition',
  'Variety', 'Wellness', 'Wisdom'
];

function ValuesComplete() {
    
  React.useEffect(() => {    
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedValue(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

    const [step, setStep] = useState(1);

    const [essential, setEssential] = useState([]);
    const [important, setImportant] = useState([]);
    const [notPriority, setNotPriority] = useState([]);
    const [unsorted, setUnsorted] = useState([...VALUES_LIST]);

    const [top10, setTop10] = useState([]);
    const [top5, setTop5] = useState([]);
    const [valueExplanations, setValueExplanations] = useState({});
    const [valueDefinitions, setValueDefinitions] = useState({});
  
    const [selectedValue, setSelectedValue] = useState(null);

    const STORAGE_KEY = 'drive_values_v1';

    // Load saved state on mount
    useEffect(() => {
      try {
        if (typeof window === 'undefined') return;
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!data) return;
        if (Array.isArray(data.essential)) setEssential(data.essential);
        if (Array.isArray(data.important)) setImportant(data.important);
        if (Array.isArray(data.notPriority)) setNotPriority(data.notPriority);
        if (Array.isArray(data.unsorted)) setUnsorted(data.unsorted);
        if (Array.isArray(data.top10)) setTop10(data.top10);
        if (Array.isArray(data.top5)) setTop5(data.top5);
        if (data.valueExplanations && typeof data.valueExplanations === 'object') setValueExplanations(data.valueExplanations);
        if (data.valueDefinitions && typeof data.valueDefinitions === 'object') setValueDefinitions(data.valueDefinitions);
        if (typeof data.step === 'number') setStep(data.step);
      } catch (err) {
        console.warn('Failed to load saved values:', err);
      }
    }, []);

    // Persist state (debounced)
    useEffect(() => {
      if (typeof window === 'undefined') return;
      const payload = {
        version: 1,
        step,
        essential,
        important,
        notPriority,
        unsorted,
        top10,
        top5,
        valueExplanations,
        valueDefinitions
      };
      const id = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (err) {
          console.warn('Failed to save values:', err);
        }
      }, 250);

      return () => clearTimeout(id);
    }, [step, essential, important, notPriority, unsorted, top10, top5, valueExplanations, valueDefinitions]);

    // STEP 1 Functions
  const moveValue = (value, toCategory) => {
    // Remove the value from all lists (use functional updates to avoid stale closures)
    setEssential(prev => prev.filter(v => v !== value));
    setImportant(prev => prev.filter(v => v !== value));
    setNotPriority(prev => prev.filter(v => v !== value));
    setUnsorted(prev => prev.filter(v => v !== value));



    // Add to the chosen category (also using functional updates)
    if (toCategory === 'essential') {
      setEssential(prev => [...prev.filter(v => v !== value), value]);
    } else if (toCategory === 'important') {
      setImportant(prev => [...prev.filter(v => v !== value), value]);
    } else if (toCategory === 'notPriority') {
      setNotPriority(prev => [...prev.filter(v => v !== value), value]);
    } else if (toCategory === 'unsorted') {
      setUnsorted(prev => [...prev.filter(v => v !== value), value]);
    }
  };

    const resetAll = () => {
        setEssential([]);
        setImportant([]);
        setNotPriority([]);
        setUnsorted([...VALUES_LIST]);
        setTop10([]);
        setTop5([]);
        setValueExplanations({});
        setValueDefinitions({});
        setStep(1);
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    };

    // STEP 2 Functions
  const toggleTop10 = (value) => {
    if (top10.includes(value)) {
      setTop10(top10.filter(v => v !== value));
    } else if (top10.length < 10) {
      setTop10([...top10, value]);
    } else {
      alert('You can only select 10 values.');
    }
  };

    // STEP 3 Functions
  const toggleTop5 = (value) => {
    if (top5.includes(value)) {
      setTop5(top5.filter(v => v !== value));
    } else if (top5.length < 5) {
      setTop5([...top5, value]);
    } else {
      alert('You can only select 5 values.');
    }
  };

    // STEP 4 Functions
    const updateExplanation = (value, explanation) => {
        setValueExplanations({
        ...valueExplanations,
        [value]: explanation
        });
    };
        const updateDefinitions = (value, definition) => {
        setValueDefinitions({
        ...valueDefinitions,
        [value]: definition
        });
    };
  // COMPONENTS
  const ValueCard = ({ value, showButtons = true, miniButtons = false }) => (
    <div onClick={(e) => {
        if (step === 1){
        if (e.target.closest && e.target.closest('button')) return;
        setSelectedValue(prev => prev === value ? null : value);
        } else if (step === 2){
            toggleTop10(value);
        } else if (step === 3){
            toggleTop5(value);
        }
      }}

      style={{
        padding: '12px',
        margin: '8px',
        backgroundColor: top5.includes(value) ? '#63aef5ff' : top10.includes(value) ? '#abd0f3ff' : '#fff',
        borderRadius: '8px',
        border: selectedValue === value ? '2px solid #7ab6e7ff' : '2px solid #ddd',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'manipulation',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease'
        }}
    >
        
      {selectedValue === value}
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{value}</div>
      {showButtons && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => moveValue(value, 'essential')}
            style={buttonStyle('#0936d6')}
          >
            Essential
          </button>
          <button
            onClick={() => moveValue(value, 'important')}
            style={buttonStyle('#0479da')}
          >
            Important
          </button>
          <button
            onClick={() => moveValue(value, 'notPriority')}
            style={buttonStyle('#989898')}
          >
            Not Priority
          </button>
        </div>
      )}
      {miniButtons && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => moveValue(value, 'essential')}
            style={buttonStyle('#0936d6')}
          >
          </button>
          <button
            onClick={() => moveValue(value, 'important')}
            style={buttonStyle('#0479da')}
          >
          </button>
          <button
            onClick={() => moveValue(value, 'notPriority')}
            style={buttonStyle('#989898',true)}
          >
          </button>
        </div>
      )}
    </div>
  );

  const buttonStyle = (color, mini) => ({
    padding: '4px 8px',
    fontSize: '11px',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    minHeight: mini ? '16px' : 'auto'
  });

    const Category = ({ title, values, color, categoryKey }) => (
    <div onClick={() => {
        if (selectedValue) {
          moveValue(selectedValue, categoryKey);
          setSelectedValue(null);
        }
      }}
      style={{
        flex: 1,
        minWidth: '250px',
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: `3px solid ${color}`,
        margin: '8px'
    }}>
      <h3 style={{ color: color, marginTop: 0 }}>
        {title} ({values.length})
      </h3>
      <div>
        {values.map(value => (
          <ValueCard key={value} value={value} showButtons={false} miniButtons={true} />
        ))}
      </div>
    </div>
  );

  // STEP RENDERS
  const renderStep1 = () => (
    <>
        {unsorted.length > 0 && (
            <div style={{
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '3px dashed #9E9E9E',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
          <h2 style={{ marginTop: 0 }}>Values to Sort ({unsorted.length} remaining)</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', cursor: 'pointer'}}>
        <Category
          title="Essential to Me"
          values={essential}
          color="#0936d6ff"
          categoryKey="essential"
        />
        <Category
          title="Important to Me"
          values={important}
          color="#0479daff"
          categoryKey="important"
        />
        <Category
          title="Not Priority Right Now"
          values={notPriority}
          color="#989898ff"
          categoryKey="notPriority"
        />
      </div>
              {/* Reset Button */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
            <button
                onClick={() => resetAll()}
                style={{
                    padding: '4px 8px',
                    fontSize: '16px',
                    backgroundColor: '#989898',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
            Reset All Values
        </button>
        </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {unsorted.map(value => (
              <ValueCard key={value} value={value} />
            ))}
          </div>
        </div>
      )}



      {unsorted.length === 0 && essential.length > 0 && (
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', cursor: 'pointer'}}>
        <Category
          title="Essential to Me"
          values={essential}
          color="#0936d6ff"
          categoryKey="essential"
        />
        <Category
          title="Important to Me"
          values={important}
          color="#0479daff"
          categoryKey="important"
        />
        <Category
          title="Not Priority Right Now"
          values={notPriority}
          color="#989898ff"
          categoryKey="notPriority"
        />
      </div>
          <button
            onClick={() => {
              setTop10([]);
              setStep(2);
            }}
            style={{
              padding: '16px 32px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            Continue to Choose Top 10 Values
          </button>
        </div>
      )}
    </>
  );

  const renderStep2 = () => (
  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#4CAF50' }}>
          Select Your Top 10 Values
        </h2>
        <p style={{ color: '#666' }}>
          From your {essential.length} essential values, choose the 10 that matter most. 
          Click to select/deselect. ({top10.length}/10 selected)
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {essential.map(value => (
          <ValueCard
            key={value}
            value={value}
            selected={top10.includes(value)}
            showButtons={false}
        />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => setStep(1), setTop10([])} style={navButtonStyle('#9E9E9E')}>
          ← Back to Sorting
        </button>
        {top10.length === 10 && (
          <button
            onClick={() => {
              setTop5([]);
              setStep(3);
            }}
            style={navButtonStyle('#4CAF50')}
          >
            Continue to Top 5 →
          </button>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#2196F3' }}>
          Select Your Top 5 Core Values
        </h2>
        <p style={{ color: '#666' }}>
          These are your most important values - the foundation of your goal-setting. 
          ({top5.length}/5 selected)
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {top10.map(value => (
          <ValueCard
            key={value}
            value={value}
            selected={top5.includes(value)}
            showButtons={false}
        />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => setStep(2), , setTop5([])} style={navButtonStyle('#9E9E9E')}>
          ← Back to Top 10
        </button>
        {top5.length === 5 && (
          <button onClick={() => setStep(4)} style={navButtonStyle('#4CAF50')}>
            Explain Your Values →
          </button>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#0015ffff' }}>
          Why These Values Matter to You
        </h2>
        <p style={{ color: '#666' }}>
          For each of your top 5 values, define what the value means to you, 
          and then explain why it's in your top 5. 
          This deepens your understanding and will guide your goal-setting.
        </p>
      </div>

      {top5.map((value, index) => (
        <div
          key={value}
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <h3 style={{ marginTop: 0, color: '#2b00ffff' }}>
            {index + 1}. {value}
          </h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
            <label style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>
            What does this value mean to you?
          </label>
          <textarea
            value={valueDefinitions[value] || ''}
            onChange={(e) => updateDefinitions(value, e.target.value)}
            placeholder="Example: Family means spending quality time with loved ones..."
            style={{
              width: '90%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          /></div>
          <div style={{ flex: 1 }}>
          <label style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>
            Why does this value matter to you?
          </label>
          <textarea
            value={valueExplanations[value] || ''}
            onChange={(e) => updateExplanation(value, e.target.value)}
            placeholder="Example: Family matters to me because spending time with loved ones brings me joy and grounds me in what's truly important..."
            style={{
              width: '90%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          /></div>
          </div>
        </div>
        ))}

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
        <button onClick={() => setStep(3)} style={navButtonStyle('#9E9E9E')}>
          ← Back to Top 5
        </button>
        <button
          onClick={() => {
            alert('Values complete! Next: Save to LocalStorage (coming in next lesson)');
          }}
          style={navButtonStyle('#4CAF50')}
        >
          Complete Values Exercise ✓
        </button>
      </div>
    </div>
  );

  const navButtonStyle = (color) => ({
    padding: '12px 24px',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  });

  // MAIN RENDER
  return (
    <div style={{
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#333' }}>
          DRIVE Framework - Values Discovery
        </h1>
        
        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '16px',
          marginBottom: '16px'
        }}>
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: step >= s ? '#4CAF50' : '#e0e0e0',
                borderRadius: '4px',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
          <span style={{ fontWeight: step === 1 ? 'bold' : 'normal', color: step === 1 ? '#4CAF50' : '#666' }}>
            1. Sort Values
          </span>
          <span style={{ fontWeight: step === 2 ? 'bold' : 'normal', color: step === 2 ? '#4CAF50' : '#666' }}>
            2. Top 10
          </span>
          <span style={{ fontWeight: step === 3 ? 'bold' : 'normal', color: step === 3 ? '#4CAF50' : '#666' }}>
            3. Top 5
          </span>
          <span style={{ fontWeight: step === 4 ? 'bold' : 'normal', color: step === 4 ? '#4CAF50' : '#666' }}>
            4. Reflect
          </span>
        </div>
      </div>

      {/* Render current step */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
}

export default ValuesComplete;