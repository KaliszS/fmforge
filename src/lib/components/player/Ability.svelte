<script lang="ts">
    let {
        ca = $bindable(),
        pa = $bindable(),
        edit_mode = false,
    }: { ca: number; pa: number; edit_mode: boolean } = $props();
</script>

{#if edit_mode}
    <article class="ability-edit">
        <label>
            CA:
            <input
                type="number"
                bind:value={ca}
                min="0"
                max="200"
                class="ability-input"
            />
        </label>
        <label>
            PA:
            <input
                type="number"
                bind:value={pa}
                min="0"
                max="200"
                class="ability-input"
            />
        </label>
    </article>
{:else}
    <div class="ability-display">
        <div class="ability-half ca" title="CA">
            <!-- <div class="ability-label">CA</div> -->
            <div class="ability-value">{ca}</div>
        </div>
        <div class="separator-vertical"></div>
        <div class="ability-half pa" title="PA">
            <!-- <div class="ability-label">PA</div> -->
            <div class="ability-value">{pa}</div>
        </div>
    </div>
{/if}

<style>
    .ability-edit {
        display: flex;
        gap: 1rem;
    }

    .ability-input {
        width: 70px;
        padding: 4px 6px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 1rem;
    }

    .ability-display {
        display: flex;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        border: 1px solid #ddd;
        background-color: #f9f9f9;
        /* min-width: 90px; */
    }

    .ability-half {
        flex: 1;
        padding: 0.25em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .ca {
        background-color: #e0edff;
    }

    .pa {
        background-color: #f2e8ff;
    }

    .ability-label {
        font-weight: 500;
        font-size: 0.7rem;
        color: #666;
        margin-bottom: 2px;
    }

    .ability-value {
        font-weight: bold;
        font-size: 0.95em;
        color: #222;
    }

    .separator-vertical {
        width: 1px;
        background-color: #ccc;
    }
</style>
