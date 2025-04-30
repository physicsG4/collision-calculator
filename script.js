const massUnits = {
    "kg": 1,
    "g": 0.001,
    "mg": 0.000001,
    "lb": 0.453592,
    "oz": 0.0283495,
    "tonne": 1000,
    "amu": 1.66053906660e-27
  };
  
  const velocityUnits = {
    "m/s": 1,
    "km/h": 1 / 3.6,
    "mph": 0.44704,
    "ft/s": 0.3048
  };
  
  const collisionTypeSelect = document.getElementById('collision-type');
  const formulaBox = document.querySelector('.formula-box');
  
  function updateFormula() {
    const type = collisionTypeSelect.value;
    if (type === 'Perfectly Inelastic') {
      formulaBox.textContent = 'm₁v₁ + m₂v₂ = (m₁ + m₂)v';
    } else if (type === 'Perfectly Elastic') {
      formulaBox.innerHTML = `
        v′₁ = [(m₁ - m₂) / (m₁ + m₂)]v₁ + [2m₂ / (m₁ + m₂)]v₂<br>
        v′₂ = [2m₁ / (m₁ + m₂)]v₁ + [(m₂ - m₁) / (m₁ + m₂)]v₂
      `;
    } else {
      formulaBox.textContent = 'm₁v₁ + m₂v₂ = m₁v′₁ + m₂v′₂';
    }
  }
  
  updateFormula();
  collisionTypeSelect.addEventListener('change', updateFormula);
  
  function convert(value, unitMap, unit) {
    return parseFloat(value) * unitMap[unit];
  }
  
  function calculateCollision(m1Val, m2Val, v1iVal, v2iVal, m1Unit, m2Unit, v1Unit, v2Unit, collisionType, keGiven = null, solveFor = null) {
    let m1 = m1Val ? convert(m1Val, massUnits, m1Unit) : null;
    let m2 = m2Val ? convert(m2Val, massUnits, m2Unit) : null;
    let v1i = v1iVal ? convert(v1iVal, velocityUnits, v1Unit) : null;
    let v2i = v2iVal ? convert(v2iVal, velocityUnits, v2Unit) : null;
  
    // Check if we need to solve for a missing value
    if (keGiven !== null && solveFor) {
      console.log("Solving for", solveFor);
      if (solveFor === 'm1' && v1i !== null) {
        console.log("Solving for m1:", (2 * keGiven) / Math.pow(v1i, 2));
        m1 = (2 * keGiven) / Math.pow(v1i, 2);
      } else if (solveFor === 'm2' && v2i !== null) {
        console.log("Solving for m2:", (2 * keGiven) / Math.pow(v2i, 2));
        m2 = (2 * keGiven) / Math.pow(v2i, 2);
      } else if (solveFor === 'v1' && m1 !== null) {
        console.log("Solving for v1:", Math.sqrt((2 * keGiven) / m1));
        v1i = Math.sqrt((2 * keGiven) / m1);
      } else if (solveFor === 'v2' && m2 !== null) {
        console.log("Solving for v2:", Math.sqrt((2 * keGiven) / m2));
        v2i = Math.sqrt((2 * keGiven) / m2);
      }
    }
  
    // Debugging: Log the variables to check for correctness
    console.log("m1:", m1, "m2:", m2, "v1i:", v1i, "v2i:", v2i);
  
    // Calculate final velocities based on collision type
    let v1f, v2f;
    if (collisionType === "Perfectly Elastic") {
      v1f = ((m1 - m2) / (m1 + m2)) * v1i + (2 * m2 / (m1 + m2)) * v2i;
      v2f = ((m2 - m1) / (m1 + m2)) * v2i + (2 * m1 / (m1 + m2)) * v1i;
    } else if (collisionType === "Partially Elastic" || collisionType === "Don't Know") {
      v1f = ((m1 + m2) / (m1 - m2)) * v1i + 2 * m2 * v2i;
      v2f = ((m2 - m1) / (m1 + m2)) * v2i + 2 * m1 * v1i;
    } else if (collisionType === "Perfectly Inelastic") {
      v1f = v2f = (m1 * v1i + m2 * v2i) / (m1 + m2);
    }
  
    const KE_before = 0.5 * m1 * Math.pow(v1i, 2) + 0.5 * m2 * Math.pow(v2i, 2);
    const KE_after = 0.5 * m1 * Math.pow(v1f, 2) + 0.5 * m2 * Math.pow(v2f, 2);
    const loss = ((KE_before - KE_after) / KE_before) * 100;
  
    return {
      m1: m1Val ? m1 : undefined,
      m2: m2Val ? m2 : undefined,
      v1i: v1iVal ? v1i : undefined,
      v2i: v2iVal ? v2i : undefined,
      v1f,
      v2f,
      KE_before: KE_before.toFixed(2) + ' J',
      KE_after: KE_after.toFixed(2) + ' J',
      energyLossPercent: loss.toFixed(2) + '%'
    };
  }
  
