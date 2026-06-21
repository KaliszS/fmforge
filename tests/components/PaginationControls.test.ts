import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import PaginationControls from '$lib/components/PaginationControls.svelte';

interface Props {
  currentPage?: number;
  totalPages?: number;
  isLastPage?: boolean;
}

function setup(props: Props = {}) {
  const onPrev = vi.fn();
  const onNext = vi.fn();
  const onPageChange = vi.fn();
  const result = render(PaginationControls, {
    props: { currentPage: 0, onPrev, onNext, onPageChange, ...props },
  });
  return { ...result, onPrev, onNext, onPageChange };
}

const pageInput = () => screen.getByLabelText('Current page') as HTMLInputElement;
const prevBtn = () => screen.getByLabelText('Previous Page') as HTMLButtonElement;
const nextBtn = () => screen.getByLabelText('Next Page') as HTMLButtonElement;

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('PaginationControls — display', () => {
  it('shows the 1-based page number for a 0-based currentPage', () => {
    setup({ currentPage: 4, totalPages: 10 });
    expect(pageInput().value).toBe('5');
  });

  it('renders the total page count when provided', () => {
    setup({ currentPage: 0, totalPages: 7 });
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('re-syncs the input when currentPage prop changes ($effect)', async () => {
    const { rerender } = setup({ currentPage: 0, totalPages: 10 });
    expect(pageInput().value).toBe('1');
    await rerender({ currentPage: 3 });
    await tick();
    expect(pageInput().value).toBe('4');
  });
});

describe('PaginationControls — nav buttons', () => {
  it('disables Previous on the first page', () => {
    setup({ currentPage: 0 });
    expect(prevBtn()).toBeDisabled();
  });

  it('enables Previous past the first page', () => {
    setup({ currentPage: 2 });
    expect(prevBtn()).not.toBeDisabled();
  });

  it('disables Next on the last page', () => {
    setup({ currentPage: 9, totalPages: 10, isLastPage: true });
    expect(nextBtn()).toBeDisabled();
  });

  it('fires onPrev / onNext on click', async () => {
    const { onPrev, onNext } = setup({ currentPage: 2, totalPages: 10 });
    await fireEvent.click(prevBtn());
    await fireEvent.click(nextBtn());
    expect(onPrev).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledOnce();
  });
});

describe('PaginationControls — manual page entry', () => {
  it('calls onPageChange with the 0-based target on blur', async () => {
    const { onPageChange } = setup({ currentPage: 0, totalPages: 10 });
    const input = pageInput();
    await fireEvent.input(input, { target: { value: '5' } });
    await fireEvent.blur(input);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('clamps a too-large page to the last page', async () => {
    const { onPageChange } = setup({ currentPage: 0, totalPages: 10 });
    const input = pageInput();
    await fireEvent.input(input, { target: { value: '999' } });
    await fireEvent.blur(input);
    expect(onPageChange).toHaveBeenCalledWith(9);
  });

  it('clamps a zero/negative page to the first page', async () => {
    const { onPageChange } = setup({ currentPage: 5, totalPages: 10 });
    const input = pageInput();
    await fireEvent.input(input, { target: { value: '0' } });
    await fireEvent.blur(input);
    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('does not call onPageChange when the target equals the current page, and resets the input', async () => {
    const { onPageChange } = setup({ currentPage: 2, totalPages: 10 });
    const input = pageInput();
    await fireEvent.input(input, { target: { value: '3' } }); // 3 -> index 2 == current
    await fireEvent.blur(input);
    expect(onPageChange).not.toHaveBeenCalled();
    expect(input.value).toBe('3');
  });

  it('resets the input on non-numeric entry', async () => {
    const { onPageChange } = setup({ currentPage: 2, totalPages: 10 });
    const input = pageInput();
    await fireEvent.input(input, { target: { value: '' } });
    await fireEvent.blur(input);
    expect(onPageChange).not.toHaveBeenCalled();
    expect(input.value).toBe('3');
  });

  it('commits the page on Enter', async () => {
    const { onPageChange } = setup({ currentPage: 0, totalPages: 10 });
    const input = pageInput();
    await fireEvent.input(input, { target: { value: '7' } });
    await fireEvent.keyDown(input, { key: 'Enter' });
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
});
