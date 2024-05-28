<script>
    import Api from "../../../helpers/ApiCall";
    import ArticleSelect from "../articles/articleSelect.svelte";
    import { getContext, onDestroy, onMount, tick } from "svelte";
    import OfficeSucursalSelected from "../sucursal/officeSucursalSelected.svelte";
    import { TextField, Button, Select, FileInput, DatePicker, Snackbar, IconButton, BarcodeScanner, Checkbox } from "$lib";
    import { snackbar, estadosActivo, lockArticle, lockOffice, lockStore, lockStoreName, lockOfficeName, lockArticleName, user } from "../../stores/store";

    export let activo = {};
    export let article_id = 0;
    export let company_id = 0;
    export let isEdit = false;
    export let article_name = '';
    export let showArticles = false; //Es true cuando lo llama el contentActivo. Se necesita mostrar el select de articulos

    let videoScan = false;
    let barcodeScanner;
    let images = [];
    let imagesURL = {};
    let fileInputImage;
    let nameStore = '';
    let nameOffice = '';
    let messageSnackbar = '';
    let openSnackbar = false;
    let isKeep = false;
    let accionBtn;
    let message= '';
    let office_id = 0;
    let fileComponent;
    let document = null;
    let selectedOffice = 0;
    let selectedSucursal = 0;
    let locationsActivesNew = {
        stores: [],
        offices: []
    };

    let newActivo = getContext('newActivo');
    let reloadActivo = getContext('reloadActivo');
    let addActivoCount = getContext('addActivoCount');
    
    function formatRut(code) {
        if (code == undefined) return ''
        if (code.length >= 13) return code.slice(0, -1);
        
        let rut = code.replace(/[^\dkK]/g, '')

        if (rut.length > 1) {
            rut = rut.slice(0, -1) + '-' + rut.charAt(rut.length - 1);
        }

        if (rut.length > 5) {
            rut = rut.slice(0, -5) + '.' + rut.slice(-5);
        }

        if (rut.length > 9) {
            rut = rut.slice(0, -9) + '.' + rut.slice(-9);
        }

        return rut
        
    }

    function validForm() {

        let [day, month, year] = activo.acquisition_date.split('/');
        if (activo.bar_code == '' && activo.virtual_code == false){
            message = "Falta agregar el codigo de barra del activo."
            return false;
        }
        if (day > 31 || month > 12 || year > new Date().getFullYear()) {
            message = "Fecha de adquisición inválida."
            return false
        }
        if (activo.acquisition_date == ''){
            message = "Falta agregar la fecha de adquisición del activo."
            return false;
        }
        if (activo.serie == ''){
            message = "Falta agregar el número de serie del activo."
            return false;
        }
        if (activo.model == ''){
            message = "Falta agregar el modelo del activo."
            return false;
        }
        if (activo.brand == ''){
            message = "Falta agregar la marca del activo."
            return false;
        }
        if (activo.state == ''){
            message = "Falta agregar el estado del activo."
            return false;
        }
        if (activo.article_id == ''){
            message = "Falta agregar el articulo al activo."
            return false;
        }
        if (activo.office_id == '' || activo.office_id == null){
            message = "Falta agregar una oficina al activo."
            return false;
        }
        
        return true
    }

    // 
    const getImage = async ({ photo1, photo2, photo3, photo4}) => {
        let photos = [photo1, photo2, photo3, photo4].filter(photo => photo != null && photo != '');
        console.log('PHOTOS A-> ', photos)
        if (photos.length == 0) return null;

        // Por cada url de photos hacer la peticion Api.callImage
        for (let i = 0; i < photos.length; i++) {
            let response = await Api.callImage('/image_active/' + photos[i]);
            console.log('RESPONSE GET IMAGE -> ', response)
            if (response != null) {
                // images = [response, ...images];
                // imagesURL[photos[i]] = response;
                imagesURL[response] = photos[i];
                
            }
        }
    }

    // FUNCION QUE SUBE LA IMAGEN AL SERVIDOR
    const uploadDocument = async (image) => {
        if (image == null) return null;

        let formData = new FormData();
        formData.append('file', image);
        let response = await Api.call('/file_active', 'POST', { body: formData }, 'file');
        console.log('RESPONSE UPLOAD DOCUMENT --> ', response)
        if (response.success && response.statusCode == "201") {
            return response.data.result;
        }
        else {
            return null;
        }
    }

    // FUNCION QUE SUBE LA IMAGEN AL SERVIDOR
    const uploadImage = async (images) => {
        // if (image == null) return null;
        if (images.length == 0) return [];

        let response = await Promise.all(images.map(image => {
            let formData = new FormData();
            formData.append('file', image);
            return Api.call('/image_active', 'POST', { body: formData }, 'file');
        }));

        console.log('RESPONSE UPLOAD IMAGE --> ', response)
        let success = response.filter(res => res.success == true && res.statusCode == "201");
        if (success.length == 0) return [];
        return success.map(res => res.data.result);

    }

    const saveActivo = async () => {

        activo.article_id = parseInt(article_id)
        activo.office_id = parseInt(selectedOffice)
        activo.acquisition_date = activo.acquisition_date.split('/').reverse().join('-')
        let isValid = validForm();
        if (!isValid) {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = message
                return snk
            })
            return console.log(message)
        }
        let activeBody = { ...activo }

        let imagesUrl = await uploadImage(images);
        console.log('imageUrl', imagesUrl)
        if (imagesUrl[0] != undefined) activeBody.photo1 = imagesUrl[0];
        if (imagesUrl[1] != undefined) activeBody.photo2 = imagesUrl[1];
        if (imagesUrl[2] != undefined) activeBody.photo3 = imagesUrl[2];
        if (imagesUrl[3] != undefined) activeBody.photo4 = imagesUrl[3];

        let documentUrl = await uploadDocument(document)
        activeBody.accounting_document = documentUrl == null ? '' : documentUrl;
        activeBody.virtual_code = activo.virtual_code.toString();

        let body = JSON.stringify(activeBody);
        console.log(body)
        let response = (await Api.call('/active', 'POST', { body }, 'json', company_id))
        console.log(response)
        if (response.success && response.statusCode == "201") {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Activo agregado con éxito."
                return snk
            })
            console.log('showArticles', showArticles)

            if (!showArticles) addActivoCount(article_id, 1);

            activo = {
                bar_code: '',
                serie: '',
                model: '',
                brand: '',
                comment: '',
                acquisition_date: '',
                accounting_document: '',
                accounting_record_number: '',
                name_in_charge_active: '',
                rut_in_charge_active: '',
                state: '',
                virtual_code: false,
                // article_id: '',
                office_id: ''
            };
            images = [];
            if (showArticles) {
                // activo.article_id = 0;
                // article_id = 0;
            } 
            fileComponent.cleanValue();
            if (!isKeep) {
                // selectedOffice = 0;
                // selectedSucursal = 0;
            }

            console.log('selectedOffice', selectedOffice)
            console.log('selectedSucursal', selectedSucursal)
            console.log('article_id', article_id)

            lockOffice.set(selectedOffice);
            lockStore.set(selectedSucursal);
            lockArticle.set(article_id);
            if (article_name != '') lockArticleName.set(article_name);

            lockOfficeName.set(nameOffice);
            lockStoreName.set(nameStore);

            locationsActivesNew.offices.push(selectedOffice);
            locationsActivesNew.stores.push(selectedSucursal);
            
        } else if (response.success && response.statusCode == undefined) {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al agregar el activo."
                return snk
            })
        }
        else {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = response.data.message //"Error al agregar el activo."
                return snk
            })
        }

    }

    const editActivo = async () => {
        console.log('edit active')
        let activoBody = { ...activo }
        activoBody.office_id = parseInt(selectedOffice)
        activoBody.acquisition_date = activo.acquisition_date.split('/').reverse().join('-')

        let isValid = validForm();
        if (!isValid) {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = message
                return snk
            })
            return console.log(message)
        }

        let imagesUpload = await uploadImage(images);
        console.log('imagesUpload', imagesUpload)
        console.log('imagesURL', imagesURL)
        console.log('images', images)
        if (!Object.values(imagesURL).includes(activoBody.photo1)) activoBody.photo1 = '';
        if (!Object.values(imagesURL).includes(activoBody.photo2)) activoBody.photo2 = '';
        if (!Object.values(imagesURL).includes(activoBody.photo3)) activoBody.photo3 = '';
        if (!Object.values(imagesURL).includes(activoBody.photo4)) activoBody.photo4 = '';

        for(let i = 0; i < imagesUpload.length; i++){
            if (activoBody.photo1 == '' || activoBody.photo1 == null) activoBody.photo1 = imagesUpload[i];
            else if (activoBody.photo2 == '' || activoBody.photo2 == null) activoBody.photo2 = imagesUpload[i];
            else if (activoBody.photo3 == '' || activoBody.photo3 == null) activoBody.photo3 = imagesUpload[i];
            else if (activoBody.photo4 == '' || activoBody.photo4 == null) activoBody.photo4 = imagesUpload[i];
        }
        let documentUrl = await uploadDocument(document)
        console.log('documentUrl', documentUrl	)
        if (documentUrl != null) activoBody.accounting_document = documentUrl;

        // Peticion
        delete activoBody.office
        let body = JSON.stringify(activoBody)  
        console.log('BODY EDIT ACTIVE --> ', body)  
        let response = (await Api.call(`/active/${activo.id}`, 'PUT', { body }, 'json', company_id))
        console.log('RESPONSE EDIT ACTIVE--> ', response)
        if (response.success && response.statusCode == "201") {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Activo editado con éxito."
                return snk
            })

            //replaceArticle(response.data.result)
            // dispatch('reloadActivo')
            if(showArticles) reloadActivo();
        }
        else if (response.success && response.statusCode == undefined) {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Error al editar activo."
                return snk
            })
            // dispatch('reloadActivo')
            if(showArticles) reloadActivo();
        }
        else {
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = response.data.message //"Error al editar activo."
                return snk
            })
        }
    }

    const setSaved = async () => {
        selectedSucursal = $lockStore
        article_id = $lockArticle
        await tick();
        selectedOffice = $lockOffice
    }

    onMount(async () => {
        if(isEdit){
            selectedOffice = activo.office_id
            accionBtn = editActivo
            console.log('activo', activo)
            getImage(activo)
            // activo.acquisition_date = activo.acquisition_date.split('-').reverse().join('/');
        } else {
            
            if ($lockStore != 0 && $lockOffice != 0) {
                messageSnackbar = `Mantener 
                        - Oficina: ${ $lockOfficeName }
                        - Sucursal: ${ $lockStoreName }
                    `
            }
            if ($lockArticle != 0 && showArticles) {
                messageSnackbar += `Mantener artículo: ${ $lockArticleName }`
            }
            if (messageSnackbar != '') {
                openSnackbar = true
            }

            accionBtn = saveActivo
            // alert(`office_id -> ${ $lockOffice } - store_id -> ${ $lockStore } - article_id -> ${ $lockArticle }`)
            // accionBtn = saveActivo
        }
    })

    onDestroy(() => {
        if (showArticles) newActivo(locationsActivesNew)
    })
    
    $: activo.bar_code = activo.virtual_code ? '' : activo.bar_code
    $: activo.rut_in_charge_active = formatRut(activo.rut_in_charge_active)
    // $: console.log('activo', activo)
    $: if (activo.virtual_code && barcodeScanner != undefined) {
        barcodeScanner.stopScan();
        videoScan = false;
    } 

