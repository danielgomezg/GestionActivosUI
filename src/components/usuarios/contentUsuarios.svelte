<script>
    import Api from "../../../helpers/ApiCall";
    import { Button, Loading, Fab } from "$lib";
    import CardUsuario from "./cardUsuario.svelte";
    import FormUsuarios from "./formUsuarios.svelte";
    import UsuarioSearch from "./usuarioSearch.svelte";
    import { setContext, onMount, onDestroy } from "svelte";
    import SheetHandler from "../SheetsHandler/sheetHandler.svelte";
    
    let userSelf = JSON.parse(sessionStorage.getItem('user'));
    let props;
    let limit = 50;
    let count = 0;
    let offset = 0;
    let modalContent;  
    let usuarios = [];
    let modalTitle = '';
    let loading = false;
    let openModal = false;
    let backButton = false;

    //companies recibe id y name del getcompany, y en company se guardan los datos como label y value para usarlos en el select  
    let companiesSelect = []
    let perfilesSelect = []

    setContext('addUsuario', (usuario) => {
        console.log('in add User')
        usuarios = [usuario, ...usuarios]
    })

    setContext('editUsuario', (usuario) => {
        console.log('in edit User')
        const index = usuarios.findIndex(user => user.id === usuario.id);
        usuarios = [...usuarios.slice(0, index), usuario, ...usuarios.slice(index + 1)];
    })

    setContext('removeUsuario', (usuarioId) => {
        console.log('in remove User')
        usuarios = usuarios.filter(usuario => usuario.id !== usuarioId);
    })

    const createUser = () => {
        modalTitle = 'Nuevo usuario'
        modalContent = FormUsuarios
        props = { usuario: {
            firstName: '',
            secondName: '',
            lastName: '',
            secondLastName: '',
            email: '',
            password: '',
            rut: '',
            company_id: '',
            profile_id: ''
        }, 
        companies: companiesSelect,
        perfiles: perfilesSelect,
        accion: 'create' }
        openModal = true

    }

    const editUser = (usuario) => {
        modalTitle = 'Editar usuario'
        modalContent = FormUsuarios
        props = { 
            usuario,
            accion: 'edit' 
        }
        openModal = true
    }

    const getUsers = async () => {
        if (offset > count) return;
        console.log('GET USERS')
        console.log(usuarios)
        loading = true;
        let response = (await Api.call(`/users?limit=${limit}&offset=${offset}`, 'GET'))
        console.log('RESPONSE GET USERS --> ', response)
        if (response.success && response.statusCode == '200') {
            count = response.data.count
            usuarios = [...usuarios, ...response.data.result]
        } 
        loading = false;
    }

    const handleScroll = () => {
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
            offset = offset + limit;
            getUsers()
        }
    }

    onMount(async () => {
        getUsers()
        
        window.addEventListener('scroll', handleScroll)
    })

    onDestroy(() => {
        window.removeEventListener('scroll', handleScroll)
    })

</script>

<div class="mobile-only" style="position: fixed; bottom: 10px; right: 10px; z-index: 10">
    <Fab on:click={ createUser } />
</div>
<div style="padding: 20px 0;">
    <div class="header-content" style="position: sticky; top: 40px; z-index: 3; background-color: #f0f0f0; padding: 34px 0 10px">
        <div class="desktop-only">
            <Button label="Nuevo usuario" custom on:click={ createUser } />
        </div>
        <div>
            <UsuarioSearch
                bind:usuarios = {usuarios}
                on:removeSearch={ () => {
                    offset = 0
                    usuarios = []
                    getUsers()
                } }
                on:notFound={ () => {
                    usuarios = []
                } }    
            />
        </div>
    </div>
    <br>

    <div class="body-content grid-columns-3" style="padding: 0 0 10px;">
        {#if loading}
            <Loading />
        {/if}
        {#each usuarios as usuario }    
            <CardUsuario 
                disabled={userSelf.id === usuario.id}
                {usuario} 
                on:edit={ (event) => editUser(event.detail) } 
            />
        {:else}
            <p>No se encontraron usuarios</p>
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