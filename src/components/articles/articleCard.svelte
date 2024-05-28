<script>
    import Api from "../../../helpers/ApiCall";
    import { snackbar, user } from "../../stores/store";
    import ReportActive from "../reports/report.svelte";
    import { createEventDispatcher, getContext, onMount } from "svelte";
    import { Card, IconButton, Button, Snackbar, Menu } from "$lib";

    export let article = {}

    let imageUrl;
    let openActions = false;
    let openSnackbar = false;
    let messageSnackbar = '';
    let dispath = createEventDispatcher();
    let removeArticle = getContext('removeArticle');

    const getImage = async (name) => {
        if (name == '') return null;
        if (name == null) return null;
        name = name.split(',')[0];

        let response = (await Api.callImage('/image_article/' + name));
        console.log('RESPONSE GET IMAGE -> ', response)
        if (response != null) {
            imageUrl = response;
        }
    }

    const deleteArticle = async () => {
        // let confirmacion = confirm('Esta seguro que desea eliminar el articulo ', article.name)
        // if(!confirmacion) return;

        let response = (await Api.call(`/article/${article.id}`, 'DELETE', {}, 'json', article.company_id));
        console.log('RESPONSE DELETE ARTICLE -> ', response)
        if (response.success && response.statusCode == '201') {
            removeArticle(article.id)

            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Artículo eliminado."
                return snk
            })

        } else {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al eliminar."
                return snk
            })
        }
    }

    $: getImage(article.photo)

</script>

<Snackbar 
    bind:open={ openSnackbar }
    type="confirm"
    message={messageSnackbar}
    on:confirm={ deleteArticle }
/>

<Card>
    <div class="card-container">
        <div class="card-header" style="align-items: flex-start;">
            <div class="flex-row gap-8 ">
                <div class="content-image">
                    {#if article.photo == ''}
                        <img src="https://via.placeholder.com/150" class="article-image" alt={article.name} />
                    {:else}
                        <img src={ imageUrl } class="article-image" alt={article.name} />
                    {/if}
                </div>
                <div class="flex-column">
                    <div class="card-title">{ article.name }</div>
                </div>
            </div>
            <div class="desktop-only">
                <!-- <ReportActive 
                    type="btn-icon"
                    id={ article.id } 
                    label="Reporte activos"
                /> -->
                <IconButton icon="history" tooltipId="btn-history__{article.name}" disabled={$user.profile_id == 2} tooltipText="Historial" on:click={ dispath("history", article) } />
                <IconButton icon="edit" tooltipId="btn-edit__{article.name}" tooltipText="Editar" on:click={ dispath("edit", { article: {...article}, imageUrl}) } />
                {#if $user.profile_id != 2}
                    <IconButton 
                        icon="delete" 
                        tooltipId="btn-delete__{article.name}" 
                        tooltipText="Eliminar"
                        on:click={ () => {
                            messageSnackbar = '¿Eliminar el artículo ' + article.name + '?'
                            openSnackbar = true;
                    } } />

                {/if}
            </div>
            <div class="mobile-only">
                <Menu
                    bind:open={openActions}
                    options={
                        [
                            { label: "Historial", dispatch: "history", hide: $user.profile_id == 2},
                            { label: "Editar", dispatch: "edit"},
                            { label: "Eliminar", dispatch: "delete", hide: $user.profile_id == 2}
                        ]  
                    }
                    on:edit={() => dispath("edit", { article: {...article}, imageUrl}) }
                    on:history={() => dispath("history", article) }
                    on:delete={() => {
                        messageSnackbar = '¿Eliminar el artículo ' + article.name + '?'
                        openSnackbar = true;
                    }}
                >
                  <IconButton icon="more_vert" on:click={() => openActions = !openActions } />
                </Menu>
            </div>
        </div>
        <div class="card-content">
            <div class="responsive-table">
                <table>
                    <tr>
                        <td><span class="material-symbols-rounded">barcode</span></td>
                        <td>{ article.code }</td>
                    </tr>
                    <tr>
                        <td><span class="material-symbols-rounded">category</span></td>
                        <td>{ article.category?.description || '' }</td>
                    </tr>
                    
                    <tr>
                        <td><span class="material-symbols-rounded">inventory_2</span></td>
                        <td>{ article.count_active || 0 } activos</td>
                    </tr>
                </table>
            </div>
            <div class="responsive-table">
                <table>
                    <tr>
                        <td><span class="material-symbols-rounded">event</span></td>
                        <td>{ article.creation_date }</td>
                    </tr>
                    <tr>
                        
                    </tr>
                    <tr>
                        <td><span class="material-symbols-rounded">notes</span></td>
                        <td class="description">{ article.description }</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="card-actions">
            <Button label="Ver activos" type="outlined" color="" on:click={ dispath("showActivos", article) } />
            <Button label="Nuevo activo" disabled={ $user.profile_id == 2 } custom on:click={ dispath("newActivo", article) } />
        </div>
    </div>
</Card>

<style>
    .description {
        display: flex;
        /* max-height: 50px; */
        height: 65px;
        overflow-y: auto;
        width: 500px;
        flex-flow: wrap;
    }

    td {
        vertical-align: top;
    }

    .card-content {
        display: flex;
        align-items: flex-start;
        gap: 50px;
    }
</style>