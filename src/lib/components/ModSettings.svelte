<script lang="ts">
  let fmEdition = $state('');
  let retroYear = $state('');
  let showRealBirthDates = $state(false);
  let showModal = $state(false);
  let tempFmEdition = $state('');
  let tempRetroYear = $state('');

  function validateYear(value: string): boolean {
    const num = parseInt(value);
    return !isNaN(num) && num >= 1000 && num <= 9999;
  }

  let canToggle = $state(false);

  $effect(() => {
    const fmValid = fmEdition && validateYear(fmEdition);
    const retroValid = retroYear && validateYear(retroYear);
    canToggle = Boolean(fmValid && retroValid);
  });

  function openModal() {
    tempFmEdition = fmEdition;
    tempRetroYear = retroYear;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  function saveSettings() {
    if (validateYear(tempFmEdition) && validateYear(tempRetroYear)) {
      fmEdition = tempFmEdition;
      retroYear = tempRetroYear;
      closeModal();
    }
  }

  function resetSettings() {
    fmEdition = '';
    retroYear = '';
    showRealBirthDates = false;
  }
</script>

<div class="mod-settings-compact">
  <div 
    class="year-display" 
    onclick={openModal}
    onkeydown={(e) => e.key === 'Enter' && openModal()}
    role="button"
    tabindex="0"
    aria-label="Edit mod settings"
  >
    <div class="year-value">
      <span class="year-label">FM</span>
      <span class="year-number">{fmEdition || '----'}</span>
    </div>
    <div class="year-value">
      <span class="year-label">Mod</span>
      <span class="year-number">{retroYear || '----'}</span>
    </div>
    <div class="edit-indicator">✏️</div>
  </div>

  <div class="birthdate-section">
    <div class="birthdate-label">Birthdate</div>
    <div class="toggle-group">
      <label class="toggle-label">
        <input
          type="checkbox"
          bind:checked={showRealBirthDates}
          disabled={!canToggle}
          class="toggle-input"
        />
        <span class="toggle-slider"></span>
      </label>
    </div>
  </div>

  {#if showModal}
  <div 
    class="modal-overlay" 
    onclick={closeModal}
    onkeydown={(e) => e.key === 'Escape' && closeModal()}
    role="dialog"
    tabindex="-1"
    aria-label="Mod settings modal"
  >
    <div class="modal-content">
        <h3>Mod Settings</h3>
        <div class="modal-inputs">
          <div class="input-group">
            <label for="modal-fm-edition">FM Edition:</label>
            <input
              id="modal-fm-edition"
              type="number"
              min="1000"
              max="9999"
              bind:value={tempFmEdition}
              placeholder="e.g., 2024"
              class="input input-text"
              onclick={(e) => e.stopPropagation()}
            />
          </div>
          <div class="input-group">
            <label for="modal-retro-year">Mod Starting Year:</label>
            <input
              id="modal-retro-year"
              type="number"
              min="1000"
              max="9999"
              bind:value={tempRetroYear}
              placeholder="e.g., 1986"
              class="input input-text"
              onclick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick={resetSettings}>Reset</button>
          <button class="btn" onclick={closeModal}>Cancel</button>
          <button class="btn" onclick={saveSettings}>Save</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .mod-settings-compact {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    margin-left: 3rem;
  }

  .year-display {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    transition: background-color var(--transition-fast);
    position: relative;
  }

  .year-display:hover {
    background-color: var(--color-background-hover);
  }

  .year-value {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .year-label {
    font-size: var(--font-xs);
    font-weight: 600;
    color: var(--color-text-muted);
    min-width: 2rem;
  }

  .year-number {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--color-text);
    min-width: 2.5rem;
    text-align: center;
  }

  .edit-indicator {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    font-size: 0.75rem;
    opacity: 0.8;
  }

  .birthdate-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .birthdate-label {
    font-size: var(--font-xs);
    font-weight: 600;
    color: var(--color-text-muted);
  }

  .toggle-label {
    position: relative;
    cursor: pointer;
  }

  .toggle-input {
    display: none;
  }

  .toggle-slider {
    position: relative;
    width: 7rem;
    height: 1.75rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 0.875rem;
    transition: all var(--transition-normal);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .toggle-slider::before {
    content: '';
    position: absolute;
    left: 0.1rem;
    width: 1.5rem;
    height: 1.5rem;
    background-color: var(--color-background-light);
    border: 1px solid var(--color-border);
    border-radius: 50%;
    transition: transform var(--transition-normal);
    z-index: 2;
  }

  .toggle-slider::after {
    content: 'In-game';
    position: absolute;
    left: 2.25rem;
    text-align: center;
    font-size: var(--font-xs);
    font-weight: 500;
    color: var(--color-text);
    transition: all var(--transition-normal);
    z-index: 1;
  }

  .toggle-input:checked + .toggle-slider {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }

  .toggle-input:checked + .toggle-slider::before {
    transform: translateX(5.25rem);
  }

  .toggle-input:checked + .toggle-slider::after {
    content: 'Real-life';
    color: white;
  }

  .toggle-input:disabled + .toggle-slider {
    opacity: 0.5;
    cursor: not-allowed;
  }


  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: var(--color-background);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-border);
    min-width: 18rem;
  }

  .modal-content h3 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-lg);
    color: var(--color-text);
    text-align: center;
  }

  .modal-inputs {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    align-items: center;
  }

  .modal-inputs .input-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    align-items: center;
  }

  .modal-inputs .input-group label {
    font-size: var(--font-sm);
    font-weight: 500;
    color: var(--color-text-light);
  }

  .modal-inputs .input-group input {
    min-width: 8rem;
    text-align: center;
  }

  .modal-actions {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: center;
  }
</style>
