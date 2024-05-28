<script>
    import { Divider } from "$lib";
    import { onMount } from 'svelte';
    import Api from '../../../helpers/ApiCall';


    export let type = '';
    export let company = {}
    
    let companyHistory = [];

    const getUserName = (user) => {
        return `Usuario: ${user.firstName} ${user.secondName} ${user.lastName} ${user.secondLastName}`;
    }

    const formatLocation = (location) => {
        // address, region, commune, city
        return `${location.address} ${location.commune}, ${location.region}`
    }

    const generateInfo = (history) => {

        let text = ''

        switch (history.description) {
            case 'create-sucursal':
                // let user = getUserName(history.current_session_user_id)
                text = `Se crea sucursal ${history.sucursal_id.number}`
                break;
            case 'update':
                text = `Se ha actualizado la empresa ${history.company_name}`
                break;
            case 'delete':
                text = `Se ha eliminado la empresa ${history.company_name}`
                break;
            default:
                break;
        }


        return text
    }

    const getCompanyHistory = async (company_id) => {
        let response = (await Api.call(`/history/company/${company_id}`, 'GET'))
        console.log('RESPONSE GET Sucursales --> ', response)
        if (response.success && response.statusCode == '200') {
            companyHistory = response.data.result 
        } 
    }

    onMount(async () => {
        switch (type) {
            case 'company':
                getCompanyHistory(company.id)
                break;
            case 'sucursal':
                break;
            default:
                break;
        }
    });

</script>

<div>
    {#each companyHistory as history}
        <div style="display: flex; justify-content: space-between">
            <div>
                <p><strong>{ generateInfo(history) }</strong> { formatLocation(history) } </p> 
                <p>{ getUserName(history.current_session_user_id) }</p>
            </div>
            
            <p class="italic"><strong>{history.creation_date.split('-').reverse().join('-')}</strong></p> 
        </div>
        <Divider />
    {:else}
        <p>No hay historial</p>
    {/each}
</div>
<style>
    .italic {
        font-style: italic;
    }
</style>