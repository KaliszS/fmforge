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

    const formattedDate = $derived.by(() => {
        if (!birthdate) return "";

        const [dayStr, monthStr, year] = birthdate.split("/");
        const day = parseInt(dayStr, 10);
        const monthIndex = parseInt(monthStr, 10) - 1;

        const monthName = MONTHS[monthIndex] ?? "???";
        return `${day} ${monthName} ${year}`;
    });
</script>

<section title="birthdate (DD/MM/YYYY)">
    <strong>{formattedDate} </strong>
</section>

<style>
    section {
        margin-left: 3.35em;
        margin-top: -0.25em;
        align-items: center;
        font-size: 0.75em;
        color: #5c4527;
        white-space: nowrap;
    }
</style>
