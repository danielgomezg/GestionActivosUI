<script>
    import { createEventDispatcher } from "svelte";
    import { Card, IconButton, Button } from "$lib";

    export let sucursal = {}
    let dispath = createEventDispatcher();

</script>

<Card>
    <div class="card-container">
        <div class="card-header">
            <div class="card-title">{ sucursal.number }</div>
            <IconButton icon="visibility" readinfo on:click={ dispath("edit", sucursal) } />
        </div>
        <div class="card-content">
            <div class="responsive-table">
                <table>
                    <tr>
                        <td><span class="material-symbols-rounded">location_on</span></td>
                        <td>{ `${sucursal.address}.`  }<strong>{ `${sucursal.commune}, ${sucursal.region}` }</strong></td>
                    </tr>
                    <tr>
                        <td><span class="material-symbols-rounded">notes</span></td>
                        <td>{ sucursal.description }</td>
                    </tr>
                    <tr>
                        <td><span class="material-symbols-rounded"></span></td>
                        <td>{ 'Oficinas: ' + sucursal.count_offices }</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="card-actions">
            <Button label="Ver oficinas" type="outlined" color="" custom on:click={ dispath("showStores", sucursal) } />
            <Button label="Nueva oficina" disabled custom on:click={ dispath("newStore", sucursal) } />
        </div>
    </div>
</Card>

<style>
    .card-content {
        display: flex;
        align-items: flex-start;
        gap: 50px;
    }
</style>