import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Name from '$lib/components/player/utils/Name.svelte';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('Name — display mode', () => {
  it('renders the common name only when set', () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: false },
    });
    const span = document.querySelector('.name') as HTMLElement;
    expect(span).toBeInTheDocument();
    expect(span.textContent?.trim()).toBe('Bobby');
  });

  it('renders first + last when there is no common name', () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: undefined, last_name: 'Smith', edit_mode: false },
    });
    const span = document.querySelector('.name') as HTMLElement;
    // Whitespace between the two interpolations is collapsed.
    expect(span.textContent?.replace(/\s+/g, ' ').trim()).toBe('Robert Smith');
  });

  it('builds the title (full_name) with quoted common name', () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: false },
    });
    expect(screen.getByTitle('Robert "Bobby" Smith')).toBeInTheDocument();
  });

  it('builds the title (full_name) without common name', () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: undefined, last_name: 'Smith', edit_mode: false },
    });
    expect(screen.getByTitle('Robert Smith')).toBeInTheDocument();
  });

  it('treats an empty-string common name as absent in the display branch', () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: '', last_name: 'Smith', edit_mode: false },
    });
    const span = document.querySelector('.name') as HTMLElement;
    expect(span.textContent?.replace(/\s+/g, ' ').trim()).toBe('Robert Smith');
  });
});

describe('Name — edit mode', () => {
  it('renders three text inputs seeded with current values', () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: true },
    });
    const first = screen.getByTitle('First Name') as HTMLInputElement;
    const common = screen.getByTitle('Common Name') as HTMLInputElement;
    const last = screen.getByTitle('Last Name') as HTMLInputElement;
    expect(first.value).toBe('Robert');
    expect(common.value).toBe('Bobby');
    expect(last.value).toBe('Smith');
  });

  it('exposes the expected placeholders', () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: true },
    });
    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Common name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
  });

  it('does not render the display span in edit mode', () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: true },
    });
    expect(document.querySelector('.name')).toBeNull();
  });

  it('keeps the two-way binding in sync as inputs change', async () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: true },
    });
    const first = screen.getByTitle('First Name') as HTMLInputElement;
    const common = screen.getByTitle('Common Name') as HTMLInputElement;
    const last = screen.getByTitle('Last Name') as HTMLInputElement;
    await fireEvent.input(first, { target: { value: 'James' } });
    await fireEvent.input(common, { target: { value: 'Jim' } });
    await fireEvent.input(last, { target: { value: 'Jones' } });
    expect(first.value).toBe('James');
    expect(common.value).toBe('Jim');
    expect(last.value).toBe('Jones');
  });
});

describe('Name — display <-> edit mode toggle', () => {
  it('switches from display to edit inputs when edit_mode flips', async () => {
    const { rerender } = render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: false },
    });
    expect(document.querySelector('.name')).toBeInTheDocument();
    await rerender({ first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: true });
    await tick();
    expect(document.querySelector('.name')).toBeNull();
    expect(screen.getByTitle('First Name')).toBeInTheDocument();
  });
});

describe('Name — quick edit round trip (bindable)', () => {
  it('does not open the modal when in edit mode (no display span)', () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: true },
    });
    expect(screen.queryByText('Edit Name')).not.toBeInTheDocument();
  });

  it('opens the Edit Name modal on double-click and seeds temp inputs', async () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: false },
    });
    await fireEvent.dblClick(document.querySelector('.name')!);

    expect(screen.getByText('Edit Name')).toBeInTheDocument();
    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>('.modal-content input'),
    );
    expect(inputs).toHaveLength(3);
    expect(inputs[0].value).toBe('Robert');
    expect(inputs[1].value).toBe('Bobby');
    expect(inputs[2].value).toBe('Smith');
  });

  it('seeds the common-name temp input with empty string when common_name is undefined', async () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: undefined, last_name: 'Smith', edit_mode: false },
    });
    await fireEvent.dblClick(document.querySelector('.name')!);
    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>('.modal-content input'),
    );
    expect(inputs[1].value).toBe('');
  });

  it('writes new names back to the display via the modal (common name path)', async () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: false },
    });
    await fireEvent.dblClick(document.querySelector('.name')!);

    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>('.modal-content input'),
    );
    await fireEvent.input(inputs[0], { target: { value: 'James' } });
    await fireEvent.input(inputs[1], { target: { value: 'Jim' } });
    await fireEvent.input(inputs[2], { target: { value: 'Jones' } });
    await fireEvent.click(screen.getByText('Save'));
    await tick();

    expect(screen.queryByText('Edit Name')).not.toBeInTheDocument();
    const span = document.querySelector('.name') as HTMLElement;
    expect(span.textContent?.trim()).toBe('Jim');
    expect(screen.getByTitle('James "Jim" Jones')).toBeInTheDocument();
  });

  it('clearing the common name in the modal falls back to first + last', async () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: false },
    });
    await fireEvent.dblClick(document.querySelector('.name')!);

    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>('.modal-content input'),
    );
    await fireEvent.input(inputs[1], { target: { value: '' } });
    await fireEvent.click(screen.getByText('Save'));
    await tick();

    const span = document.querySelector('.name') as HTMLElement;
    expect(span.textContent?.replace(/\s+/g, ' ').trim()).toBe('Robert Smith');
    expect(screen.getByTitle('Robert Smith')).toBeInTheDocument();
  });

  it('Cancel closes the modal without writing changes back', async () => {
    render(Name, {
      props: { first_name: 'Robert', common_name: 'Bobby', last_name: 'Smith', edit_mode: false },
    });
    await fireEvent.dblClick(document.querySelector('.name')!);

    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>('.modal-content input'),
    );
    await fireEvent.input(inputs[0], { target: { value: 'James' } });
    await fireEvent.click(screen.getByText('Cancel'));
    await tick();

    expect(screen.queryByText('Edit Name')).not.toBeInTheDocument();
    const span = document.querySelector('.name') as HTMLElement;
    expect(span.textContent?.trim()).toBe('Bobby');
    expect(screen.getByTitle('Robert "Bobby" Smith')).toBeInTheDocument();
  });
});
