<script>
    import { Card, Divider, Chip } from "$lib"
    import { modulos } from "../../stores/store";  

    export let profile = {}

    let tablesActions = {}
    let translate = {
        get: 'lectura',
        create: 'crear',
        update: 'actualizar',
        delete: 'eliminar'
    }

    const hasAction = (module, action) => {
        return profile.profileActions.map(pa => pa.name).includes(action + '-' + module)
    }

    const getTables = (actions) => {
        if (actions == null || actions == undefined) return
    
        actions.forEach(action => {
            let [method, table] = action.split('-');
            
            if (table in tablesActions) {
                tablesActions[table].push(method)
            } 
            else {
                tablesActions[table] = [method]
            }
        });
    }

    $: getTables(profile.actions)

</script>

<Card>
    <div class="card-container">
        <div class="card-header">
            <div>
                <div class="card-title capitalize">{ profile.name }</div>
                <p>{ profile.description }</p>
            </div>
        </div>
        <Divider />
        <table style="width: 100%;">
            <thead>
                <tr>
                  <th colSpan="2" style="text-align: left; width: 20%">Tabla</th>
                  <th colSpan="3" style="width: 20%;" >Obtener</th>
                  <th colSpan="4" style="width: 20%;">Crear</th>
                  <th colSpan="5" style="width: 20%;">Actualizar</th>
                  <th colSpan="6" style="width: 20%;">Eliminar</th>
                </tr>
            </thead>
            <tbody>
                {#each $modulos as modulo }
                    <tr>
                        <td colSpan="2">{ modulo }</td>
                        {#each ['get', 'create', 'update', 'delete'] as action, index }
                            <td colspan="{index + 3}" style="text-align: center;">
                                {#if hasAction(modulo, action)}
                                    <!-- <Chip chip={ { id: index, label: translate[action], color: action } } /> -->
                                    <span class="material-symbols-rounded" style="color: #4CAF50;">check_circle</span>
                                {:else}
                                    <!-- <Chip chip={ { id: index, label: translate[action] } } /> -->
                                    <span class="material-symbols-rounded" style="color: #FF0000;">block</span>
                                {/if}
                            </td>   
                        {:else}
                            <p>perfil sin acciones</p>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</Card>

<style>
    p {
        margin: 0;
    }
</style>