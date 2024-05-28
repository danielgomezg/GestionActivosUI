<script>
    import { IconButton, Button } from "$lib";
    import { user, lockStore, lockOffice } from "../../stores/store";
    import { navigate } from "svelte-routing";
    import Api from "../../../helpers/ApiCall";
    import { onMount, onDestroy } from "svelte";
    import FormUsuarios from "../usuarios/formUsuarios.svelte";
    import SheetHandler from "../SheetsHandler/sheetHandler.svelte";

    let openOptions = false, openModal = false, modalTitle = '', props = {}, modalContent;
    let companiesDB = [], companiesSelect = []
    
    const editUser = () => {
        modalTitle = 'Editar usuario'
        modalContent = FormUsuarios;

        props = { 
            usuario: $user,
            companies: companiesSelect,
            accion: 'edit',
            showPassword: true, 
            editself: true
        }

        openModal = true
    }

    const logout = () => {
        // localStorage.removeItem('user');
        // localStorage.removeItem('accessToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        user.set({})
        lockStore.set(0)
        lockOffice.set(0)

        navigate("/login", {replace: true})
        return;
    }

    const handleAccountOptions = (event) => {
        if (openOptions && !event.target.closest('.account-container')){
            openOptions = false
        }
    }

    //Se obtiene las companias con el id y nombre solamente
    const getCompanyNameId = async () => {
        if (!$user.profileActions.includes('get-empresa')) return
        //loading = true;
        let response = (await Api.call('/companiesIdName', 'GET'))
        console.log('RESPONSE GET COMPANIES --> ', response)
        if (response.success && response.statusCode == "200") {
            companiesDB = response.data.result
            for (let i = 0; i < companiesDB.length; i++) {
                let company = {
                    label: companiesDB[i].name,
                    value: companiesDB[i].id
                };
                companiesSelect.push(company);
            }
        } 
    }

    onMount(async () => {
        // await getCompanyNameId(); 
        window.addEventListener('click', handleAccountOptions)
    })

    onDestroy(() => {
        window.removeEventListener('click', handleAccountOptions);
    });


</script>


<div class="account-username">{ $user.firstName + ' ' + $user.lastName }</div>
<div class="account-container">
    <IconButton on:click={() => { openOptions=!openOptions }} icon="account_circle" />
    {#if openOptions}
    <div class="account-options">
        <div class="account-username__secondary">{ $user.firstName + ' ' + $user.lastName }</div>
        <Button type="text" label="Editar" color="" on:click={ editUser } />
        <Button type="text" label="Cerrar Sesión" color="" on:click={ logout } />
    </div>  
    {/if}
</div>

<SheetHandler
    {props}
    {modalTitle}
    {modalContent}
    bind:openModal={openModal}
/>

<style>
    .account-container {
        position: relative;
    }

    .account-options {
        position: absolute;
        background-color: #FFFFFF;
        color: black;
        width: 155px;
        display: flex;
        flex-direction: column;
        right: 0;
        border-radius: 12px;
        padding: 16px;
        align-items: end;
        border: 1px solid rgba(224, 224, 224, 1);
    }
</style>