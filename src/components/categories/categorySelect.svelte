
<script>
    import { Select } from "$lib"
    import Api from "../../../helpers/ApiCall";
    import { onMount, createEventDispatcher } from "svelte";

    export let companyId = 0
    export let selected = ''
    export let customHeight = false

    let categorias = []
    let dispatch = createEventDispatcher();

    //Se obtiene las companias con el id y nombre solamente
    const getCategories = async () => {
        let response = (await Api.call('/categories/finals', 'GET', {}, 'json',  companyId))
        console.log('RESPONSE GET CATEGORIES --> ', response)
        if (response.success && response.statusCode == '200') {
            categorias = response.data.result.map(r => { return { label: r.description, value: r.id } })
        } 
    }

    onMount(() => {
        getCategories();
    })

</script>

{#key categorias}

<Select         
    on:change={e => {
        console.log('SELECTED CATEGORIE --> ', e.detail)
        dispatch('name', categorias.find(c => c.value == e.detail).label)
        dispatch('change', e.detail)
    }}
    {selected}
    {customHeight}
    label="Categoria"
    options={ categorias }
/>

{/key}