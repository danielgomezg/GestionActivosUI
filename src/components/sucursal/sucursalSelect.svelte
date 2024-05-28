<script>
    import { Select } from "$lib"
    import { onMount } from "svelte";
    import Api from "../../../helpers/ApiCall";

    export let selected = ''
    export let customHeight = false
    export let companyId = 0

    let sucursal = []

    //Se obtiene las companias con el id y nombre solamente
    const getSucursales = async () => {
        let response = (await Api.call('/companiesIdName', 'GET'))
        console.log('RESPONSE GET COMPANIES --> ', response)
        if (response.success && response.statusCode == '200') {
            companies = response.data.result.map(r => { return { label: r.name, value: r.id } })
        } 
    }

    onMount(() => {
        getSucursales();
    })

    

</script>

{#key companies}

<Select         
    on:change
    {selected}
    {customHeight}
    label="Empresa"
    options={ companies }
/>

{/key}