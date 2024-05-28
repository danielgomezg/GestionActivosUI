<script>
    import Api from "../../../helpers/ApiCall";
    import { getContext, onMount } from "svelte";
    import { snackbar, user } from "../../stores/store";
    import { estadosActivo } from "../../stores/store";
    import { Divider, IconButton, Snackbar, Menu } from "$lib";

    export let article = {};
    export let company_id = 0;
    export let endSroll = false;

    let limit = 50;
    let offset = 0;
    let count = 0;
    let activos = [];
    let activeDocument;
    let activoToDelete = {};
    let openSnackbar = false;
    let messageSnackbar = '';
    let openActions = [];

    let editActivo = getContext('editActivo')
    let addActivoCount = getContext('addActivoCount');

    const loadImages = async (acts) => {
        for (let i = 0; i < acts.length; i++) {
            if (acts[i].photo1 == null || acts[i].photo1 == "") continue;
            let r = await getImage(acts[i].photo1)
            let activo = acts.find(act => act.id == acts[i].id)
            activo.urlphoto1 = r;
        }
        console.log('ACTIVOS IMAGES --> ', acts)
        activos = [...acts]

    }

    const getImage = async (name) => {
        if (name == '') return null;
        

        let response = (await Api.callImage('/image_active/' + name));
        console.log('RESPONSE GET IMAGE -> ', response)
        if (response != null) {
            return response;
        }
        return '';
    }

    const getActives = async () => {
        if (offset > count) return

        let response = (await Api.call(`/activePorArticle/${article.id}?limit=${limit}&offset=${offset}`, 'GET', {}, 'json', company_id))
        console.log('RESPONSE GET ACTIVES --> ', response)
        if (response.success && response.statusCode == '200') {
            count = response.data.count
            if (response.data.count > 0) {
                activos = [...activos, ...response.data.result] 
                await loadImages(response.data.result);
                return
            }
            // activos = response.data.result
        } 
    }

    const deleteActive = async (activo) => {

        let response = (await Api.call(`/active/${activo.id}`, 'DELETE', {}, 'json', company_id));
        console.log('RESPONSE DELETE ACTIVE -> ', response)
        if (response.success && response.statusCode == '201') {

            activos = activos.filter(act => act.id !== activo.id);

            addActivoCount(article.id, -1)

            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Activo eliminado con éxito."
                return snk
            })

        } else {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al eliminar activo."
                return snk
            })
        }
    }

    const downloadDocument = async (activo) => {
        console.log(activo)
        let host = '';
        if (import.meta.env.MODE == 'production') host = `https://45-33-99-148.ip.linodeusercontent.com/api`
        else host = `http://127.0.0.1:9000`	

        fetch(`${host}/file_active/${activo.accounting_document}`)
            .then(response => response.blob())
            .then(document => {
                let objectURL = URL.createObjectURL(document);
                activeDocument = objectURL;
                window.open(objectURL)

            })
            .catch(error => console.error(error));
    }

    const updateOffset = (end) => {
        if (!end) return
        offset += limit;
    }

    onMount(async () => {
        offset = 0;
        await getActives()
    })

    $: updateOffset(endSroll);
    $: if(offset != 0) getActives();
    $: console.log('ACTIVOS --> ', activos)

</script>

<Snackbar 
    bind:open={ openSnackbar }
    type="confirm"
    message={ messageSnackbar }
    on:confirm={ deleteActive(activoToDelete) }
/>

<div>
    {#each activos as activo, index}
        <div>
            <div class="info__title">
                <div>    
                    <div style="display: flex; gap: 8px">
                        <span class="material-symbols-rounded">barcode</span>
                        {#if activo.bar_code != ''}
                            <strong>{ activo.bar_code }</strong>
                        {:else if activo.virtual_code != ''}
                            <strong>{ activo.virtual_code + ' (virtual)' }</strong>
                        {/if}
                    </div>
                    <h5>{ `Adquirido el ${activo.acquisition_date} - Agregado el ${activo.creation_date}` }  </h5>
                </div>
                <div class="mobile-only">
                    <Menu
                        id={`store_${index}`}
                        bind:open={openActions[index]}
                        options={
                            [
                                { label: "Documento contable", dispatch: "document", disabled: !activo.accounting_document},
                                { label: "Editar", dispatch: "edit"},
                                { label: "Eliminar", dispatch: "delete", hide: $user.profile_id == 2}
                            ]  
                        }
                        on:document={() => downloadDocument(activo) }
                        on:edit={() => editActivo(activo, article, company_id) }
                        on:delete={() => {
                            activoToDelete = activo;
                            messageSnackbar = '¿Eliminar el activo ' + activo.bar_code + '?'
                            openSnackbar = true;
                        }}
                    >
                      <IconButton icon="more_vert" on:click={() => openActions[index] = !openActions[index] } />
                    </Menu>
                </div>
                <div class="desktop-only">
                    {#if activo.accounting_document}
                        <IconButton icon="description" tooltipId="btn-doc__{activo.bar_code}" tooltipText="Documento contable" on:click={ () => downloadDocument(activo) } />
                    {/if}
                    <IconButton icon="edit" tooltipId="btn-edit__{activo.bar_code}" tooltipText="Editar" on:click={ () => editActivo(activo, article, company_id) } />
                    <IconButton 
                        icon="delete" 
                        tooltipId="btn-delete__{activo.bar_code}" 
                        disabled
                        tooltipText="Eliminar" 
                        on:click={ () => {

                            activoToDelete = activo;
                            messageSnackbar = '¿Eliminar el activo ' + activo.bar_code + '?'
                            openSnackbar = true;

                        } } />
                </div>
            </div>
            <div style="display: flex; justify-content: space-between;">    
                <div>
                    <li>{ `Serie: ${activo.serie}` }</li>
                    <li>{ `Modelo: ${activo.model}` }</li>
                    <li>{ `Marca: ${activo.brand}` }</li>
                    <li>{ `Responsable: ${activo.name_in_charge_active}, ${activo.rut_in_charge_active}` }</li>
                    <li>{ `Estado: ${ activo.state } ${ activo.comment != '' ? `(${activo.comment })` : '' }` }</li>
                    
                </div>
                {#if activo.urlphoto1}
                    <div class="content-image" style="margin: 0 auto;">
                        <img src={ activo.urlphoto1 } class="article-image" alt={activo.bar_code} />
                    </div>
                {/if}
                
            </div>
            <!-- <div class="info__description">
                {activo.description}
            </div> -->
        </div>  
        <Divider />  
    {:else}
        <p>El articulo no cuenta con activos.</p>
    {/each}

</div>

<style>
    .info__title {
        font-size: 16px;
        /* font-weight: bold;     */
        display: flex;
        align-items: center;
        justify-content: space-between;
    }


</style>