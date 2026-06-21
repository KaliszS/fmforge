<script lang="ts" module>
    import type { BirthDateRange } from "$lib/api/player";

    export interface HarnessState {
        preferredFoot: number | null;
        favouriteNumber: number | null;
        birthYear: number | null;
        effectiveBirthYear: number | null;
        birthDateRange: BirthDateRange | null;
    }
</script>

<script lang="ts">
    // Test harness: wraps PersonalFilters and owns reactive $state for its
    // $bindable outputs so binding write-backs are observable. The current
    // values are surfaced through the `read` callback the test supplies, which
    // is invoked with a fresh snapshot whenever any bound value changes.
    import PersonalFilters from "$lib/components/filters/PersonalFilters.svelte";

    let {
        initial,
        read,
    }: {
        initial: Partial<HarnessState>;
        read: (s: HarnessState) => void;
    } = $props();

    let preferredFoot = $state<number | null>(initial.preferredFoot ?? null);
    let favouriteNumber = $state<number | null>(initial.favouriteNumber ?? null);
    let birthYear = $state<number | null>(initial.birthYear ?? null);
    let effectiveBirthYear = $state<number | null>(initial.effectiveBirthYear ?? null);
    let birthDateRange = $state<BirthDateRange | null>(initial.birthDateRange ?? null);

    $effect(() => {
        read({ preferredFoot, favouriteNumber, birthYear, effectiveBirthYear, birthDateRange });
    });
</script>

<PersonalFilters
    bind:preferredFoot
    bind:favouriteNumber
    bind:birthYear
    bind:effectiveBirthYear
    bind:birthDateRange
/>
