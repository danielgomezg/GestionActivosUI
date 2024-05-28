<script>
    import { onMount } from "svelte";
    import Api from "../../../helpers/ApiCall";
    import { snackbar } from "../../stores/store";
    import { TextField, Button, Divider, IconButton, Snackbar } from "$lib";
    import SelectCountryLocations from "../selectCountry/selectCountryLocations.svelte";

    export let sucursal = { }, company = { }, readinfo = false;

    let message = ""
    let offices = [];
    let editing = -1
    let officeEdit = {}
    let addOffice = false
    let officeToDelete = {};
    let openSnackbar = false;
    let messageSnackbar = '';


    function toggleEdit(office, index) {
        if (editing == index) {
            editing = -1;
            return;
        }

        officeEdit = { ...office }
        addOffice = false
        editing = index
    }

    const getOffices = async (id_sucursal) => {
        console.log(company)
        let response = (await Api.call(`/officePorSucursal/${id_sucursal}`, 'GET', {}, 'json', company.result.id ))
        console.log('RESPONSE GET Offices --> ', response)
        if (response.success) {
            offices = response.data.result
        } 
    }

    const formatOfficeInfo = (office) => {
        let name = office.name_in_charge == undefined ? '' : " - " + office.name_in_charge
        return office.floor  + ' - ' + office.description + name
    }

    onMount(async () => {    
        if(sucursal.id > 0 ){
            await getOffices(sucursal.id)
        }
    })

</script>

{#if offices.length == 0}
    <p>La sucursal no cuenta con oficinas.</p>
{:else}

    <div class="form">
        {#each offices as office, index} 
            <div class="responsive-table">
                <table class="grid-col-span-2">
            
                    <tr>
                        <td><span class="material-symbols-rounded">tag</span></td>
                        <td>{ `Piso : ` + office.floor }</td>
                    </tr>
                    <tr>
                        <td><span class="material-symbols-rounded">notes</span></td>
                        <td>{ office.description }</td>
                    </tr>
                    <tr>
                        <td><span class="material-symbols-rounded">contact_emergency</span></td>
                        <td>{ office.name_in_charge == undefined ? '' : office.name_in_charge }</td>
                    </tr>        
                </table>
                <div class="grid-col-span-2">
                    <Divider />
                </div>
            </div>
        {/each}
    </div>

{/if}