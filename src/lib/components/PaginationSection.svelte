<script lang="ts">
    import PaginationControls from "./PaginationControls.svelte";
    import EditedPlayersInfo from "./EditedPlayersInfo.svelte";
    
    let {
        currentPage = $bindable(),
        onPrev,
        onNext,
        onPageChange,
        isLastPage
    }: {
        currentPage: number;
        onPrev: () => void;
        onNext: () => void;
        onPageChange: (page: number) => void;
        isLastPage: boolean;
    } = $props();
</script>

<section class="pagination-section">
    <aside class="pagination-left">
        <EditedPlayersInfo />
    </aside>
    <section class="pagination-center">
        <PaginationControls 
            bind:currentPage 
            {onPrev} 
            {onNext} 
            {onPageChange} 
            {isLastPage} 
        />
    </section>
    <aside class="pagination-right">
        <!-- Empty space for balance -->
    </aside>
</section>

<style>
    .pagination-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-lg);
        margin: var(--spacing-md) 0;
        width: 100%;
    }
    
    .pagination-left {
        flex: 1;
        display: flex;
        justify-content: center;
    }
    
    .pagination-center {
        flex: 0 0 auto;
    }
    
    .pagination-right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
    }
</style>
