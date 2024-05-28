<script>
    export let identificador
    export let nombreEtiqueta
    export let placeholder = " "
    export let value = null
    export let valueObjMovie = null
    export let password = false

</script>

<div class="containerEntrada">
    <label for={identificador}>{nombreEtiqueta}</label>
    {#if valueObjMovie == null}
      {#if password}
        <input type="password" id={identificador} {placeholder} bind:value={value}>
      {:else}
        <input type="text" id={identificador} {placeholder} bind:value={value}>
      {/if}
    {:else}
      <input type="text" id={identificador} {placeholder} bind:value={valueObjMovie}>
    {/if}
  </div>

<style>
   label{
    width: 100px;
   }
   input{
    border-radius: 5px;
   }
   .containerEntrada{
    display: flex;
    gap: 10px;
   }
</style>