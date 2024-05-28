<script>
    import Quagga from 'quagga'; 
    import { onMount, createEventDispatcher, tick} from 'svelte';

    export { start }
    export { stop }

    let state = 'stopped';
    let dispatch = createEventDispatcher();

    function stop() {
        console.log('stop');
        Quagga.stop();
        const video = document.querySelector('#interactive video');
        const canvas = document.querySelector('#interactive canvas');
        if (video) {
            video.remove();
        }
        if (canvas) {
            canvas.remove();
        }
        state = 'stopped';
    }
    

    async function start() {
        console.log('start');
        state = 'started';
        await tick();
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#interactive'),
                constraints: {   
                    'max-width': '100%',          
                    facingMode: "environment"  //"environment" for back camera, "user" front camera
                },
                area: { // defines rectangle of the detection/localization area
                    top: "0%",    // top offset
                    right: "0%",  // right offset
                    left: "0%",   // left offset
                    bottom: "0%"  // bottom offset
                },
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader", "upc_reader", "code_39_reader", "code_93_reader", "codabar_reader"],
                debug: {
                    showCanvas: true,
                    showPatches: true,
                    showFoundPatches: true,
                    showSkeleton: true,
                    showLabels: true,
                    showPatchLabels: true,
                    showRemainingPatchLabels: true,
                    boxFromPatches: {
                        showTransformed: true,
                        showTransformedBox: true,
                        showBB: true
                    }
                }
            },
            locator: {
                patchSize: 'medium',
                halfSample: true,
            },
            locate: true
        }, function (err) {
            if (err) {
                console.log(err);
                return
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();

            const video = document.querySelector('#interactive video');
            const canvas = document.querySelector('#interactive canvas');
            if (video) {
                video.style.maxWidth = '100%';
                // video.style.height = '100%';
            }
            if (canvas) {
                canvas.style.maxWidth = '100%';
                canvas.style.position = 'absolute';
                // canvas.style.height = '100%';
            }

        });

        Quagga.onDetected((data) => {
            console.log('Detected', data.codeResult.code);
            console.log(data.codeResult.code);
            dispatch('detected', data.codeResult.code);
            Quagga.stop();

            const video = document.querySelector('#interactive video');
            const canvas = document.querySelector('#interactive canvas');
            if (video) {
                video.remove();
            }
            if (canvas) {
                canvas.remove();
            }
            state = 'stopped';
        });
    }

    onMount(() => {
        // initBarcodeScanner();
        console.log('onMount')
    });

</script>

<!-- 

    No se usa

-->
{#if state === 'started'}
    <div class="mobile-only">
        <div id="interactive"></div>
    </div>
{/if}

<style>
    #interactive {
        position: relative; /* Esto es necesario para que overflow funcione correctamente */
        overflow: hidden; /* Esto oculta cualquier contenido que sobresalga */
        width: 100%; /* Asegúrate de que el div ocupa todo el espacio disponible */
        height: 100%; /* Asegúrate de que el div ocupa todo el espacio disponible */
    }

    #interactive video {
        max-width: 100%; /* Esto limita el ancho del video al ancho del div padre */
        max-height: 100%; /* Esto limita la altura del video a la altura del div padre */
    }
</style>