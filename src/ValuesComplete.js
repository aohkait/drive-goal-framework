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
    const [showInstructions, setShowInstructions] = useState(false);
    const [showCategory, setShowCategory] = useState(false);

    const [top10, setTop10] = useState([]);
    const [top5, setTop5] = useState([]);
    const [valueExplanations, setValueExplanations] = useState({});
    const [valueDefinitions, setValueDefinitions] = useState({});
    const [valuesReactions, setValuesReactions] = useState({});
  
    const [selectedValue, setSelectedValue] = useState(null);

    const STORAGE_KEY = 'drive_values_v1';

    // Colors
    const [colorEssential] = useState('#029073ff');
    const [colorImportant] = useState('#03CEA4ff');
    const [colorNotPriority] = useState('#ABABABff');
    const [colorUnsorted] = useState('#e0e0e0ff');
    const [colorTop10] = useState('#CDF5EDff');
    const [colorTop5] = useState('#68E2C8ff'); 
    const [colorSelected] = useState('#03CEA4ff');
    const [colorNavBack] = useState('#9E9E9E');
    const [colorNavNext] = useState('#03CEA4ff');
    const [colorHeaders] = useState('#029073ff');
    const [colorWhitePoint] = useState('#fefefe');
    const [colorBlackPoint] = useState('#000000');
    const [colorNeutralLight] = useState('#D9D9D9');
    const [colorNeutralDark] = useState('#424242');
    const [colorNeutralMedium] = useState('#828282');


    // Alert/Prompt system
    const [dialog, setDialog] = useState(null);

    const showDialog = (opts) => {
      return new Promise((resolve) => {
        setDialog({ ...opts, resolve });
      });
    };
    const showAlert = async (message, title) => {
      await showDialog({ type: 'alert', message, title });
    };
    const showPrompt = async (message, defaultValue = '') => {
      const result = await showDialog({ type: 'prompt', message, defaultValue });
      // resolve will return null on cancel, or the string on submit
      return result;
    };

    // Convert string to Title Case
    const toTitleCase = (str) => {
      return String(str)
        .split(/\s+/)
        .map(w => w ? (w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : '')
        .join(' ')
        .trim();
    };

    // Choice dialog helper (renders radio buttons)
    const showChoice = async (message, options = [], defaultValue = '') => {
      const result = await showDialog({ type: 'choice', message, options, defaultValue });
      return result;
    };

    // Escape HTML for safe printing
    const escapeHtml = (unsafe) => {
      if (unsafe == null) return '';
      return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    // Print HTML in a new window (user can save as PDF via browser Print dialog)
    const printHtml = (html, title = 'My Values Summary') => {
      try {
        const w = window.open('', '_blank');
        if (!w) {
          // fallback: alert via dialog system
          showAlert('Popup blocked. Please allow popups to print or export the summary.');
          return;
        }
        const stylesheet = `body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding:20px; color:#222} h1,h2,h3{color:${colorHeaders}} .value{margin-bottom:18px} .meta{color:#444}`;
        w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${stylesheet}</style></head><body>${html}</body></html>`);
        w.document.close();
        w.focus();
        // Wait a tick to allow resources to render, then print
        setTimeout(() => {
          w.print();
        }, 250);
      } catch (err) {
        console.warn('Print failed', err);
        showAlert('Unable to open print window: ' + (err && err.message));
      }
    };

    // Show a structured summary modal for the top values and reflections
    const showSummary = async (title, valuesArray) => {
      // build HTML summary
      const parts = valuesArray.map(v => {
        const def = escapeHtml(valueDefinitions[v] || '—');
        const expl = escapeHtml(valueExplanations[v] || '—');
        return `<div class="value"><h3>${escapeHtml(v)}</h3><p class="meta"><strong>Definition:</strong></p><p>${def}</p><p class="meta"><strong>Why it matters:</strong></p><p>${expl}</p></div>`;
      }).join('');

      const surprises = escapeHtml(valuesReactions.Surprises || '');
      const patterns = escapeHtml(valuesReactions.Patterns || '');
      const reflections = `<div style="margin-top:18px"><h3>Reflections</h3><p><strong>Surprises:</strong> ${surprises}</p><p><strong>Patterns:</strong> ${patterns}</p></div>`;

      const html = `<div><h1>${escapeHtml(title)}</h1>${parts}${reflections}</div>`;

      await showDialog({ type: 'summary', title, summaryHtml: html });
    };

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
        setShowInstructions(false);
        setShowCategory(false);
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    };

    const addValue = () => {
        (async () => {
          const newValue = await showPrompt('Enter the name of the new value:');
          if (!newValue) return;
          const nameRaw = newValue.trim();
          if (!nameRaw) return;
          const name = toTitleCase(nameRaw);

          // case-insensitive duplicate check across all lists
          const allValues = [...essential, ...important, ...notPriority, ...unsorted];
          const exists = allValues.some(v => v && v.toLowerCase() === name.toLowerCase());
          if (exists) {
            await showAlert('That value already exists.');
            return;
          }

          // present a radio-choice modal for category selection
          const categoryOptions = [
            { value: 'essential', label: 'Essential' },
            { value: 'important', label: 'Important' },
            { value: 'notPriority', label: 'Not Priority' },
            { value: 'unsorted', label: 'Unsorted' },
          ];

          const chosen = await showChoice('Choose a category for the new value:', categoryOptions, 'unsorted');
          const cat = (chosen || 'unsorted');

          if (cat === 'essential') setEssential(prev => [...prev, name]);
          else if (cat === 'important') setImportant(prev => [...prev, name]);
          else if (cat === 'notPriority') setNotPriority(prev => [...prev, name]);
          else setUnsorted(prev => [...prev, name]);
        })();
    }

    // STEP 2 Functions
  const toggleTop10 = (value) => {
    if (top10.includes(value)) {
      setTop10(top10.filter(v => v !== value));
    } else if (top10.length < 10) {
      setTop10([...top10, value]);
    } else {
      showAlert('You can only select 10 values.');
    }
  };

    // STEP 3 Functions
  const toggleTop5 = (value) => {
    if (top5.includes(value)) {
      setTop5(top5.filter(v => v !== value));
    } else if (top5.length < 5) {
      setTop5([...top5, value]);
    } else {
      showAlert('You can only select 5 values.');
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
        const updateReflection = (section, explanation) => {
        setValuesReactions({
            ...valuesReactions,
            [section]: explanation
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
        backgroundColor: top5.includes(value) ? colorTop5 : top10.includes(value) ? colorTop10 : colorWhitePoint,
        borderRadius: '4px',
        border: selectedValue === value ? `2px solid ${colorSelected}` : top5.includes(value) ? `2px solid ${colorTop5}` : top10.includes(value) ? `2px solid ${colorTop10}` : `2px solid ${colorNeutralMedium}`,
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
            style={buttonStyle(colorEssential)}
          >
            Essential
          </button>
          <button
            onClick={() => moveValue(value, 'important')}
            style={buttonStyle(colorImportant)}
          >
            Important
          </button>
          <button
            onClick={() => moveValue(value, 'notPriority')}
            style={buttonStyle(colorNotPriority)}
          >
            Not Priority
          </button>
        </div>
      )}
      {miniButtons && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => moveValue(value, 'essential')}
            style={buttonStyle(colorEssential)}
          >
          </button>
          <button
            onClick={() => moveValue(value, 'important')}
            style={buttonStyle(colorImportant)}
          >
          </button>
          <button
            onClick={() => moveValue(value, 'notPriority')}
            style={buttonStyle(colorNotPriority, true)}
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
    <div onClick={(e) => {
        if (e.target.closest && e.target.closest('button')) return;
        if (selectedValue) {
          moveValue(selectedValue, categoryKey);
          setSelectedValue(null);
        }
      }}
      style={{
        flex: 1,
        minWidth: '250px',
        padding: '16px',
        backgroundColor: colorWhitePoint,
        borderRadius: '4px',
        border: `3px solid ${color}`,
        margin: '8px'
    }}>
      <h3 style={{ color: color, marginTop: 0 }}>
        {title} ({values.length})
      </h3>
      <button
        onClick={() => { 
            setShowCategory(prev => !prev); 
        }}
        style={{
            padding: '4px 8px',
            backgroundColor: colorNavBack,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        }}
        >
        {showCategory ? 'Hide All Values ▲' : 'Show All Values ▾'}
      </button>
      {showCategory && (
      <div>
        {values.map(value => (
          <ValueCard key={value} value={value} showButtons={false} miniButtons={true} />
        ))}
      </div>
      )}
    </div>
  );

  // STEP RENDERS
  const renderStep1 = () => (
    <>
        {unsorted.length > 0 && (
            <div style={{
                padding: '20px',
                backgroundColor: colorWhitePoint,
                borderRadius: '4px',
                marginBottom: '24px',
                border: `1px solid ${colorUnsorted}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
            >
          
                    {/* Reset Button */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
            <h2 style={{ marginTop: 0 }}>Values to Sort ({unsorted.length} remaining)</h2>
            <button
                onClick={() => resetAll()}
                style={{
                    padding: '0px 8px',
                    marginLeft: '12px',
                    maxHeight: '32px',
                    backgroundColor: colorNavBack,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
            Reset All Values
        </button>
        <button style={{             
                padding: '0px 8px',
                marginLeft: '12px',
                maxHeight: '32px',
                backgroundColor: colorHeaders,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer', }} 
            onClick={() => addValue()}>
          Add a Value +
        </button>

    {/* Instructions (collapsible) */}
      <div>
        <button
          onClick={() => setShowInstructions(prev => !prev)}
          style={{
            padding: '0px 8px',
            marginLeft: '12px',
            maxHeight: '32px',
            backgroundColor: colorHeaders,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showInstructions ? 'Hide Instructions ▲' : 'How to use ▾'}
        </button>

        {showInstructions && (
          <div style={{
            margin: '12px',
            padding: '16px',
            backgroundColor: colorTop10,
            borderRadius: '4px',
            border: '2px solid colorHeaders'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: colorBlackPoint }}>
              💡 How to use:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: colorNeutralDark }}>
              <li>Click on the category button to move each card.</li>
              <li>Use the colored square to move values between categories.</li>
              <li>You can also click to select a card and then click the category box below.</li>
            </ul>
          </div>
        )}
        

      </div></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', cursor: 'pointer'}}>
        <Category
          title="Essential to Me"
          values={essential}
          color={colorEssential}
          categoryKey="essential"
        />
        <Category
          title="Important to Me"
          values={important}
          color={colorImportant}
          categoryKey="important"
        />
        <Category
          title="Not Priority Right Now"
          values={notPriority}
          color={colorNotPriority}
          categoryKey="notPriority"
        />
      </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {unsorted.map(value => (
              <ValueCard key={value} value={value} />
            ))}
          </div>
        </div>
      )}



      {unsorted.length === 0 && essential.length > 0 && (
        
        <div 
        style={{
                padding: '20px',
                backgroundColor: colorWhitePoint,
                borderRadius: '4px',
                marginBottom: '24px',
                border: `1px solid ${colorUnsorted}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                                {/* Reset Button */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
            <h2 style={{ marginTop: 0 }}>Values to Sort ({unsorted.length} remaining)</h2>
            <button
                onClick={() => resetAll()}
                style={{
                    padding: '0px 8px',
                    maxHeight: '32px',
                    backgroundColor: colorNavBack,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
            Reset All Values
        </button>
        </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', cursor: 'pointer'}}>
        <Category
          title="Essential to Me"
          values={essential}
          color={colorEssential}
          categoryKey="essential"
        />
        <Category
          title="Important to Me"
          values={important}
          color={colorImportant}
          categoryKey="important"
        />
        <Category
          title="Not Priority Right Now"
          values={notPriority}
          color={colorNotPriority}
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
              backgroundColor: colorNavNext,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              display: 'block',
              margin: '0 auto'
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
        backgroundColor: colorWhitePoint,
        padding: '24px',
        borderRadius: '4px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: colorNavNext }}>
          Select Your Top 10 Values
        </h2>
        <p style={{ color: colorNeutralDark }}>
          Starting with your {essential.length} essential values, choose the 10 that matter most. 
          If you have fewer than 10 essential values, select all of them, and then choose from your Important values next.
          <br /><br />Click to select/deselect. ({top10.length}/10 selected)
        </p>
      </div>

      <div style={{        
        border: `2px solid ${colorEssential}`,
        borderRadius: '4px',
        marginBottom: '24px',
      }}>
        <h3 style={{ marginTop: '8px', color: colorEssential, textAlign: 'center'}}>Essential</h3>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {essential.map(value => (
          <ValueCard
            key={value}
            value={value}
            selected={top10.includes(value)}
            showButtons={false}
        />
        ))}
      </div></div>
            <div style={{        
        border: `2px solid ${colorImportant}`,
        borderRadius: '4px',
        marginBottom: '24px',
      }}>
        <h3 style={{ marginTop: '8px', color: colorImportant, textAlign: 'center'}}>Important</h3>
            <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {important.map(value => (
          <ValueCard
            key={value}
            value={value}
            selected={top10.includes(value)}
            showButtons={false}
        />
        ))}
      </div></div>
            <div style={{        
        border: `2px solid ${colorNotPriority}`,
        borderRadius: '4px',
        marginBottom: '24px',
      }}>
        <h3 style={{ marginTop: '8px', color: colorNotPriority, textAlign: 'center'}}>Not Priority</h3>
            <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {notPriority.map(value => (
          <ValueCard
            key={value}
            value={value}
            selected={top10.includes(value)}
            showButtons={false}
        />
        ))}
      </div></div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => { setStep(1); setTop10([]); }} style={navButtonStyle(colorNavBack)}>
          ← Back to Sorting
        </button>
        {top10.length === 10 && (
          <button
            onClick={() => {
              setTop5([]);
              setStep(3);
            }}
            style={navButtonStyle(colorNavNext)}
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
        backgroundColor: colorWhitePoint,
        padding: '24px',
        borderRadius: '4px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: colorHeaders }}>
        Select Your Top 5 Values
        </h2>
        <p style={{ color: colorNeutralDark }}>
          From your top 10, choose the 5 that matter most to you. 
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
        <button onClick={() => { setStep(2); setTop5([]); }} style={navButtonStyle(colorNavBack)}>
          ← Back to Top 10
        </button>
        {top5.length === 5 && (
          <button onClick={() => setStep(4)} style={navButtonStyle(colorNavNext)}>
            Explain Your Values →
          </button>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: colorWhitePoint,
        padding: '24px',
        borderRadius: '4px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: colorHeaders }}>
          Why These Values Matter to You
        </h2>
        <p style={{ color: colorNeutralDark }}>
          For each of your top 5 values, define what the value means to you, 
          and then explain why it's in your top 5. 
          This deepens your understanding and will guide your goal-setting.
        </p>
      </div>

      {top5.map((value, index) => (
        <div
          key={value}
          style={{
            backgroundColor: colorWhitePoint,
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <h3 style={{ marginTop: 0, color: colorHeaders }}>
            {index + 1}. {value}
          </h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
            <label style={{ marginBottom: '8px', color: colorNeutralDark, fontSize: '14px' }}>
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
              borderRadius: '4px',
              border: `2px solid ${colorNeutralLight}`,
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          /></div>
          <div style={{ flex: 1 }}>
          <label style={{ marginBottom: '8px', color: colorNeutralDark, fontSize: '14px' }}>
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
              borderRadius: '4px',
              border: `2px solid ${colorNeutralLight}`,
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          /></div>
          </div>
        </div>
        ))}
        <div 
              style={{
            backgroundColor: colorWhitePoint,
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
        >
            <h3 style={{ marginTop: 0, color: colorHeaders }}>
            Reflections
          </h3>
          <div style={{ flex: 1 }}>
          <label style={{ marginBottom: '8px', color: colorNeutralDark, fontSize: '14px' }}>
            What surprised you from this exercise?
          </label>
          <textarea
            onChange={(e) => updateReflection('Surprises')}
            placeholder="Example: I was not expecting to see both 'Creativity' and 'Stability' in my top 5 values, but it makes sense that I value both innovation and a solid foundation..."
            style={{
              width: '90%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '4px',
              border: `2px solid ${colorNeutralLight}`,
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          /></div>
                    <div style={{ flex: 1 }}>
          <label style={{ marginBottom: '8px', color: colorNeutralDark, fontSize: '14px' }}>
            What patterns did you notice about your values?
          </label>
          <textarea
            onChange={(e) => updateReflection('Patterns')}
            placeholder="Example: I noticed that many of my top values revolve around connection and growth, indicating that I prioritize relationships and personal development..."
            style={{
              width: '90%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '4px',
              border: `2px solid ${colorNeutralLight}`,
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          /></div>
          </div>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
        <button onClick={() => setStep(3)} style={navButtonStyle(colorNavBack)}>
          ← Back to Top 5
        </button>
        <button
          onClick={() => {
            (async () => {
              const title = 'My Values Summary';
              await showSummary(title, top5.slice(0, 5));
            })();
          }}
          style={navButtonStyle(colorNavNext)}
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
    borderRadius: '4px',
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
      backgroundColor: colorWhitePoint,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: colorTop10,
        padding: '24px',
        borderRadius: '4px',
        marginBottom: '24px',
       // boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: colorNeutralDark }}>
          DRIVE: D-1 Define Your Values
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
                height: step === s ? '16px' : '8px',
                backgroundColor: step >= s ? colorHeaders : colorWhitePoint,
                borderRadius: '4px',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: colorNeutralDark }}>
          <span style={{ fontWeight: step === 1 ? 'bold' : 'normal', color: step === 1 ? colorHeaders : colorNeutralDark }}>
            1. Initial Sort
          </span>
          <span style={{ fontWeight: step === 2 ? 'bold' : 'normal', color: step === 2 ? colorHeaders : colorNeutralDark }}>
            2. Top 10
          </span>
          <span style={{ fontWeight: step === 3 ? 'bold' : 'normal', color: step === 3 ? colorHeaders : colorNeutralDark }}>
            3. Top 5
          </span>
          <span style={{ fontWeight: step === 4 ? 'bold' : 'normal', color: step === 4 ? colorHeaders : colorNeutralDark }}>
            4. Reflect
          </span>
        </div>
      </div>

      {/* Render current step */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      {/* Dialog modal */}
      {dialog && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 9999 }}>
          <div style={{ width: 'min(90%,600px)', background: colorWhitePoint, borderRadius: 8, padding: 20, boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}>
            {dialog.title && <h3 style={{ marginTop: 0 }}>{dialog.title}</h3>}
            <div style={{ margin: '12px 0', color: colorNeutralDark }}>{dialog.message}</div>
            {dialog.type === 'prompt' && (
              <input
                autoFocus
                defaultValue={dialog.defaultValue || ''}
                onChange={(e) => { dialog._temp = e.target.value; }}
                style={{ width: '100%', padding: '8px', borderRadius: 6, border: `1px solid ${colorNeutralLight}`, marginBottom: 12 }}
              />
            )}

            {dialog.type === 'choice' && (
              <div style={{ marginBottom: 12 }}>
                {(dialog.options || []).map((opt) => {
                  const val = typeof opt === 'string' ? opt : opt.value;
                  const label = typeof opt === 'string' ? opt : opt.label;
                  const checked = (typeof dialog._temp !== 'undefined' ? dialog._temp : (dialog.defaultValue || '')) === val;
                  return (
                    <label key={val} style={{ display: 'block', marginBottom: 8 }}>
                      <input
                        type="radio"
                        name="dialogChoice"
                        defaultChecked={checked}
                        onChange={() => { dialog._temp = val; }}
                        style={{ marginRight: 8 }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            )}
            {dialog.type === 'summary' && (
              <div style={{ maxHeight: '60vh', overflow: 'auto', marginBottom: 12 }}>
                <div dangerouslySetInnerHTML={{ __html: dialog.summaryHtml || '' }} />
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              {(dialog.type === 'prompt' || dialog.type === 'choice') && (
                <button onClick={() => { dialog.resolve(null); setDialog(null); }} style={{ padding: '8px 12px', background: '#eee', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
              )}

              {dialog.type === 'summary' && (
                <button onClick={() => { printHtml(dialog.summaryHtml || '', dialog.title || 'Values Summary'); }} style={{ padding: '8px 12px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' }}>Print / Save PDF (Opens new tab)</button>
              )}

              <button onClick={() => {
                if (dialog.type === 'prompt') {
                  const v = typeof dialog._temp !== 'undefined' ? dialog._temp : (dialog.defaultValue || '');
                  dialog.resolve(v);
                } else if (dialog.type === 'choice') {
                  const v = typeof dialog._temp !== 'undefined' ? dialog._temp : (dialog.defaultValue || null);
                  dialog.resolve(v);
                } else {
                  dialog.resolve(true);
                }
                setDialog(null);
              }} style={{ padding: '8px 12px', background: colorHeaders, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{dialog.type === 'prompt' || dialog.type === 'choice' ? 'OK' : 'Close'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValuesComplete;