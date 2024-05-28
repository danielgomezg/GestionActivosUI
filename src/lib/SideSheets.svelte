<script>
    import { IconButton } from "$lib";
    import { createEventDispatcher, getContext } from "svelte";

    export let open = false, title = '', backButton = false
    
    let backModalContent = getContext('backModalContent');
    let dispatch = createEventDispatcher()

    function handleScroll(event) {
        const target = event.target;
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
            console.log('End scroll')
            dispatch('scrollEnd')
        }
        else {
            dispatch('scroll')
        }
    }

    $: if (open) {
        document.body.style.overflowY = "hidden";
    } else {
        document.body.style.overflowY = "auto";
    }

</script>
<div class:container={open}>
    <div class="side-sheet" class:open={open} id="sideSheet">
        <div class="side-sheets__header">
            <div style="display: flex; align-items: center;">
                {#if backButton}
                    <IconButton icon="arrow_back" on:click={ (event) => backModalContent(event) }/>
                {/if}
                <div class="title">{title}</div>
            </div>
            <IconButton icon="close" on:click={ () => open = false }/>
        </div>
        <div class="side-sheets__content" on:scroll={ handleScroll }>
            <slot />
        </div>
    </div>
</div>

<style>
    .side-sheets__header {
        display: flex;
        align-items: center;
        padding: 24px 24px 0 16px;
        justify-content: space-between;
        color: black;
    }

    .side-sheets__content {
        /* margin: 24px 24px 0 16px; */
        overflow-y: auto;
        flex: 1;
        padding: 24px 24px 0px 16px;
    }

    .container {
        position: fixed;
        background-color: rgba(0, 0, 0, 0.5);
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        z-index: 500;
    }

    /* .side-sheet {
        position: fixed;
        top: 0;
        height: 100vh;
        width: 40%;
        background-color: #FFFFFF;
        border-radius: 16px 0 0 16px ;
        display: flex;
        flex-direction: column;
    } */

    .open {
        right: 0;
    }

    
</style>