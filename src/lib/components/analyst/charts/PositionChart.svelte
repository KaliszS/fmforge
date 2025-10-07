<script lang="ts">
    import { onMount } from 'svelte';
    import * as Plot from '@observablehq/plot';

    let { data }: { data: Record<string, number> } = $props();
    let chartContainer: HTMLDivElement;

    onMount(() => {
        if (Object.keys(data).length === 0) return;

        // Convert data to array format for Plot
        const chartData = Object.entries(data).map(([position, count]) => ({
            position,
            count
        }));

        // Sort by count descending for better visualization
        chartData.sort((a, b) => b.count - a.count);

            const plot = Plot.plot({
                marginLeft: 180,
                marginBottom: 40,
                marginTop: 20,
                marginRight: 40,
                width: 700,
                height: 300,
                background: "transparent",
                x: {
                    label: "Number of Players",
                    labelOffset: 30,
                    grid: true,
                    gridOpacity: 0.2,
                    ticks: 5,
                    tickSize: 4
                },
                y: {
                    label: null,
                    domain: chartData.map(d => d.position),
                    padding: 0.15
                },
                marks: [
                    Plot.barX(chartData, {
                        x: "count",
                        y: "position",
                        fill: (d, i) => {
                            // Option 1: Single color with opacity variation
                            return "#396cd8";
                            
                            // Option 2: Gradient based on value (uncomment to use)
                            // const maxCount = Math.max(...chartData.map(d => d.count));
                            // const intensity = d.count / maxCount;
                            // return `hsl(220, 70%, ${50 + intensity * 30}%)`;
                            
                            // Option 3: Two-tone scheme (uncomment to use)
                            // return i % 2 === 0 ? "#396cd8" : "#5a8cff";
                            
                            // Option 4: Value-based colors (uncomment to use)
                            // if (d.count > 50) return "#396cd8";      // High: Primary blue
                            // if (d.count > 20) return "#5a8cff";      // Medium: Light blue
                            // return "#8abcff";                        // Low: Very light blue
                        },
                        fillOpacity: (d, i) => {
                            // Create variation through opacity (0.6 to 1.0)
                            return 0.6 + (i * 0.4) / Math.max(chartData.length - 1, 1);
                        },
                        stroke: "white",
                        strokeWidth: 1,
                        rx: 4, // Rounded corners
                        ry: 4
                    }),
                    Plot.text(chartData, {
                        x: "count",
                        y: "position",
                        text: "count",
                        dx: 10,
                        fill: "white",
                        fontSize: 11,
                        fontWeight: "bold",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                    })
                ],
            color: {
                range: ["var(--color-primary)"]
            }
        });

        chartContainer.appendChild(plot);
    });

    // Re-render when data changes
    $effect(() => {
        if (chartContainer && Object.keys(data).length > 0) {
            // Clear previous chart
            chartContainer.innerHTML = '';
            
            // Convert data to array format for Plot
            const chartData = Object.entries(data).map(([position, count]) => ({
                position,
                count
            }));

            // Sort by count descending for better visualization
            chartData.sort((a, b) => b.count - a.count);

            const plot = Plot.plot({
                marginLeft: 180,
                marginBottom: 40,
                marginTop: 20,
                marginRight: 40,
                width: 700,
                height: 300,
                background: "transparent",
                x: {
                    label: "Number of Players",
                    labelOffset: 30,
                    grid: true,
                    gridOpacity: 0.2,
                    ticks: 5,
                    tickSize: 4
                },
                y: {
                    label: null,
                    domain: chartData.map(d => d.position),
                    padding: 0.15
                },
                marks: [
                    Plot.barX(chartData, {
                        x: "count",
                        y: "position",
                        fill: (d, i) => {
                            return "#396cd8";
                        },
                        fillOpacity: (d, i) => {
                            // Create variation through opacity (0.6 to 1.0)
                            return 0.6 + (i * 0.4) / Math.max(chartData.length - 1, 1);
                        },
                        stroke: "white",
                        strokeWidth: 1,
                        rx: 4, // Rounded corners
                        ry: 4
                    }),
                    Plot.text(chartData, {
                        x: "count",
                        y: "position",
                        text: "count",
                        dx: 10,
                        fill: "white",
                        fontSize: 11,
                        fontWeight: "bold",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                    })
                ],
                color: {
                    range: ["var(--color-primary)"]
                }
            });

            chartContainer.appendChild(plot);
        }
    });
</script>

<div class="position-chart">
    <div class="chart-container" bind:this={chartContainer}></div>
</div>

<style>
    .position-chart {
        margin-top: var(--spacing-lg);
    }

    .chart-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
        min-width: 720px;
        background: linear-gradient(135deg, var(--color-background-light) 0%, var(--color-background) 100%);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-xl);
        padding: var(--spacing-lg);
        overflow-x: auto;
        box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        position: relative;
    }

    .chart-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        border-radius: var(--radius-xl);
        pointer-events: none;
    }

    [data-theme="dark"] .chart-container {
        background: linear-gradient(135deg, var(--color-background) 0%, var(--color-background-light) 100%);
        border-color: var(--color-border);
        box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    [data-theme="dark"] .chart-container::before {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    }
</style>