</script>

<Snackbar 
    bind:open={ openSnackbar }
    type="confirm"
    message={messageSnackbar}
    on:confirm={ setSaved }
/>

<div class="form">

    <OfficeSucursalSelected 
        isEdit={isEdit} 
        companyId={company_id} 
        bind:selectedOffice={selectedOffice}
        bind:selectedSucursal={selectedSucursal}
        on:changeOffice={e => {
            console.log('changeOffice')
            console.log(e.detail)	
            if (e.detail.office == undefined) return;
            nameOffice = e.detail.office.label
            selectedOffice = e.detail.selectedOffice
        }}
        on:changeStore={e => {
            console.log('changeSucursal')
            console.log(e.detail)
            nameStore = e.detail.store.label
            selectedSucursal = e.detail.selectedSucursal
        }}
    />

    {#if showArticles}
        <ArticleSelect 
            companyId={company_id} 
            selected={article_id}
            on:change={e => article_id = e.detail}
            on:name={e => lockArticleName.set(e.detail)}
        />
    {/if}

    <div style="display: flex; align-items: center">
        <TextField 
            version=2
            required 
            type="text"
            disabled={ activo.virtual_code }
            label="Código de activo fijo" 
            bind:value={activo.bar_code}
            
        />

        <div class="mobile-only">       
            <IconButton 
                icon="barcode_scanner" 
                disabled={ activo.virtual_code }
                on:click={ () => {
                    if (videoScan) {
                        // barcodeScanner.stop();
                        barcodeScanner.stopScan();
                        videoScan = false;
                    } else {
                        // barcodeScanner.start();
                        barcodeScanner.startScan();
                        videoScan = true;
                    }
                } } 
            />
        </div>
    </div>

    <div class="mobile-only">
        <BarcodeScanner
            bind:this={ barcodeScanner }
            on:detect={(e) => activo.bar_code = e.detail.decodedText} 
            width={250}
            height={250}
        />
    </div>

    
    <Checkbox bind:checked={ activo.virtual_code } label="Generar código virtual" disabled={isEdit} />
    
    <TextField 
        version=2
        required 
        type="text"
        label="N° de serie" 
        bind:value={activo.serie}
    />

    <TextField 
        version=2
        required 
        type="text"
        label="Modelo" 
        bind:value={activo.model}
    />

    <TextField 
        version=2
        required 
        type="text"
        label="Marca" 
        bind:value={activo.brand}
    />

    <DatePicker 
        bind:value={activo.acquisition_date}
        placeholder="dd/mm/aaaa"
        label="Fecha de adquisición" 
    />

    <Select 
        label="Estado"
        selected = {activo.state}
        options={$estadosActivo}
        on:change={ (event) => activo.state = event.detail }
    />

    <TextField 
        version=2 
        type="text"
        label="Comentario" 
        bind:value={activo.comment}
    />

    <TextField 
        version=2
        type="text"
        label="Nombre del encargado" 
        bind:value={activo.name_in_charge_active}
    />

    <TextField 
        version=2
        type="text"
        label="Rut del encargado" 
        bind:value={activo.rut_in_charge_active}
    />

    <TextField 
        version=2
        type="text"
        label="N° registro contable" 
        bind:value={activo.accounting_record_number}
    />

    <FileInput 
        bind:this={ fileComponent }
        label="Documento contable" 
        required 
        accept={ ['pdf', 'png', 'jpg'] }
        trailing="upload_file"
        helperText="Documento con formato pdf, png o jpg"
        on:change={ (e) => {
            console.log('file selected')
            console.log(e.detail)
            document = e.detail 
        }}
    />
    
    {#if !showArticles}
        <!-- div para dejar el boton save debajo -->
        <div></div>
    {/if}

    <div class="flex-row grid-col-span-2 gap-8">
   
        <FileInput 
            bind:this={ fileInputImage }
            btnIcon
            label="Imagen"
            trailing="image"
            accept={ ['png', 'jpg', 'jpeg'] }
            helperText="Imagen con formato png, jpg o jpeg"
            multiple
            on:change={ (e) => {
                console.log('new image > ', e.detail)
                if ((images.length + e.detail.length > 4 && !isEdit) || (Object.keys(imagesURL).length + e.detail.length + images.length > 4 && isEdit)){
                    snackbar.update(snk => {
                        snk.open = true;
                        snk.type = 'dismiss'
                        snk.message = "Solo se pueden agregar hasta 4 imagenes."
                        return snk
                    }) 
                    return;
                } 

                if (images.length > 0) {
                    console.log('images if > ', images)	
                    images = [...images, ...e.detail]
                } 
                else {
                    console.log('images else > ', images)
                    console.log(...e.detail)
                    images = [...e.detail]
                } 
            }}
        />

        <div class="image-list">
            {#each Object.keys(imagesURL) as img}
                <div class="content-image">
                    <IconButton 
                        icon="remove" 
                        custom 
                        on:click={ () => {
                            delete imagesURL[img]
                            imagesURL = {...imagesURL}
                            // article.photo = Object.values(imagesURL).join(',')
                        } } 
                    />
                    <img src={ img } class="article-image" alt={activo.bar_code} />
                    
                </div>
            {/each}
            {#each images as img}
                <div class="content-image">
                    <IconButton 
                        icon="remove" 
                        custom 
                        on:click={ () => {
                            console.log('img new remove > ', img)
                            // Quitar img de images
                            fileInputImage.cleanValue();
                            images = images.filter(image => image != img)
                        } } 
                    />
                    
                    <img src={ URL.createObjectURL(img) } class="article-image" alt={activo.bar_code} />
                    
                </div>
            {/each}
        </div>
    </div>


    <div class="mobile-fixed">
        <Button 
            custom
            label="Guardar"
            disabled={ $user.profile_id == 2 }
            on:click={ accionBtn }
        />
    </div>

</div>

