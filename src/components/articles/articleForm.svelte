<script>
    import Api from "../../../helpers/ApiCall";
    import { onMount, getContext } from "svelte";
    import { snackbar, user } from "../../stores/store";
    import CategorySelect from "../categories/categorySelect.svelte";
    import { TextField, Button, FileInput, TextArea, IconButton } from "$lib";
  
    export let article = {};
    export let companyId = 0;
    export let isEdit = false;
    
    let fileInput;
    let accionBtn;
    let images = []; //Array donde se agregan imagenes nuevas
    let imagesURL = {}; //Objeto estan las imagenes guardades del articulo
    let message = '';

    let addArticle = getContext('addArticle');
    let replaceArticle = getContext('replaceArticle');

    function validForm() {
        if (article.name == ''){
            message = "Falta agregar el nombre del artículo."
            return false;
        }
        if (article.code == ''){
            message = "Falta agregar el código del artículo."
            return false;
        }  
        return true
    }

    // 
    const getImage = async (photos = '') => {
        console.log('PHOTOS A-> ', photos)
        if (photos == '') return null;
        photos = photos.split(',');
        console.log('PHOTOS B-> ', photos)

        // Por cada url de photos hacer la peticion Api.callImage
        for (let i = 0; i < photos.length; i++) {
            let response = (await Api.callImage('/image_article/' + photos[i]));
            console.log('RESPONSE GET IMAGE -> ', response)
            if (response != null) {
                // images = [response, ...images];
                // imagesURL[photos[i]] = response;
                imagesURL[response] = photos[i];
            }
        }
    }

    // FUNCION QUE SUBE LA IMAGEN AL SERVIDOR
    const uploadImage = async (images) => {
        // if (image == null) return null;
        if (images.length == 0) return null;

        let response = await Promise.all(images.map(image => {
            let formData = new FormData();
            formData.append('file', image);
            return Api.call('/image_article', 'POST', { body: formData }, 'file');
        }));

        console.log('RESPONSE UPLOAD IMAGE --> ', response)
        let success = response.filter(res => res.success == true && res.statusCode == "201");
        if (success.length == 0) return null;
        return success.map(res => res.data.result).join(',');

    }

    // FUNCION QUE GUARDA EL ARTICULO
    const saveArticle = async () => {
        
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

        let imageUrl = await uploadImage(images)
        
        article.company_id = companyId;
        article.photo = imageUrl == null ? '' : imageUrl;
        let body = JSON.stringify(article);
        
        let response = (await Api.call('/article', 'POST', { body }))
        console.log(response)
        if (response.success && response.statusCode == "201") {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Articulo agregado con éxito."
                return snk
            })
            
            addArticle(response.data.result)
        }
        else {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = response.data.message //"Error al agregar el articulo."
                return snk
            })
        }

    }

    // FUNCION QUE EDITA EL ARTICULO
    const editArticle = async () => {
        
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

        let imageUrl = await uploadImage(images)
        let imagesNames = Object.values(imagesURL).join(',')    
        
        if (imagesNames != '') article.photo = imageUrl == null ? imagesNames : imagesNames + ',' + imageUrl;
        else article.photo = imageUrl == null ? '' : imageUrl;

        // Peticion
        let body = JSON.stringify(article)  
        console.log('BODY EDIT ARTICLE--> ', body)
        console.log('ARTICLE EDIT ARTICLE--> ', companyId)
        let response = (await Api.call(`/article/${article.id}`, 'PUT', { body }, 'json', companyId))
        console.log('RESPONSE EDIT ARTICLE--> ', response)
        if (response.success && response.statusCode == "201") {
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = "Articulo editado con éxito."
                return snk
            })

            replaceArticle(response.data.result)

        }
        else {
            //aviso
            snackbar.update(snk => {
                snk.open = true;
                snk.type = 'dismiss'
                snk.message = response.data.message //"Error al editar articulo."
                return snk
            })
        }
    }



    onMount(async ()=> {
        if (isEdit) {
            accionBtn = editArticle
            getImage(article.photo)
        } else {
            accionBtn = saveArticle
        }
    })
 
</script>

<div class="form">

    <TextField 
        version=2
        id="name-article"
        required 
        type="text"
        label="Nombre" 
        bind:value={ article.name }
    />

    <div class="content-description">
        <TextArea 
            label="Descripción" 
            bind:value={ article.description }
        />    
    </div>

    <CategorySelect 
        {companyId}
        bind:selected={ article.category_id }
        on:change={ e => article.category_id = e.detail}
    />

    <TextField 
        version=2
        id="code-article" 
        type="text"
        label="Código"
        bind:value={ article.code }
    />

    <div class="flex-row grid-col-span-2 gap-8">
    
        <FileInput 
            bind:this={fileInput}
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
                            article.photo = Object.values(imagesURL).join(',')
                        } } 
                    />
                    <img src={ img } class="article-image" alt={article.name} />
                    
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
                            fileInput.cleanValue();
                            images = images.filter(image => image != img)
                        } } 
                    />
                    
                    <img src={ URL.createObjectURL(img) } class="article-image" alt={article.name} />
                    
                </div>
            {/each}
        </div>

    </div>

    <div class="grid-col-span-1 mobile-fixed">
        <Button 
            label="Guardar"
            custom
            disabled={ $user.profile_id == 2 }
            on:click={ accionBtn }
        />
    </div>

</div>
