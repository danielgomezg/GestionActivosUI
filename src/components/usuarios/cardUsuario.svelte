<script>
    import { getContext } from "svelte";
    import Api from "../../../helpers/ApiCall";
    import { snackbar } from "../../stores/store";
    import { createEventDispatcher } from "svelte";
    import { Card, IconButton, Divider, Menu, Snackbar } from "$lib";

    export let usuario = {}
    export let disabled = false;

    let openActions = false;
    let openSnackbar = false;
    let actionSnackbar = '';
    let messageSnackbar = '';
    let removeUsuario = getContext('removeUsuario');

    let dispath = createEventDispatcher();

    const deleteUsuario = async () => {

        // let confirmacion = confirm(`Esta seguro que desea eliminar el usuario ${usuario.firstName} ${usuario.lastName}`)
        // if (!confirmacion) return;

        //loading = true;
        let response = await Api.call(`/user/${usuario.id}`, 'DELETE')
        console.log('RESPONSE DELETE USER --> ', response)
        if (response.success) {
            console.log(response.data.message)

            //Actualizar lista de users
            removeUsuario(usuario.id)

            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Usuario eliminado con éxito."
                return snk
            })
        } else {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al eliminar usuario."
                return snk
            })
        }
        //loading = false;
    }

    const resetPassword = async () => {
        let response = await Api.call(`/user/password/reset/${usuario.id}`, 'PUT')
        console.log('RESPONSE UPDATE PASSWORD --> ', response);
        if (response.success) {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Contraseña restaurada con éxito."
                return snk
            })
        } else {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al actualizar contraseña."
                return snk
            })
        }
    }

</script>

<Snackbar 
    bind:open={ openSnackbar }
    type="confirm"
    message={messageSnackbar}
    on:confirm={ () => {
        if (actionSnackbar === 'delete') deleteUsuario();
        if (actionSnackbar === 'reset') resetPassword();
        actionSnackbar = '';
    } }
/>

<Card>
    <div class="card-container">
        <div class="card-header">
            <div>
                <div class="card-title">{ usuario.firstName + ' ' + usuario.lastName }</div>
                <div>{ usuario.secondName + ' ' + usuario.secondLastName }</div>
            </div>
            <div class="desktop-only">
                <IconButton 
                    {disabled} 
                    icon="lock_reset" 
                    tooltipId="btn-reset__{usuario.rut}" 
                    tooltipText="Restaurar contraseña"
                    on:click={ () => {
                        actionSnackbar = 'reset';
                        messageSnackbar = '¿Restaurar contraseña del usuario ' + usuario.firstName + ' ' + usuario.lastName + '?'
                        openSnackbar = true;
                    }}
                />
                <IconButton {disabled} icon="edit" tooltipId="btn-edit__{usuario.rut}" tooltipText="Editar" on:click={ dispath("edit",  { ...usuario }) } />
                <IconButton 
                    icon="delete" 
                    {disabled}
                    tooltipId="btn-delete__{usuario.rut}" 
                    tooltipText="Eliminar" 
                    on:click={ () => {
                        actionSnackbar = 'delete';
                        messageSnackbar = '¿Eliminar el usuario ' + usuario.firstName + ' ' + usuario.lastName + '?'
                        openSnackbar = true;
                    } }
                />
            </div>
            <div class="mobile-only">
                <!-- <IconButton icon="more_vert" /> -->
                <Menu
                    bind:open={openActions}
                    options={
                        [
                            { label: "Editar", dispatch: "edit"},
                            { label: "Eliminar", dispatch: "delete" },
                            { label: "Restaurar contraseña", dispatch: "reset"}
                        ]  
                    }
                    on:edit={() => dispath("edit", { ...usuario }) }
                    on:delete={() => {
                        messageSnackbar = '¿Eliminar el usuario ' + usuario.firstName + ' ' + usuario.lastName + '?'
                        openSnackbar = true;
                    } }
                    on:reset={() => console.log('reset') }
                >
                <IconButton {disabled} icon="more_vert" on:click={() => openActions = !openActions } />
                </Menu>
            </div>
        </div>
        <Divider />
        <div style="position: relative;">
            <div>{usuario.email }</div>
            <div>{usuario.rut }</div>
        </div>
    </div>
</Card>