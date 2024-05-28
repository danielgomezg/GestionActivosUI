<script>
    import { Search } from "$lib";
    import Api from "../../../helpers/ApiCall";
    import { createEventDispatcher } from "svelte";

    export let usuarios = [];

    let count = 0;
    let limit = 50;
    let searchText = '';
    let dispatch = createEventDispatcher();

    const searchUser = async (text) => {
        if (text == '') {
            return;
        } 

        let response = (await Api.call(`/users/search?search=${text}&limit=${limit}`, 'GET'));
        console.log('RESPONSE SEARCH USER -> ', response)
        if (response.success && response.statusCode == '200') {
            usuarios = response.data.result
            count = response.data.count
            if (count == 0) {
                dispatch('notFound')
            }
        }
       
    }

    $: searchUser(searchText)

</script>
<Search 
    bind:value={searchText} 
    on:removeSearch    
/>