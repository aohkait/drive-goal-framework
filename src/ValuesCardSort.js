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
  // COMPONENT: A single value card
  const ValueCard = ({ value, showButtons = true }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, value)}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        if (e.target.closest && e.target.closest('button')) return;
        setSelectedValue(prev => prev === value ? null : value);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: '10px 12px',
        margin: '8px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        border: selectedValue === value ? '2px solid #0479da' : '2px solid #ddd',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'manipulation',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        position: 'relative'
      }}>
      <div style={{ fontWeight: 'bold', marginRight: '12px', flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      {showButtons && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => moveValue(value, 'essential')}
            aria-label={`Mark ${value} essential`}
            style={{
              padding: '6px 8px',
              fontSize: '12px',
              backgroundColor: '#0936d6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              minWidth: '56px'
            }}
          >
            E
          </button>
          <button
            onClick={() => moveValue(value, 'important')}
            aria-label={`Mark ${value} important`}
            style={{
              padding: '6px 8px',
              fontSize: '12px',
              backgroundColor: '#0479da',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              minWidth: '56px'
            }}
          >
            I
          </button>
          <button
            onClick={() => moveValue(value, 'notPriority')}
            aria-label={`Mark ${value} not priority`}
            style={{
              padding: '6px 8px',
              fontSize: '12px',
              backgroundColor: '#989898',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              minWidth: '56px'
            }}
          >
            N
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