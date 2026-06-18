<script lang="ts">
    import Icon from './common/Icon.svelte';

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

    const inputWidth = $derived(
        `calc(${Math.max(pageInput.length, totalPages > 0 ? totalPages.toString().length : 1)}ch + 0.6rem)`
    );

    $effect(() => {
        pageInput = (currentPage + 1).toString();
    });

    function handlePageInput() {
        const pageNum = parseInt(pageInput);
        if (!isNaN(pageNum)) {
            let targetPage = pageNum - 1;
            if (targetPage < 0) targetPage = 0;
            if (totalPages > 0 && targetPage >= totalPages) targetPage = totalPages - 1;
            if (targetPage !== currentPage) {
                onPageChange(targetPage);
            } else {
                pageInput = (currentPage + 1).toString();
            }
        } else {
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
        <button class="nav-btn" onclick={onPrev} disabled={currentPage === 0} title="Previous Page" aria-label="Previous Page">
            <Icon name="chevron-left" size={14} />
        </button>

        <div class="page-info">
            <input
                type="number"
                bind:value={pageInput}
                onblur={handlePageInput}
                onkeydown={handleKeydown}
                class="page-input"
                style="width: {inputWidth}"
                min="1"
                max={totalPages > 0 ? totalPages : undefined}
                title="Enter page number"
                aria-label="Current page"
            />
            {#if totalPages > 0}
                <span class="page-sep">/</span>
                <span class="page-total">{totalPages}</span>
            {/if}
        </div>

        <button class="nav-btn" onclick={onNext} disabled={isLastPage} title="Next Page" aria-label="Next Page">
            <Icon name="chevron-right" size={14} />
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
        box-shadow: 0 2px 5px var(--color-shadow-light);
        gap: 2px;
    }

    .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--color-text);
        cursor: pointer;
        transition: all var(--transition-fast);
        flex-shrink: 0;
    }

    .nav-btn:hover:not(:disabled) {
        background-color: var(--color-background-hover);
        color: var(--color-primary);
    }

    .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .page-info {
        display: flex;
        align-items: baseline;
        gap: 4px;
        padding: 0 var(--spacing-sm);
    }

    .page-input {
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

    .page-sep {
        color: var(--color-text-muted);
        opacity: 0.4;
        font-size: 0.95rem;
        font-weight: 300;
        user-select: none;
    }

    .page-total {
        color: var(--color-text-muted);
        font-size: 0.95rem;
        font-weight: 500;
        user-select: none;
    }
</style>
