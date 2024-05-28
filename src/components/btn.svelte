<script>
    export let nombreBtn
    export let funcion = null
    export let objMovie = {}
    export let login = false

    //console.log("btn " + objMovie)
</script>
{#if funcion == null}
     <button> {nombreBtn}</button>
{:else}
    {#if login}
    <button on:click={funcion}> {nombreBtn}</button>
    {:else}
    <button on:click={funcion(objMovie)}> {nombreBtn}</button>
    {/if}
{/if}



<style>
    button{
        background-color: rgb(77, 189, 241);
        border-radius: 10px;
        border: none;
        width: 140px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;

    }
    button:hover{
        background-color: rgb(4, 137, 245);
    }
</style>