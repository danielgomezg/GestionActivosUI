<script>
    import { Select } from "$lib";
    import { createEventDispatcher } from "svelte";
    import { locationsPeru } from "../../../helpers/locations/peru.js";
    import { regionCiudades, ciudadComunas } from "../../../helpers/locations/chile.js";

    export let country = "chile";
    export let selectedCity = "";
    export let selectedRegion = "";
    export let selectedComuna = "";

    export let disabledCity = false;
    export let disabledRegion = false;
    export let disabledComuna = false;

    let dispatch = createEventDispatcher()

    let comunas = []
    let ciudades = []

</script>

{#if country == "chile"}

    <Select 
        label="Región"
        disabled={ disabledRegion }
        selected={ selectedRegion }
        options={ Object.keys(regionCiudades).map(region => { return { label: region, value: region }})}
        on:change={ (event) => {
            console.log('select region > ', event.detail)
            selectedCity = "";
            dispatch("setRegion", event.detail);
            if (event.detail == "") return;
            ciudades = regionCiudades[event.detail].map(ciudad => { return { label: ciudad, value: ciudad } })
        }}
    />

    {#key ciudades}

    <Select 
        label="Ciudad"
        disabled={ disabledCity }
        selected={ selectedCity }
        options={ ciudades }
        on:change={ (event) => {
            console.log('select city > ', event.detail)
            // selectedComuna = "";
            dispatch("setCity", event.detail);
            if (event.detail == "") return;
            comunas = ciudadComunas[event.detail].map(comuna => { return { label: comuna, value: comuna } })
        }}
        on:empty={ () => { 
            console.log('empty city')
            selectedComuna = "";
        }}
    />

    {/key}

{:else}

    <Select 
        label="Provincia"
        disabled={ disabledRegion }
        selected={ selectedRegion }
        options={ Object.keys(locationsPeru).map(region => { return { label: region, value: region }})}
        on:change={ (event) => {
            dispatch("setRegion", event.detail);;
            if (event.detail == "") return;
            comunas = locationsPeru[event.detail].map(distrito => { return { label: distrito, value: distrito } })
        }}
    />

{/if}



{#key comunas}

<Select 
    label="Comuna"
    disabled={ disabledComuna }
    selected={ selectedComuna }
    options={ comunas }
    on:change={ (event) =>  {
        console.log('select comuna > ', event.detail)
        dispatch("setComuna", event.detail)
        setTimeout(() => {
                // dispatch("setComuna", comunas[0].value)
            }, 10000000)
    } }
/>

{/key}