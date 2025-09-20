<script lang="ts">
    import { modSettings, type ModSettings } from '$lib/stores/modSettings';
    
    let {
        birthdate = $bindable(),
        edit_mode,
    }: { birthdate: string; edit_mode: boolean } = $props();

    const MONTHS = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    function calculateRealBirthdate(inGameDate: string, settings: ModSettings): string {
        if (!settings.fmEdition || !settings.retroYear || !inGameDate) return inGameDate;
        const [day, month, year] = inGameDate.split("/");
        if (!day || !month || !year) return inGameDate;
        const inGameYear = parseInt(year);
        const fmEdition = parseInt(settings.fmEdition);
        const retroYear = parseInt(settings.retroYear);
        const realYear = inGameYear - (fmEdition - 1 - retroYear);
        return `${day}/${month}/${realYear}`;
    }

    function calculateInGameBirthdate(realDate: string, settings: ModSettings): string {
        if (!settings.fmEdition || !settings.retroYear || !realDate) return realDate;
        const [day, month, year] = realDate.split("/");
        if (!day || !month || !year) return realDate;
        const realYear = parseInt(year);
        const fmEdition = parseInt(settings.fmEdition);
        const retroYear = parseInt(settings.retroYear);
        const inGameYear = realYear + (fmEdition - 1 - retroYear);
        return `${day}/${month}/${inGameYear}`;
    }

    function handleDateChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const dateValue = target.value;
        
        console.log('handleDateChange called with:', dateValue);
        
        if (dateValue) {
            const [year, month, day] = dateValue.split("-");
            const newDate = `${day}/${month}/${year}`;
            
            // Get current store value synchronously
            let currentSettings: ModSettings = {
                fmEdition: '',
                retroYear: '',
                showRealBirthDates: false,
                canToggle: false
            };
            const unsubscribe = modSettings.subscribe(s => currentSettings = s);
            unsubscribe();
            
            console.log('Current settings:', currentSettings);
            console.log('New date:', newDate);
            
            if (currentSettings.showRealBirthDates && currentSettings.canToggle) {
                // If showing real dates, convert the entered real date to in-game date
                const inGameDate = calculateInGameBirthdate(newDate, currentSettings);
                console.log('Converting real date to in-game:', newDate, '->', inGameDate);
                birthdate = inGameDate;
            } else {
                // If showing in-game dates, store directly
                console.log('Storing in-game date directly:', newDate);
                birthdate = newDate;
            }
            
            console.log('Final birthdate:', birthdate);
        } else {
            birthdate = "";
        }
    }

    const formattedDate = $derived.by(() => {
        if (!birthdate) return "";
        const dateToShow = $modSettings.showRealBirthDates && $modSettings.canToggle 
            ? calculateRealBirthdate(birthdate, $modSettings) 
            : birthdate;
        const [dayStr, monthStr, year] = dateToShow.split("/");
        const day = parseInt(dayStr, 10);
        const monthIndex = parseInt(monthStr, 10) - 1;
        const monthName = MONTHS[monthIndex] ?? "???";
        return `${day} ${monthName} ${year}`;
    });

    const dateInputValue = $derived.by(() => {
        if (!birthdate) return "";
        const dateToShow = $modSettings.showRealBirthDates && $modSettings.canToggle 
            ? calculateRealBirthdate(birthdate, $modSettings) 
            : birthdate;
        const [day, month, year] = dateToShow.split("/");
        if (day && month && year) {
            const paddedDay = day.padStart(2, "0");
            const paddedMonth = month.padStart(2, "0");
            return `${year}-${paddedMonth}-${paddedDay}`;
        }
        return "";
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
        <strong>{formattedDate}</strong>
    </section>
{/if}

<style>
    section {
        margin-left: 3.35em;
        margin-top: -0.25em;
        align-items: center;
        font-size: var(--font-xs);
        color: var(--color-text-muted);
        white-space: nowrap;
    }

    :global(.edit-mode) input[type="date"] {
        min-width: 6rem;
        text-align: center;
    }
</style>
