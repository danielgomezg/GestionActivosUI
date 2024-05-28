<script>
    import { Search } from "$lib";
    import Api from "../../../helpers/ApiCall";
    import { createEventDispatcher } from "svelte";

    export let empresas = [];

    let limit = 50;
    let offset = 0;
    let count = 0;
    let searchText = '';
    let dispatch = createEventDispatcher();

    const searchCompany = async (text) => {
        if (text == '') {
            return;
        } 

        let response = (await Api.call(`/company/search?search=${text}&limit=${limit}&offset=${offset}`, 'GET'));
        console.log('RESPONSE SEARCH COMPANY -> ', response)
        if (response.success && response.statusCode == '200') {
            empresas = response.data.result
            count = response.data.count
            if (count == 0) {
                dispatch('notFound')
            }
        }
       
    }

    $: searchCompany(searchText)

</script>
<Search 
    bind:value={searchText} 
    on:removeSearch    
/>
