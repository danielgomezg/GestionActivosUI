<script>
    import { onMount, onDestroy } from "svelte";
    import { SideSheets, BottomSheets } from "$lib";

    export let props = { };
    export let modalContent;
    export let modalTitle = ''; 
    export let openModal = false;
    export let backButton = false;
    export let bottomShettHeight = '90%';

    let isMobile = false;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    function handleResize() {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    }
    let endSroll = false;

    onMount(() => {
        
        isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        window.addEventListener('resize', handleResize);

    })

    onDestroy(() => {
        window.removeEventListener('resize', handleResize);
    });

    $: if(!openModal) modalContent = null
    
    $: isMobile = windowWidth < 500    
    
</script>

{#if isMobile}

    <BottomSheets bind:open={openModal}  title={modalTitle} {backButton} height={bottomShettHeight}
        on:scrollEnd={ () => {
            endSroll = true;
        } }
        on:scroll={ () => {
            endSroll = false;
        } }    
    >
        <svelte:component this={modalContent} {...props} {endSroll} />

    </BottomSheets>

{:else}

    <SideSheets bind:open={openModal} title={modalTitle} {backButton} 
        on:scrollEnd={ () => {
            endSroll = true
        } }
        on:scroll={ () => {
            endSroll = false
        } }
    >

        <svelte:component this={modalContent} {...props} {endSroll} />
        
    </SideSheets>

{/if}
