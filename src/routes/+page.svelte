<script lang="ts">
    import PlayerTable from "$lib/components/PlayerTable.svelte";
    import PaginationControls from "$lib/components/PaginationControls.svelte";
    import { selectFileAndLoad, savePlayersToFile } from "$lib/api/file";
    import { loadPlayersPage } from "$lib/api/player";
    import type { PlayerRecord } from "$lib/types";

    let players: PlayerRecord[] = $state([]);
    let currentPage = $state(0);
    let pageSize = $state(10);
    let source_path = $state("");
    let selectedCountry: number | null = $state(null);
    let selectedClub: number | null = $state(null);

    $effect(() => {
        void pageSize;
        loadPage();
    });

    async function selectFile() {
        const path = await selectFileAndLoad();
        if (path) {
            source_path = path;
            alert("Regens loaded from file...");
        }
    }

    async function loadPage() {
        players = await loadPlayersPage(
            currentPage * pageSize,
            pageSize,
            selectedCountry,
            selectedClub,
        );
    }

    async function saveToFile() {
        await savePlayersToFile(players, source_path);
        alert("File with regens updated...");
    }

    function nextPage() {
        currentPage += 1;
        loadPage();
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage -= 1;
            loadPage();
        }
    }
</script>

<main>
    <section class="top-bar">
        <button onclick={selectFile}>Load file</button>
        <button onclick={loadPage}>Show players</button>
        <button onclick={saveToFile}>Save changes to file</button>

        <label for="pageSizeInput" class="input-label">Players per page:</label>
        <input
            id="pageSizeInput"
            type="number"
            min="1"
            bind:value={pageSize}
            class="page-size-input"
        />
    </section>

    <article class="content">
        <section class="filters">
            <label class="filter-label">
                Country ID:
                <input
                    type="number"
                    bind:value={selectedCountry}
                    placeholder="e.g. 81"
                    class="filter-input"
                />
            </label>

            <label class="filter-label">
                Club ID:
                <input
                    type="number"
                    bind:value={selectedClub}
                    placeholder="e.g. 100"
                    class="filter-input"
                />
            </label>
        </section>

        <PaginationControls {currentPage} onPrev={prevPage} onNext={nextPage} />
        <PlayerTable bind:players />
        <PaginationControls {currentPage} onPrev={prevPage} onNext={nextPage} />
    </article>
</main>

<style>
    /* @font-face {
        font-family: "Gloria Hallelujah";
        font-style: normal;
        font-weight: 400;
        src: url(https://fonts.gstatic.com/s/gloriahallelujah/v23/LYjYdHv3kUk9BMV96EIswT9DIbW-MIS11zM.woff2)
            format("woff2");
        unicode-range:
            U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
            U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191,
            U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    } */

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: lightgray;
        /* font-family: Gloria-Hallelujah, sans-seri; */
    }

    .top-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1em;
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        gap: 1em;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
    }

    .content {
        margin-top: 4em;
        width: 100%;
        padding: 1em;
        display: flex;
        flex-direction: column;
    }

    button {
        border-radius: 8px;
        border: 1.5px solid #bbb;
        padding: 0.65em 1.4em;
        font-size: 1.05em;
        font-weight: 600;
        background-color: #ffffff;
        color: #2c3e50;
        cursor: pointer;
        transition:
            background-color 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        user-select: none;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    button:hover {
        background-color: #e1e7f0;
        border-color: #5974c1;
        box-shadow: 0 5px 15px rgba(89, 116, 193, 0.3);
    }

    button:active {
        background-color: #a9b6d9;
        border-color: #3c508d;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
    }

    .input-label {
        font-size: 0.9rem;
        font-weight: 500;
        margin-left: 1rem;
        user-select: none;
        color: #444;
        align-self: center;
    }

    .page-size-input {
        width: 4rem;
        padding: 0.4em 0.6em;
        border: 1.5px solid #bbb;
        border-radius: 6px;
        font-size: 1rem;
        font-family: inherit;
        text-align: center;
        transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
    }

    .page-size-input:hover {
        border-color: #5974c1;
    }

    .page-size-input:focus {
        outline: none;
        border-color: #3c508d;
        box-shadow: 0 0 6px rgba(89, 116, 193, 0.3);
    }
</style>
