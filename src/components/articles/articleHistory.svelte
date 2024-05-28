<script>
    import { Divider } from "$lib";
    import { onMount, tick } from 'svelte';
    import Api from '../../../helpers/ApiCall';

    export let article = {};
    export let endSroll = false;

    let limit = 50;
    let offset = 0;
    let count = -1;
    let articleHistory = [];

    const getUserName = (user) => {
        if (user == undefined) return ''
        return user.name //`${user.firstName} ${user.secondName} ${user.lastName} ${user.secondLastName}`;
    }

    const generateInfo = (history) => {

        let text = ''
        switch (history.description) {
            case 'create-active':
                text = `Se crea activo ${history.active.bar_code}`
                break;
            case 'update-active':
                text = `Se actualiza activo ${history.active.bar_code}`
                break;
            case 'delete-active':
                text = `Se elimina activo ${history.active.bar_code}`
                break;
            case 'create-article':
                text = `Se crea articulo ${history.article.code}`
                break;
            case 'update-article':
                text = `Se actualiza articulo ${history.article.code}`
                break;
            case 'delete-article':
                text = `Se elimina articulo ${history.article.code}`
                break;
            default:
                break;
        }

        return text
    }   

    const getHistory = async (article_id) => {
        console.log(`GET HISTORY ARTICLE`)
        console.log(article)
        if (count != -1 && offset > count) return
        let response = (await Api.call(`/history/article/${article_id}?limit=${limit}&offset=${offset}`, 'GET', {}, 'json', article.company_id))
        console.log(`RESPONSE GET HISTORY ARTICLE (${article_id}) -->`, response)
        if (response.success && response.statusCode == '200') {
            count = response.data.count
            if (response.data.count > 0) {
                articleHistory = [...articleHistory, ...response.data.result]
                return
            }
        } 
    }

    const formatDate = (date) => {
        if (date == undefined) return ''
        return date //.split('-').reverse().join('-')
    }

    const updateOffset = (end) => {
        if (!end) return
        offset += 10;
    }

    onMount(async () => {
        await getHistory(article.id)
    });

    $: updateOffset(endSroll);
    $: if(offset != 0) getHistory(article.id, offset);

</script>

<div class="main-history__article"> 
    {#each articleHistory as history}
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
            
            <p><strong>{ formatDate(history.creation_date) }</strong></p>
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