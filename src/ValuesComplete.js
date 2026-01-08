import React, { useState } from 'react';

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
  
    const [draggedValue, setDraggedValue] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);

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
        setStep(1);
    };

    // STEP 2 Functions
    const toggleTop10 = (value) => {
        if (top10.includes(value)) {
        setTop10(top10.filter(v => v !== value));
        } else {
        if (top10.length < 10) {
            setTop10([...top10, value]);
        } else {
            alert('You can only select 10 values.');
        }
        }
    };

    // STEP 3 Functions
    const toggleTop5 = (value) => {
        if (top5.includes(value)) {
        setTop5(top5.filter(v => v !== value));
        } else {
        if (top5.length < 5) {
            setTop5([...top5, value]);
        } else {
            alert('You can only select 5 values.');
        }
        }
    };

    // STEP 4 Functions
    const updateExplanation = (value, explanation) => {
        setValueExplanations({
        ...valueExplanations,
        [value]: explanation
        });
    }

    // Drag & Drop Handlers
      // When user starts dragging a card
  const handleDragStart = (e, value) => {
    setDraggedValue(value);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', value);
    } catch (err) {
      // some browsers may throw on setData for custom types
    }

    // Create a nicer drag image to make dragging feel natural
    const dragImage = e.currentTarget.cloneNode(true);
    dragImage.style.boxShadow = '0 8px 20px rgba(0,0,0,0.18)';
    dragImage.style.transform = 'scale(1.02)';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    document.body.appendChild(dragImage);
    try {
      e.dataTransfer.setDragImage(dragImage, 20, 20);
    } catch (err) {
      // ignore if browser doesn't support setDragImage
    }
    // remove the temporary drag image on next tick
    setTimeout(() => {
      if (dragImage && dragImage.parentNode) dragImage.parentNode.removeChild(dragImage);
    }, 0);

    // Make the card slightly transparent while dragging and change cursor
    e.currentTarget.style.opacity = '0.5';
    e.currentTarget.style.cursor = 'grabbing';
  };

  // When dragging ends
  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.cursor = 'grab';
    setDraggedValue(null);
  };

  // When dragging over a drop zone (category)
  const handleDragOver = (e) => {
    e.preventDefault(); // This is required to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  // When entering a drop zone
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#f0f7ff';
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.transition = 'transform 0.12s ease, background-color 0.12s ease';
  };

  // When leaving a drop zone
  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = '';
    e.currentTarget.style.transform = '';
  };

  // When dropping in a category
  const handleDrop = (e, category) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '';
    
    if (draggedValue) {
      moveValue(draggedValue, category);
    }
  };

  // COMPONENTS
  const ValueCard = ({ value, showButtons = true, miniButtons = false }) => (
    <div 
      //draggable 
      onDragStart={(e) => handleDragStart(e, value)}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        if (e.target.closest && e.target.closest('button')) return;
        setSelectedValue(prev => prev === value ? null : value);
      }}

      style={{
        padding: '12px',
        margin: '8px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        border: selectedValue === value ? '2px solid #0479da' : '2px solid #ddd',
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
    <div 
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, categoryKey)}
      onClick={() => {
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
            <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'unsorted')}
                style={{
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
            Continue to Narrow Down (Essential: {essential.length} values)
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
            onClick={() => toggleTop10(value)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => setStep(1)} style={navButtonStyle('#9E9E9E')}>
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
            onClick={() => toggleTop5(value)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => setStep(2)} style={navButtonStyle('#9E9E9E')}>
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
        <h2 style={{ marginTop: 0, color: '#FF9800' }}>
          Why These Values Matter to You
        </h2>
        <p style={{ color: '#666' }}>
          For each of your top 5 values, explain why it's important to you. 
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
          <h3 style={{ marginTop: 0, color: '#FF9800' }}>
            {index + 1}. {value}
          </h3>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px' }}>
            Why does this value matter to you?
          </label>
          <textarea
            value={valueExplanations[value] || ''}
            onChange={(e) => updateExplanation(value, e.target.value)}
            placeholder="Example: Family matters to me because spending time with loved ones brings me joy and grounds me in what's truly important..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
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