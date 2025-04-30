const massUnits = {
    "kilograms (kg)": 1,
    "grams (g)": 0.001,
    "milligrams (mg)": 0.000001,
    "pound (lb)": 0.453592,
    "ounces (oz)": 0.0283495,
    "metric tons": 1000,
    "atomic mass unit (amu)": 1.66053906660e-27
  };
  
  const velocityUnits = {
    "m/s": 1,
    "km/h": 1 / 3.6,
    "mph": 0.44704,
    "ft/s": 0.3048,
    "cm/s": 0.01,
    "in/s": 0.0254
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
  
  function convertValue(value, unitMap, selectedUnit) {
    return value * unitMap[selectedUnit];
  }
  
  document.querySelector('.calculate-btn').addEventListener('click', () => {
    const m1 = convertValue(parseFloat(document.getElementById('m1').value), massUnits, document.getElementById('m1').nextElementSibling.value);
    const m2 = convertValue(parseFloat(document.getElementById('m2').value), massUnits, document.getElementById('m2').nextElementSibling.value);
    const v1i = convertValue(parseFloat(document.getElementById('v1').value), velocityUnits, document.getElementById('v1').nextElementSibling.value);
    const v2i = convertValue(parseFloat(document.getElementById('v2').value), velocityUnits, document.getElementById('v2').nextElementSibling.value);
  
    const v1fInput = document.getElementById('v1f');
    const v2fInput = document.getElementById('v2f');
    const v1fUnit = v1fInput.nextElementSibling.value;
    const v2fUnit = v2fInput.nextElementSibling.value;
  
    let v1f, v2f;
  
    const collision = collisionTypeSelect.value;
  
    if (collision === 'Perfectly Elastic') {
      v1f = ((m1 - m2) / (m1 + m2)) * v1i + (2 * m2 / (m1 + m2)) * v2i;
      v2f = ((m2 - m1) / (m1 + m2)) * v2i + (2 * m1 / (m1 + m2)) * v1i;
    } else if (collision === 'Perfectly Inelastic') {
      v1f = v2f = (m1 * v1i + m2 * v2i) / (m1 + m2);
    } else {
      // Treat as partially elastic or unknown
      v1f = convertValue(parseFloat(v1fInput.value), velocityUnits, v1fUnit);
      v2f = convertValue(parseFloat(v2fInput.value), velocityUnits, v2fUnit);
    }
  
    const KE_before = 0.5 * m1 * v1i ** 2 + 0.5 * m2 * v2i ** 2;
    const KE_after = 0.5 * m1 * v1f ** 2 + 0.5 * m2 * v2f ** 2;
    const loss = ((KE_before - KE_after) / KE_before) * 100;
  
    document.getElementById('ke-before').textContent = `${KE_before.toFixed(2)} J`;
    document.getElementById('ke-after').textContent = `${KE_after.toFixed(2)} J`;
    document.getElementById('ke-loss').textContent = `${loss.toFixed(2)} %`;
  });
  
  document.querySelector('.reset-btn').addEventListener('click', () => {
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
    document.getElementById('ke-before').textContent = '-- J';
    document.getElementById('ke-after').textContent = '-- J';
    document.getElementById('ke-loss').textContent = '-- %';
    updateFormula();
  });