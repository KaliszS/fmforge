<script lang="ts">
    export let currentPage: number;
    export let onPrev: () => void;
    export let onNext: () => void;
</script>

<section class="pagination">
    <button class="btn-secondary" on:click={onPrev} disabled={currentPage === 0}>←</button>
    <span>Page {currentPage + 1}</span>
    <button class="btn-secondary" on:click={onNext}>→</button>
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

    span {
        font-size: var(--font-xl);
        min-width: 6.25rem;
        text-align: center;
    }
</style>
