<script lang="ts">
    import PaginationControls from "./PaginationControls.svelte";
    import EditedPlayersInfo from "./EditedPlayersInfo.svelte";
    import SelectedPlayersInfo from "./SelectedPlayersInfo.svelte";
    import EditTypeLabels from "./EditTypeLabels.svelte";
    
    let {
        currentPage = $bindable(),
        onPrev,
        onNext,
        onPageChange,
        isLastPage,
        editTypeFilter = $bindable(),
        onFilterChange = () => {}
    }: {
        currentPage: number;
        onPrev: () => void;
        onNext: () => void;
        onPageChange: (page: number) => void;
        isLastPage: boolean;
        editTypeFilter?: 'all' | 'modified' | 'added' | 'deleted';
        onFilterChange?: (type: 'all' | 'modified' | 'added' | 'deleted') => void;
    } = $props();
    
    function handleFilterReset() {
        editTypeFilter = 'all';
        onFilterChange('all');
    }
</script>

<section class="pagination-section">
    <aside class="pagination-left">
        <SelectedPlayersInfo />
        <EditedPlayersInfo {editTypeFilter} onFilterReset={handleFilterReset} />
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
        <EditTypeLabels bind:editTypeFilter {onFilterChange} />
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
        justify-content: flex-start;
        gap: var(--spacing-md);
        flex-wrap: wrap;
    }
    
    .pagination-center {
        flex: 0 0 auto;
    }
    
    .pagination-right {
        flex: 1;
        display: flex;
        justify-content: center;
    }
</style>
