<script>
    import { Search } from "$lib";
    import Api from "../../../helpers/ApiCall";
    import { createEventDispatcher } from "svelte";
    
    export let storeId = {};
    export let activos = [];
    export let officesId = [];
    export let limit = 0;
    export let count = 0;
    export let offset = 0;
    export let companyId = 0;

    let searchText = '';
    let startSearch = false;
    let dispatch = createEventDispatcher();

    const searchActiveStore = async (text) => {
        console.log('storeId > ', storeId)
        if (storeId.value == 0) return;

        if (!startSearch) dispatch('startSearch')
        startSearch = true;

        let response = (await Api.call(`/active/search/sucursal/${storeId.value}?search=${text}&limit=${limit}&offset=${offset}`, 'GET', {}, 'json', companyId));
        console.log('RESPONSE SEARCH ACTIVE -> ', response)
        if (response.success && response.statusCode == '200') {
            activos = response.data.result
            count = response.data.count
        }

    }

    const searchActiveOffice = async (text) => {
        console.log('search text -> ', text)
        if (text == '') {
            startSearch = false;
            dispatch('removeSearch')
            return;
        } 

        if (officesId.length == 0) {
            searchActiveStore(text)
            return;
        } 

        if (!startSearch) dispatch('startSearch')
        startSearch = true;

        let response = (await Api.call(`/active/search/offices/${officesId.join(',')}?search=${text}&limit=${limit}&offset=${offset}`, 'GET', {}, 'json', companyId));
        console.log('RESPONSE SEARCH ACTIVE-> ', response)
        if (response.success && response.statusCode == '200') {
            activos = response.data.result
            count = response.data.count

        }

    }

    $: searchActiveOffice(searchText, offset);
    // $: searchActiveStore(searchText);

</script>

<div>
    <Search 
        bind:value={searchText} 
        on:removeSearch    
    />
</div>