import React, { useState } from 'react';
const VALUES_LIST = [
  'Achievement', 'Adventure', 'Authenticity', 'Balance', 'Compassion',
  'Creativity', 'Curiosity', 'Family', 'Finances', 'Freedom', 'Friendship',
  'Fun', 'Growth', 'Health', 'Honesty', 'Independence', 'Innovation',
  'Integrity', 'Justice', 'Kindness', 'Knowledge', 'Leadership', 'Learning',
  'Love', 'Loyalty','Nature', 'Peace', 'Recognition', 'Respect', 'Security',
  'Service', 'Simplicity','Spirituality', 'Stability', 'Success', 'Tradition',
  'Variety', 'Wellness', 'Wisdom'
];

function ValuesCardSort() {
  // STATE: This is where we store which category each value is in
  const [essential, setEssential] = useState([]);
  const [important, setImportant] = useState([]);
  const [notPriority, setNotPriority] = useState([]);
  const [unsorted, setUnsorted] = useState([...VALUES_LIST]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [draggedValue, setDraggedValue] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);

  // Allow canceling a selection with Escape
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedValue(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);


  // FUNCTION: Move a value to a category
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
    setShowInstructions(false);
  };

  // DRAG & DROP HANDLERS
  
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

  // COMPONENT: A single value card
  const ValueCard = ({ value, showButtons = true }) => (
    <div 
      draggable // Makes the card draggable
      onDragStart={(e) => handleDragStart(e, value)}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        // don't toggle selection when clicking the card's buttons
        if (e.target.closest && e.target.closest('button')) return;
        setSelectedValue(prev => prev === value ? null : value);
      }}
      style={{
        padding: '12px',
        margin: '8px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        border: selectedValue === value ? '2px solid #0479da' : '2px solid #ddd',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'manipulation',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease'
    }}>
      {selectedValue === value}
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{value}</div>
      {showButtons && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => moveValue(value, 'essential')}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#0936d6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Essential
          </button>
          <button
            onClick={() => moveValue(value, 'important')}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#0479da',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Important
          </button>
          <button
            onClick={() => moveValue(value, 'notPriority')}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#989898',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Not Priority
          </button>
        </div>
      )}
    </div>
  );

  // COMPONENT: A category column
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
          <ValueCard key={value} value={value} showButtons={false} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
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
          DRIVE Framework - Values Card Sort
        </h1>
        <p style={{ color: '#666', margin: '0 0 16px 0' }}>
          Determine if each of the values below is <strong>Essential, Important, or Not a Priority Right Now.</strong> 
        </p>

     {/* Instructions (collapsible) */}
      <div style={{ marginTop: '24px' }}>
        <button
          onClick={() => setShowInstructions(prev => !prev)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#0936d6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {showInstructions ? 'Hide Instructions ▲' : 'How to use ▾'}
        </button>

        {showInstructions && (
          <div style={{
            marginTop: '12px',
            padding: '16px',
            backgroundColor: '#e0f4ffff',
            borderRadius: '8px',
            border: '2px solid #0479daff'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#0936d6ff' }}>
              💡 How to use:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
              <li>Drag and drop each value into the categories below.</li>
              <li>Use the card buttons for quick sorting.</li>
              <li>Move values between categories to reorganize.</li>
              <li>You can also click a card to select and then click the category or use the buttons below each value.</li>
            </ul>
          </div>
        )}

      </div>

      </div>

      {/* Sorted categories */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px'}}>
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

      {/* Unsorted values section */}
      {unsorted.length > 0 && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h2>Values to Sort ({unsorted.length} remaining)</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {unsorted.map(value => (
              <ValueCard key={value} value={value} />
            ))}
          </div>
        </div>
      )}


      {/* Progress Indicator */}
      {unsorted.length === 0 && (
        <div style={{
          padding: '20px',
          backgroundColor: '#E8F5E9',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#4CAF50', margin: '0 0 8px 0' }}>
            ✓ All values sorted!
          </h3>
          <p style={{ margin: 0, color: '#666' }}>
            Next step: Review your essential values and narrow down to your top 5.
          </p>
        </div>
      )}

      </div>
    
  );
}

export default ValuesCardSort;