<script>
    import { Divider } from "$lib";
    import { onMount } from 'svelte';
    import Api from '../../../helpers/ApiCall';

    export let company = {};
    export let endSroll = false;

    let limit = 50;
    let offset = 0;
    let count = -1;
    let companyHistory = [];

    const getUserName = (user) => {
        if (user == undefined) return ''
        return `${user.firstName} ${user.secondName} ${user.lastName} ${user.secondLastName}`;
    }

    const formatLocation = (location) => {
        if (location == null) return ''
        return `${location.address}. ${location.commune}, ${location.region}`
    }

    const generateInfo = (history) => {

        let text = ''
        // console.log('HISTORY --> ', history)

        switch (history.description) {
            case 'create-sucursal':
                text = `Se crea sucursal ${history.sucursal.number}`
                break;
            case 'update-company':
                text = `Se ha actualizado la empresa ${history.company.name}`
                break;
            case 'delete-company':
                text = `Se ha eliminado la empresa ${history.company.name}`
                break;
            case 'create-company':
                text = `Se ha creado la empresa ${history.company.name}`
                break;
            case 'create-office':
                text = `Se ha creado la oficina ${history.office.floor}`
                break;
            case 'update-sucursal':
                text = `Se ha actualizado la sucursal ${history.sucursal.number}`
                break;
            case 'update-office':
                text = `Se ha actualizado la oficina ${history.office.floor}`
                break;
            case 'delete-office':
                text = `Se ha eliminado la oficina ${history.office.floor}`
                break;
            case 'delete-sucursal':
                text = `Se ha eliminado la sucursal ${history.sucursal.number}`
                break;	   
            default:
                break;
        }


        return text
    }   

    const getHistory = async (company_id) => {
        if (count != -1 && offset > count) return

        let response = (await Api.call(`/history/company/${company_id}?limit=${limit}&offset=${offset}`, 'GET'))
        console.log('RESPONSE GET Sucursales --> ', response)
        if (response.success && response.statusCode == '200') {
            count = response.data.count
            if (response.data.count > 0) {
                companyHistory = [...companyHistory, ...response.data.result] 
                return
            }
            // companyHistory = response.data.result 
        } 
    }

    const updateOffset = (end) => {
        if (!end) return
        offset += 10;
    }

    onMount(async () => {
        await getHistory(company.id)
    });

    $: updateOffset(endSroll);
    $: if(offset != 0) getHistory(company.id, offset);


</script>

<div>
    {#each companyHistory as history}
        <div style="display: flex; justify-content: space-between">
            <div>
                <p class="title-history"><strong>{ generateInfo(history) }</strong></p> 
                <!-- <p>{ getUserName(history.current_session_user_id) }</p> -->
                <table>
                    <!-- {#if history.description.includes('sucursal')}
                        <tr class="centered-row">
                            <td><span class="material-symbols-rounded">location_on</span></td>
                            <td>{ formatLocation(history.sucursal) }</td>
                        </tr>
                    {:else if history.description.includes('office')}
                        <tr class="centered-row">
                            <td><span class="material-symbols-rounded">info</span></td>
                            <td>{ `Piso: ${history.office.floor} - ${history.office.description}` }</td>
                        </tr>
                    {/if} -->
                    <tr class="centered-row">
                        <td><span class="material-symbols-rounded">person_edit</span></td>
                        <td>{ history.name_user }</td>
                    </tr>
                </table>
            </div>
            
            <p><strong>{history.creation_date.split('-').reverse().join('-')}</strong></p> 
        </div>
        <Divider />
    {:else}
        <p>No hay historial</p>
    {/each}
</div>
<style>
    .centered-row td {
        vertical-align: middle;
    }

    .title-history {
        font-size: larger;
    }
</style>