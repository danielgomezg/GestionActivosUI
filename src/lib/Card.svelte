<script>
    export let width = 'auto';

    let style = `width: ${width}`
</script>
<div 
    class="mdc-card mdc-card--outlined"
    style={style}
>
    <slot />
</div>
<style>
    .mdc-card {
        border-radius: 12px;
        border: 1px solid;
        /* padding: 16px; */
        border-color: rgba(224, 224, 224, 1);
    }
</style>