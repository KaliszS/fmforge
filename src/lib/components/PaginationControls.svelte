<script lang="ts">
    export let currentPage: number;
    export let onPrev: () => void;
    export let onNext: () => void;
</script>

<section class="pagination">
    <button on:click={onPrev} disabled={currentPage === 0}>←</button>
    <span>Page {currentPage + 1}</span>
    <button on:click={onNext}>→</button>
</section>

<style>
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin: 1rem 0;
        font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
        font-weight: 600;
        color: #1a3d8f;
        user-select: none;
    }

    button {
        border-radius: 6px;
        border: 1px solid #396cd8;
        padding: 0.4em 1.2em;
        font-size: 1.1em;
        background-color: #e7f0fd;
        color: #1a3d8f;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(57, 108, 216, 0.3);
        transition:
            background-color 0.2s ease,
            color 0.2s ease;
        user-select: none;
    }

    button:hover:enabled {
        background-color: #396cd8;
        color: white;
        box-shadow: 0 4px 10px rgba(57, 108, 216, 0.6);
    }

    button:active:enabled {
        background-color: #2b52a3;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
        background-color: #cbd7ea;
        color: #6c7a96;
    }

    span {
        font-size: 1.1em;
        min-width: 100px;
        text-align: center;
    }
</style>
