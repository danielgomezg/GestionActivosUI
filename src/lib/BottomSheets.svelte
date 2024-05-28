<script>
        import { IconButton } from "$lib";
        import { getContext } from "svelte";
        import { fade, fly } from 'svelte/transition';
        import { createEventDispatcher } from "svelte";
        
        
        export let open = false, persistance = false, height = '90%', drag = false, title = '', backButton = false
        

        let content;
        let resize = false;
        let dispatch = createEventDispatcher();
        let backModalContent = getContext('backModalContent');

        function dragging(event) {
            const touch = event.touches[0];
            if (!drag) return;
            if (!resize) return;
            height = window.innerHeight - touch.pageY + 'px';
    
        }

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
        
        const handleDragging = (e) => {
            if (e.target.slot == "header") resize = true;
            else resize = false
        }
    
        $: document.body.classList.toggle('noscroll', open);
    
    </script>
    
    <!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /> -->
    {#if open}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="bottom-sheet" 
        class:open={open}
        transition:fade 
    >
        
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="overlay" on:click={() => {open = persistance}} ></div>
        <div 
            bind:this={content}
            on:touchstart={ handleDragging }
            class="content"
            style="height: {height}"
            in:fly={ { duration: 200, y: 500 } }
            out:fade 
        >
            <div class="header">
                <div style="display: flex; align-items: center;">
                    {#if backButton}
                        <IconButton icon="arrow_back" on:click={ (event) => backModalContent(event) }/>
                    {/if}
                    <div class="title">{title}</div>
                </div>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="drag" 
                    on:touchmove={ dragging }
                >
                    <!-- <slot name="header" /> -->
                </div>
                <IconButton icon="close" on:click={ () => open = persistance } />
            </div>
            <div class="body" on:scroll={ handleScroll }>
                <!-- <slot name="content" /> -->
                <slot />
            </div>
        </div>
    </div>
    {/if}
    
    <style>
        body.noscroll{
            overflow-y: hidden !important;
        }
    
        .bottom-sheet.open {
            opacity: 1;
            pointer-events: auto;
        }
    
        .bottom-sheet {
            top: 0;
            left: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
            z-index: 100;
            display: flex;
            position: fixed;
            align-items: center;
            justify-content: end;
            pointer-events: none;
            flex-direction: column;
        }
        .bottom-sheet .overlay{
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            height: 100%;
            opacity: 0.2;
            position: fixed;
            background: #000;
        }
    
        .bottom-sheet .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            color: black;
        }
    
        .bottom-sheet .drag {
            cursor: grab;
            user-select: none;
        }
    
        .bottom-sheet .content {
            width: 100%;
            height: 50vh;
            /* margin: 0 30px; */
            background: #fff;
            max-height: 100vh;
            border-radius: 12px 12px 0 0;
            display: flex;
            flex-direction: column;
        }
    
        .bottom-sheet .body {
            height: 100%;
            /* margin: 0 30px; */
            overflow-y: auto;
            scrollbar-width: none;
            flex: 1;
            padding: 10px 12px 0;
        }
    
        .bottom-sheet .body::-webkit-scrollbar {
            width: 0;   
        }
    
    </style>