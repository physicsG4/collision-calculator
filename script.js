  const collisionTypeSelect = document.getElementById('collision-type');
  const formulaBox = document.querySelector('.formula-box');

  const KE_BEFORE = document.getElementById('ke-before');
  const KE_AFTER = document.getElementById('ke-after');
  const KE_LOSS = document.getElementById('ke-loss');

  const calculateBtn = document.querySelector('.calculate-btn');
  const resetBtn = document.querySelector('.reset-btn');

  const massUnits = {
    'kilograms (kg)': 1,
    'grams (g)': 0.001,
    'milligrams (mg)': 0.000001,
    'pound (lb)': 0.453592,
    'ounces (oz)': 0.0283495,
    'metric tons': 1000,
    'atomic mass unit (amu)': 1.66053906660e-27
  };

  const velocityUnits = {
    'm/s': 1,
    'km/h': 1 / 3.6,
    'mph': 0.44704,
    'ft/s': 0.3048,
    'cm/s': 0.01,
    'in/s': 0.0254
  };

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

  function getInputValue(id) {
    return parseFloat(document.getElementById(id).value) || 0;
  }

  function getUnitValue(id) {
    const input = document.getElementById(id);
    return input ? input.value : '';
  }

  function getSiblingUnitValue(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return '';
    const select = input.parentElement.querySelector('select');
    return select ? select.value : '';
  }

  function convertMass(id) {
    const value = getInputValue(id);
    const unit = getSiblingUnitValue(id);
    return value * (massUnits[unit] || 1);
  }

  function convertVelocity(id) {
    const value = getInputValue(id);
    const unit = getSiblingUnitValue(id);
    return value * (velocityUnits[unit] || 1);
  }

  function calculate() {
    const m1 = convertMass('m1');
    const m2 = convertMass('m2');
    const v1 = convertVelocity('v1');
    const v2 = convertVelocity('v2');

    let v1f = convertVelocity('v1f');
    let v2f = convertVelocity('v2f');

    const collision = collisionTypeSelect.value;

    if (collision === 'Perfectly Elastic') {
      v1f = ((m1 - m2) / (m1 + m2)) * v1 + (2 * m2 / (m1 + m2)) * v2;
      v2f = ((m2 - m1) / (m1 + m2)) * v2 + (2 * m1 / (m1 + m2)) * v1;
    } else if (collision === 'Perfectly Inelastic') {
      const vFinal = (m1 * v1 + m2 * v2) / (m1 + m2);
      v1f = v2f = vFinal;
    } else {
      // Partially Elastic or Don't Know
      v1f = v1f || 0;
      v2f = v2f || 0;
    }

    const keBefore = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
    const keAfter = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;
    const keLoss = keBefore !== 0 ? ((keBefore - keAfter) / keBefore) * 100 : 0;

    KE_BEFORE.textContent = keBefore.toFixed(2) + ' J';
    KE_AFTER.textContent = keAfter.toFixed(2) + ' J';
    KE_LOSS.textContent = keLoss.toFixed(2) + ' %';
  }

  function reset() {
    document.querySelectorAll('input').forEach(input => input.value = '');
    KE_BEFORE.textContent = '-- J';
    KE_AFTER.textContent = '-- J';
    KE_LOSS.textContent = '-- %';
    updateFormula();
  }

  updateFormula();
  collisionTypeSelect.addEventListener('change', updateFormula);
  calculateBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', reset);
