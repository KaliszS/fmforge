<script lang="ts">
    let {
        currentPage = $bindable(),
        onPrev,
        onNext,
        onPageChange = () => {},
        totalPages = 0,
        isLastPage = false
    }: {
        currentPage: number;
        onPrev: () => void;
        onNext: () => void;
        onPageChange?: (page: number) => void;
        totalPages?: number;
        isLastPage?: boolean;
    } = $props();

    let pageInput = $state((currentPage + 1).toString());

    // Update input when currentPage changes externally
    $effect(() => {
        pageInput = (currentPage + 1).toString();
    });

    function handlePageInput() {
        const pageNum = parseInt(pageInput);
        if (!isNaN(pageNum) && pageNum > 0) {
            const targetPage = pageNum - 1; // Convert to 0-based
            if (targetPage !== currentPage) {
                onPageChange(targetPage);
            }
        } else {
            // Reset to current page if invalid input
            pageInput = (currentPage + 1).toString();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handlePageInput();
        }
    }
</script>

<section class="pagination-container">
    <div class="pagination-pill">
        <button class="nav-btn" onclick={onPrev} disabled={currentPage === 0} title="Previous Page">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        
        <div class="page-info">
            <span class="page-label">Page</span>
            <input 
                type="number" 
                bind:value={pageInput}
                onblur={handlePageInput}
                onkeydown={handleKeydown}
                class="page-input"
                min="1"
                max={totalPages > 0 ? totalPages : undefined}
                title="Enter page number"
            />
            {#if totalPages > 0}
                <span class="total-pages">of {totalPages}</span>
            {/if}
        </div>
        
        <button class="nav-btn" onclick={onNext} disabled={isLastPage} title="Next Page">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
    </div>
</section>

<style>
    .pagination-container {
        display: flex;
        justify-content: center;
        margin: var(--spacing-md) 0;
    }

    .pagination-pill {
        display: flex;
        align-items: center;
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 100px;
        padding: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        gap: 8px;
    }

    .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--color-text);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .nav-btn:hover:not(:disabled) {
        background-color: var(--color-background-hover);
        color: var(--color-primary);
        transform: translateX(0);
    }

    .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .page-info {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 8px;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-text-muted);
        border-left: 1px solid var(--color-border-light);
        border-right: 1px solid var(--color-border-light);
    }

    .page-label {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.5px;
    }

    .page-input {
        width: 3rem;
        text-align: center;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--color-text);
        background: transparent;
        border: none;
        padding: 2px 0;
        -moz-appearance: textfield;
    }

    .page-input:focus {
        outline: none;
        color: var(--color-primary);
    }

    .page-input::-webkit-outer-spin-button,
    .page-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .total-pages {
        color: var(--color-text-muted);
        font-weight: 500;
    }
</style>
