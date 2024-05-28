<script>
    import { Search } from "$lib";
    import Api from "../../../helpers/ApiCall";
    import { createEventDispatcher } from "svelte";

    export let articles = [];
    export let company_id

    let count = 0;
    let limit = 50;
    let searchText = '';
    let dispatch = createEventDispatcher();

    const searchArticle = async (text) => {
        if (text == '') {
            return;
        } 

        let response = (await Api.call(`/articles/search/${company_id}?search=${text}&limit=${limit}`, 'GET'));
        console.log('RESPONSE SEARCH ARTICLE-> ', response)
        if (response.success && response.statusCode == '200') {
            articles = response.data.result;
            count = response.data.count;
            if (count == 0) {
                dispatch('notFound')
            }
        }
       
    }

    $: searchArticle(searchText)

</script>
<!-- <div> -->
    <Search 
        bind:value={searchText} 
        on:removeSearch    
    />
<!-- </div> -->