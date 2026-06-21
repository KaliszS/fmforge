import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import FlagPicker from '$lib/components/player/utils/FlagPicker.svelte';
import FlagPickerHarness from './fixtures/FlagPickerHarness.svelte';

// FlagPicker is a <select bind:value={nation}> with one numeric-valued <option> per
// country in countryMap (src/data/countries.json). Selection flows back through the
// bindable `nation` prop. Data references:
//   106  -> Afghanistan, 1649 -> Argentina.

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('FlagPicker — rendering', () => {
  it('renders a select seeded with the current nation', () => {
    render(FlagPicker, { props: { nation: 106 } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('106');
  });

  it('renders an option for each country with the country name as its label', () => {
    render(FlagPicker, { props: { nation: 106 } });
    // 224 entries in countries.json.
    const options = screen.getAllByRole('option') as HTMLOptionElement[];
    expect(options.length).toBe(224);
    expect(screen.getByRole('option', { name: 'Afghanistan' })).toHaveValue('106');
    expect(screen.getByRole('option', { name: 'Argentina' })).toHaveValue('1649');
  });

  it('reflects a different starting nation', () => {
    render(FlagPicker, { props: { nation: 1649 } });
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('1649');
  });
});

describe('FlagPicker — selection / change', () => {
  it('reflects a new selection in the select value', async () => {
    render(FlagPicker, { props: { nation: 106 } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;

    await fireEvent.change(select, { target: { value: '1649' } });

    expect(select.value).toBe('1649');
  });

  it('emits the selected id (as a number) back through the bindable nation prop', async () => {
    // A harness component binds `nation` so we can observe the write-back the picker performs.
    render(FlagPickerHarness, { props: { nation: 106 } });

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await fireEvent.change(select, { target: { value: '1649' } });
    await tick();

    // bind:value on a numeric-valued <select> writes the number back through the bindable prop.
    expect(screen.getByTestId('emitted')).toHaveTextContent('1649');
    expect(screen.getByTestId('emitted-type')).toHaveTextContent('number');
  });
});
