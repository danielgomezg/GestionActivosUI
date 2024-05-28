<script>
    import { Loading } from "$lib";
    import { user } from "../../stores/store";
    import Api from "../../../helpers/ApiCall";
    import { onDestroy, onMount } from "svelte";
    import CardSucursal from "./sucursalCard.svelte";
    import FormSucursal from "./formSucursal.svelte";
    import SucursalSearch from "./sucursalSearch.svelte";
    import OfficesInfo from "../offices/officesInfo.svelte";
    // import FormSucursalSave from "./formSucursalSave.svelte";
    import SheetHandler from "../SheetsHandler/sheetHandler.svelte";
        
    let props;
    let company;
    let limit = 50;
    let count = 0;
    let offset = 0;
    let stores = [];
    let modalContent;  
    let modalTitle = '';
    let loading = false;
    let openModal = false
    let backButton = false;
    let startSearch = false;


    const editStore = (sucursal) => {
        console.log('edit store > ', company)
        // modalTitle = `Sucursal ${sucursal.number}`
        modalTitle = 'Oficinas - Sucursal ' + sucursal.number
        // modalContent = FormSucursal;
        modalContent = OfficesInfo;
        props = { sucursal, company, readinfo: true}
        openModal = true
    }

    const getCompany = async (companyId) => {
        let response = (await Api.call(`/company/${companyId}`, 'GET'))
        console.log('RESPONSE GET Sucursales --> ', response)
        if (response.success) {
            company = response.data 
        } 
    }

    const getStores = async (companyId) => {
        if (offset > count) return;

        let response = (await Api.call(`/sucursalPorCompany/${companyId}?limit${limit}&offset=${offset}`, 'GET'))
        console.log('RESPONSE GET Sucursales --> ', response)
        if (response.success && response.statusCode == '200') {
            count = response.data.count
            stores = [...stores, ...response.data.result] 
        } 
    }

    const handleScroll = () => {
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
            offset = offset + limit;
            if ($user.company_id != undefined) getStores($user.company_id)
        }
    }

    onMount(async () => {
        console.log('mount content sucursal ', $user.company_id)
        if ($user.company_id != undefined) {
            await Promise.all([getStores($user.company_id), getCompany($user.company_id)])
            
            // getStores( $user.company_id)
        } 

        window.addEventListener('scroll', handleScroll)

    })

    onDestroy(() => {
        window.removeEventListener('scroll', handleScroll)
    })


</script>
    
<div style="position: relative">
    <div class="header-content" style="position: sticky; top: 40px; z-index: 3; background-color: #f0f0f0; padding: 34px 0 10px">
        <!-- <div class="desktop-only">
            <Button label="Nueva sucursal" custom on:click={ createSucursal } />
        </div> -->
        
        <div>
            <SucursalSearch
                bind:sucursales = {stores}
                companyId={$user.company_id}
                on:startSearch={ () => {
                    startSearch = true;
                } }
                on:removeSearch={ () => {
                    startSearch = false;
                    getStores($user.company_id)
                } }
            />
        </div>

    </div>
    

    <div class="flex-column gap-8" style="padding: 44px 0 10px;">
        {#if loading}
            <Loading />
        {/if}
        {#each stores as sucursal }    
            <CardSucursal 
                {sucursal} 
                on:edit={ (event) => editStore(event.detail) } 
                on:newStore={ (event) => editStore(event.detail) } 
                on:showStores={ (event) => editStore(event.detail) } 
            />
        {:else}
            <p>No hay sucursales</p>
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

<style>
    .companies-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .search-sucursal{
        display: flex;
        justify-content: end;
        align-items: center;
    }
</style>