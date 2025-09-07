<script lang="ts">
    let {
        birthdate = $bindable(),
        edit_mode,
    }: { birthdate: string; edit_mode: boolean } = $props();

    const MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // Convert DD/MM/YYYY to YYYY-MM-DD for date input
    const dateInputValue = $derived.by(() => {
        if (!birthdate) return "";
        
        const [day, month, year] = birthdate.split("/");
        if (day && month && year) {
            // Ensure two digits for day and month
            const paddedDay = day.padStart(2, "0");
            const paddedMonth = month.padStart(2, "0");
            return `${year}-${paddedMonth}-${paddedDay}`;
        }
        return "";
    });

    // Convert YYYY-MM-DD back to DD/MM/YYYY
    function handleDateChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const dateValue = target.value;
        
        if (dateValue) {
            const [year, month, day] = dateValue.split("-");
            birthdate = `${day}/${month}/${year}`;
        } else {
            birthdate = "";
        }
    }

    const formattedDate = $derived.by(() => {
        if (!birthdate) return "";

        const [dayStr, monthStr, year] = birthdate.split("/");
        const day = parseInt(dayStr, 10);
        const monthIndex = parseInt(monthStr, 10) - 1;

        const monthName = MONTHS[monthIndex] ?? "???";
        return `${day} ${monthName} ${year}`;
    });
</script>

{#if edit_mode}
    <input
        type="date"
        value={dateInputValue}
        onchange={handleDateChange}
        class="input"
        title="Birthdate"
    />
{:else}
    <section title="birthdate (DD/MM/YYYY)">
        <strong>{formattedDate} </strong>
    </section>
{/if}

<style>
    section {
        margin-left: 3.35em;
        margin-top: -0.25em;
        align-items: center;
        font-size: var(--font-xs);
        color: #5c4527;
        white-space: nowrap;
    }

    /* Edit mode styling */
    :global(.edit-mode) input[type="date"] {
        min-width: 6rem;
        text-align: center;
    }
</style>
