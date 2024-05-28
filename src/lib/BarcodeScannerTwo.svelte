<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import {
        Html5Qrcode,
        Html5QrcodeScanner,
        Html5QrcodeScanType,
        Html5QrcodeScannerState,
        Html5QrcodeSupportedFormats,
    } from 'html5-qrcode';

    export let width;
    export let height;
    export { startScan } 
    export { stopScan }

    let scanner;
    let divScanner;
    let status = '';

    const formatsToSupport = [
        // Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
    ];
    const dispatch = createEventDispatcher();

    function onScanSuccess(decodedText, decodedResult) {
        console.log('decodedText', decodedText);
        console.log('decodedResult', decodedResult);
        dispatch('detect', { decodedText });
        scanner?.pause();
        divScanner.innerHTML = '';
        // Limpiar estilos del divScanner
        divScanner.style = 'display: none;';
    }

    // usually better to ignore and keep scanning
    function onScanFailure(message) {
        dispatch('error', { message });
    }

    // 
    function startScan() {
        divScanner.style = 'display: block;';
        scanner.render(onScanSuccess, onScanFailure);
        // scanner?.start();
        status = 'scanning';
    }

    function stopScan() {
        if (status === 'scanning') scanner.clear();
    }

    // 
    function onCameraSelect() {
        // This method will trigger user permissions
        Html5Qrcode.getCameras().then(devices => {
        /**
         * devices would be an array of objects of type:
         * { id: "id", label: "label" }
         */
        console.log('devices', devices);
        if (devices && devices.length) {
            var cameraId = devices[0].id;
            console.log('cameraId', cameraId);
            // .. use this to start scanning.
        }
        }).catch(err => {
            console.log('err', err);
            // handle err
        });
    }

    
    onMount(() => {
        scanner = new Html5QrcodeScanner(
            'qr-scanner',
            {
                fps: 10,
                qrbox: { width, height },
                aspectRatio: 1,
                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                formatsToSupport: formatsToSupport,
                rememberLastUsedCamera: false
            },
            false // non-verbose
        );
        console.log('scanner', scanner);
        // scanner.render(onScanSuccess, onScanFailure);
    });

    // pause/resume scanner to avoid unintended scans
    // $: togglePause(paused);
    // function togglePause(paused) {
    //     if (paused && scanner?.getState() === Html5QrcodeScannerState.SCANNING) {
    //         scanner?.pause();
    //     } else if (scanner?.getState() === Html5QrcodeScannerState.PAUSED) {
    //         scanner?.resume();
    //     }
    // }
</script>

<!-- <button on:click={onCameraSelect}>Start Scan</button>	 -->
<div bind:this={ divScanner } id="qr-scanner" />

<style>
    /* Hide unwanted icons */
    #qr-scanner :global(img[alt='Info icon']),
    #qr-scanner :global(img[alt='Camera based scan']) {
        display: none;
    }

    /* Change camera permission button text */
    #qr-scanner :global(#html5-qrcode-button-camera-permission) {
        visibility: hidden;
    }
    #qr-scanner :global(#html5-qrcode-button-camera-permission::after) {
        position: absolute;
        inset: auto 0 0;
        display: block;
        content: 'Click para permitir camara';
        visibility: visible;
        padding: 10px 0;
        margin-bottom: 40px;
        color: black;
    }
</style>