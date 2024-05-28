<script>
    import { Select } from "$lib";
    import Api from "../../../helpers/ApiCall";
    import Button from "../../lib/Button.svelte";
    import { lockOffice, lockStore } from "../../stores/store";
    import { onMount, createEventDispatcher, tick } from "svelte";

    export let companyId = 0;
    export let custom = false;
    export let isEdit = false;
    export let required = false;
    export let cleanStore = false;
    export let selectedOffice = 0;
    export let selectedSucursal = 0;  
    export let show = ['sucursal', 'office'];
    export { setValidOffice, setValidStore }

    let selectStore;
    let selectOffice;
    let offices = [];
    let sucursales = [];
    let disabledKeep = true;
    let disabledOffice = false;
    let keepOfficeIcon = false;
    let disabledSucursal = false;

    let request = false;

    let dispatch = createEventDispatcher();

    const setValidOffice = (status) => {
        selectOffice.setValid(status);
    }

    const setValidStore = (status) => {
        selectStore.setValid(status);
    }

    const getSucursales = async () => {
        if (request) return;
        if (companyId == 0) {
            sucursales = [];
            return;
        }; 
        request = true;
        let response = await Api.call(`/sucursalPorCompany/${companyId}`, 'GET');
        console.log('RESPONSE GET SUCURSALES --> ', response);
        if (response.success && response.statusCode === '200') {
            sucursales = response.data.result.map(r => ({ label: `${r.number} - ${r.description}`, value: r.id }));
        }
        else {
            sucursales = [];
        }
        request = false;
    };

    const getOfficesBySucursal = async (sucursalId) => {
        let response = await Api.call(`/officePorSucursal/${sucursalId}`, 'GET', {}, 'json', companyId);
        console.log('RESPONSE GET OFFICES --> ', response);
        if (response.success && response.statusCode === '200') {
            offices = response.data.result.map(r => ({ label: `${r.floor} - ${r.description}`, value: r.id }));
            await tick();
            if ($lockOffice > 0 && !cleanStore) {
                selectedOffice = $lockOffice;
            }
        }else{
            offices = []
        }
    };

    const getOffice = async (selectedOffice)=>{
        let response = await Api.call(`/office/${selectedOffice}`,'GET', {}, 'json', companyId)
        console.log('RESPONSE GET OFFICE --> ', response);
        if (response.success && response.statusCode === '200') {
            console.log("200")
            return response.data.result
        }
        return;
    }

    onMount(async () => {
        
        
        await getSucursales();
        
        if(isEdit){
            disabledOffice = false;
            disabledSucursal = false;
            let office = await getOffice(selectedOffice)
            if(office){
                selectedSucursal = office.sucursal_id
                await getOfficesBySucursal(office.sucursal_id)
                selectedOffice = office.id
            }
        }
        
    });

    $: if (selectedSucursal) {
        getOfficesBySucursal(selectedSucursal);
    }

    $: if (companyId) getSucursales();

</script>

{#if show.includes('sucursal')}
    {#key sucursales}
    <Select
        bind:this={ selectStore }
        {required}
        label="Sucursal"
        options={sucursales}
        customHeight={custom}
        disabled={disabledSucursal}
        selected={selectedSucursal}
        on:change={(event) => {
            console.log('CHANGE SUCURSAL -> ', event.detail)
            selectedSucursal = event.detail;
            selectedOffice = ''; // Resetear el valor de la oficina al cambiar la sucursal
            //getOfficesBySucursal(selectedSucursal);
            let store = sucursales.find(sucursal => sucursal.value == event.detail)
            dispatch('changeStore', { selectedSucursal, store })
        }}
    />
    {/key}
{/if}

{#if show.includes('office')}
    {#key offices}
    <Select
        bind:this={ selectOffice }
        {required}
        label="Oficina"
        options={offices}
        customHeight={custom}
        selected={selectedOffice}
        disabled={disabledOffice}
        on:change={(event) => {
            selectedOffice = event.detail
            disabledKeep = false
            // console.log('CHANGE OFFICE -> ', event.detail)
            let office = offices.find(office => office.value == event.detail)
            dispatch('changeOffice', { selectedOffice, office })    
        }}
    />
    {/key}
{/if}
