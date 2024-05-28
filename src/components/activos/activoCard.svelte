<script>
    import Api from "../../../helpers/ApiCall";
    import { snackbar } from "../../stores/store";
    import { Card, IconButton, Button } from "$lib";
    import ReportActive from "../reports/report.svelte";
    import { createEventDispatcher, onMount, getContext, setContext } from "svelte";

    export let activo = {}

    let dispath = createEventDispatcher();

    const alertDelete = () => {
        snackbar.update(snk => {
            snk.id = 'deleteArticle'
            snk.open = true;
            snk.type = 'confirm';
            snk.click = false;
            snk.message = '¿Eliminar el activo ' + activo.name + '?'
            return snk
        })
    }	

</script>

<Card>
    <div class="card-container">
        <div class="card-header align-start">
            <div class="flex-row gap-8 ">
                <div class="flex-column">
                    <div class="card-title">{ activo.name }</div>
                    <table>
                        <tr>
                            <td><span class="material-symbols-rounded">event</span></td>
                            <td>{ activo.creation_date }</td>
                        </tr>
                        <tr>
                            <td><span class="material-symbols-rounded">inventory_2</span></td>
                            <td>{ activo.count_actives || 0 } activos</td>
                        </tr>
                        <tr>
                            <td><span class="material-symbols-rounded">notes</span></td>
                            <td>{ activo.description }</td>
                        </tr>
                    </table>
                    <!-- <p> Agregado el { activo.creation_date }</p>
                    <p> { activo.count_actives || 0 } activos</p> -->
                </div>
            </div>
            <div>
                <ReportActive 
                    type="btn-icon"
                    id={ activo.id } 
                    label="Reporte activos"
                />
                <IconButton icon="history" tooltipId="btn-history__{activo.name}" tooltipText="Historial" on:click={ dispath("history", activo) } />
                <IconButton icon="edit" tooltipId="btn-edit__{activo.name}" tooltipText="Editar" on:click={ dispath("edit", activo) } />
                <IconButton icon="delete" tooltipId="btn-delete__{activo.name}" tooltipText="Eliminar" on:click={ alertDelete } />
            </div>
        </div>
        <!-- <div class="card-content">
            <div class="contenedor">
                <p>{ activo.description }</p>
            </div>
        </div> -->
        <div class="card-actions">
            <!-- <ReportActive 
                label=""
                id={ activo.id } 
                disabled={ false }
            /> -->
            <!-- <Button label="Ver activos" type="outlined" color="" on:click={ dispath("showActivos", activo) } /> -->
            <!-- <Button label="Nuevo activo" custom on:click={ dispath("newActivo", activo) } /> -->
        </div>
    </div>
</Card>