<script lang="ts">
    let {
        minCA = $bindable(),
        maxCA = $bindable(),
        minPA = $bindable(),
        maxPA = $bindable(),
    }: {
        minCA: number | null;
        maxCA: number | null;
        minPA: number | null;
        maxPA: number | null;
    } = $props();

    // Order a [min, max] pair so min <= max: swap when both bounds are set and
    // inverted, otherwise leave untouched. Used on blur to keep ranges valid.
    function ordered(min: number | null, max: number | null): [number | null, number | null] {
        return min !== null && max !== null && min > max ? [max, min] : [min, max];
    }
</script>

<div class="filter-row">
    <div class="filter-item">
        <div class="range-group">
            <div class="input-wrapper">
                <span class="input-icon">⚡</span>
                <input id="minCA" type="number" bind:value={minCA} onblur={() => ([minCA, maxCA] = ordered(minCA, maxCA))} placeholder="Min CA"
                    class="filter-input input-number range-input" aria-label="Minimum CA" />
            </div>
            <span class="range-separator">to</span>
            <div class="input-wrapper">
                <input id="maxCA" type="number" bind:value={maxCA} onblur={() => ([minCA, maxCA] = ordered(minCA, maxCA))} placeholder="Max CA"
                    class="filter-input input-number range-input" aria-label="Maximum CA" />
            </div>
        </div>
    </div>

    <div class="filter-item">
        <div class="range-group">
            <div class="input-wrapper">
                <span class="input-icon">⭐</span>
                <input id="minPA" type="number" bind:value={minPA} onblur={() => ([minPA, maxPA] = ordered(minPA, maxPA))} placeholder="Min PA"
                    class="filter-input input-number range-input" aria-label="Minimum PA" />
            </div>
            <span class="range-separator">to</span>
            <div class="input-wrapper">
                <input id="maxPA" type="number" bind:value={maxPA} onblur={() => ([minPA, maxPA] = ordered(minPA, maxPA))} placeholder="Max PA"
                    class="filter-input input-number range-input" aria-label="Maximum PA" />
            </div>
        </div>
    </div>
</div>
