<script>
    import { onMount } from "svelte";
    import Api from "../../../helpers/ApiCall";
    import CardProfile from "./cardProfile.svelte";
    import { Button, IconButton, Loading } from "$lib";
    import SheetHandler from "../SheetsHandler/sheetHandler.svelte";

    let props;
    let modalContent;  
    let modalTitle = '';
    let loading = false;
    let openModal = false; 
    let backButton = false;
    let profiles = [
        // {
        //     id: 1,
        //     name: 'Admin',
        //     actions: [
        //         "create-sucursal",
        //         "update-sucursal",
        //         "delete-sucursal",
        //         "create-oficina",
        //         "create-activo",
        //         "update-activo",
        //         "delete-activo",
        //         "delete-articulo",
        //         "create-usuario",
        //         "update-usuario",
        //         "delete-usuario",
        //         "delete-empresa"
        //     ]
        // },
        // {
        //     id: 1,
        //     name: 'Empresa',
        //     actions: []
        // }
    ]

    const getProfiles = async () => {
        loading = true;
        let response = (await Api.call('/profiles', 'GET'))
        console.log('RESPONSE GET PROFILES --> ', response)
        if (response.success && response.statusCode == "200") {
            profiles = response.data.result //empresas.set(response.data)
        } 
        loading = false;
    }

    

    onMount(async () => {
        await getProfiles();
    })


</script>

<div style="padding-top: 20px;">
    <div class="header-content" style="position: sticky; top: 40px; z-index: 3; background-color: #f0f0f0; padding: 34px 0 10px">
        <!-- <Button label="Nuevo perfil" on:click={ () => alert('En construcción.') } /> -->
        <!-- <IconButton icon="tune" /> -->
    </div>
    <br>

    <div class="body-content grid-columns-2">
        {#if loading}
            <Loading />
        {/if}
        {#each profiles as profile }    
            <CardProfile
                {profile} 
            />
        {/each}
    </div>
</div>

<SheetHandler
    {props}
    {modalTitle}
    {backButton}
    {modalContent}
    bind:openModal={openModal}
/>