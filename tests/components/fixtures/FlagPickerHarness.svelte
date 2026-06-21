<script lang="ts">
    import FlagPicker from "$lib/components/player/utils/FlagPicker.svelte";

    // Test harness: binds `nation` so we can observe the value FlagPicker writes back
    // and surfaces it in the DOM for assertions.
    let { nation = $bindable(106) }: { nation?: number } = $props();
</script>

<FlagPicker bind:nation />
<output data-testid="emitted">{nation}</output>
<output data-testid="emitted-type">{typeof nation}</output>
