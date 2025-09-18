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

<section class="pagination">
    <button class="btn-secondary" onclick={onPrev} disabled={currentPage === 0}>←</button>
    
    <div class="page-info">
        <span class="page-text">Page</span>
        <input 
            type="number" 
            bind:value={pageInput}
            onblur={handlePageInput}
            onkeydown={handleKeydown}
            class="page-input"
            min="1"
            max={totalPages > 0 ? totalPages : undefined}
            title="Enter page number and press Enter"
        />
        {#if totalPages > 0}
            <span class="total-pages">of {totalPages}</span>
        {/if}
    </div>
    
    <button class="btn-secondary" onclick={onNext} disabled={isLastPage}>→</button>
</section>

<style>
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-md);
        margin: var(--spacing-md) 0;
        font-weight: 600;
        color: var(--color-primary);
        user-select: none;
    }

    .page-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        min-width: 8rem;
        justify-content: center;
    }

    .page-text {
        font-size: var(--font-xl);
        color: var(--color-primary);
    }

    .page-input {
        width: 4.5rem;
        text-align: center;
        font-size: var(--font-lg);
        font-weight: 600;
        color: var(--color-primary);
        background-color: var(--color-background);
        border: 1px solid var(--color-primary);
        border-radius: var(--radius-sm);
        padding: var(--spacing-xs);
        appearance: textfield; /* Standard */
        -moz-appearance: textfield; /* Firefox */
    }

    .page-input::-webkit-outer-spin-button,
    .page-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .page-input:focus {
        outline: none;
        border-color: var(--color-border-focus);
        box-shadow: 0 0 0 0.25rem var(--color-shadow-primary);
    }

    .total-pages {
        font-size: var(--font-sm);
        color: var(--color-text-muted);
        font-weight: 500;
    }
</style>
