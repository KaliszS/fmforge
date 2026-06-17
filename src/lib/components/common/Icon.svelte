<script lang="ts">
    import { icons, type IconName } from '$lib/icons';

    let {
        name,
        size = '1em',
        strokeWidth,
        fill = 'none',
        class: className = '',
    }: {
        name: IconName;
        size?: string | number;
        strokeWidth?: number;
        fill?: 'none' | 'currentColor';
        class?: string;
    } = $props();

    const icon = $derived(icons[name]);
    const resolvedStrokeWidth = $derived(fill === 'currentColor' ? 0 : (strokeWidth ?? icon.strokeWidth ?? 2));
    const resolvedSize = $derived(typeof size === 'number' ? `${size}px` : size);
    const resolvedStroke = $derived(fill === 'currentColor' ? 'none' : 'currentColor');
</script>

<svg
    width={resolvedSize}
    height={resolvedSize}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={resolvedStroke}
    stroke-width={resolvedStrokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
    class={className}
    aria-hidden="true"
>
    {@html icon.inner}
</svg>
