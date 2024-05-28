<script>
    import Api from "../../../helpers/ApiCall";
    import FormCategory from "./categoryForm.svelte";
    import { Button, Snackbar, Fab, Lists } from "$lib";
    import { onMount, setContext, onDestroy } from "svelte";
    import { companySelect, snackbar, user } from "../../stores/store";
    import SheetHandler from "../SheetsHandler/sheetHandler.svelte";

 
    let props;
    let count = 0;
    let limit = 500;
    let offset = 0;
    let modalContent;  
    let company_id = 0;
    let categories = []
    let openSnackbar = false;
    let messageSnackbar = '';
    let categoryDelete = {};
    let loading = false;
    let openModal = false, backButton = false;
    let modalTitle = '', previusModelTitle = '';
    let bottomShettHeight;

    setContext('editCategory', (category) => {
        
        let parent = depthFirstSearch({ children: categories }, category.parent_id);
        let index = parent.children.findIndex(c => c.id == category.id);
        parent.children[index] = category;
        categories = categories.slice();
        openModal = false;
        
    })

    setContext('addCategory', (category) => {
        
        if (category.parent_id == 0) {
            categories = [category, ...categories]
        } else {
            let parent = depthFirstSearch({ children: categories }, category.parent_id);
            if (parent.children == undefined) parent.children = [];
            parent.children = [category, ...parent.children]
            categories = categories.slice();
        }

        openModal = false;
    })

    const createCategory = (parent_id) => {
        modalTitle = 'Crear categoria'
        modalContent = FormCategory;
        props = { 
            category: {
                description: '',
                code: '',
                parent_id
            }, 
            company_id
        }
        bottomShettHeight = '50%'
        openModal = true
        backButton = false;
    }

    const editCategories = (category) => {
        modalTitle = category.description + " - editando"
        modalContent = FormCategory;
        props = { category, company_id }
        bottomShettHeight = '50%'
        openModal = true
        backButton = false;
    }

    function depthFirstSearch(tree, value) {
        if (tree.id === value) {
            return tree;
        }

        if (tree.children === undefined) {
            return null;
        }

        for (let child of tree.children) {
            let result = depthFirstSearch(child, value);

            if (result) {
                return result;
            }
        }

        return null;
    }

    const getCategories = async (parentId) => {
        if (offset > count) return;
        console.log('GET CATEGORIES -> ', parentId)
        console.log('CATEGORIES -> ', categories)
        
        loading = true;
        let response = (await Api.call(`/category/${parentId}?limit=${limit}&offset=${offset}`, 'GET', {}, 'json', company_id))
        console.log('RESPONSE GET CATEGORIES --> ', response)
        if (response.success && response.statusCode == "200") {
            count = response.data.count
            // if (count == 0) return;
        
            if (parentId == 0) {
                categories = response.data.result
            } else {
                // Se necesita agregar las categorias a la categoria padre
                let parent = depthFirstSearch({ children: categories }, parentId);
                console.log('PARENT -> ', parent)
                delete parent.children;
                parent.children = response.data.result
                categories = categories.slice();

            }
        } 
        loading = false;
    }

    const deleteCategory = async (category) => {
        let response = (await Api.call(`/category/${category.id}`, 'DELETE', {}, 'json', company_id))
        console.log('RESPONSE DELETE CATEGORY --> ', response)
        if (response.success && response.statusCode == "201") {

            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = 'Categoría eliminada correctamente'
                return snk
            })

            getCategories(category.parent_id)

        }
        else if(response.success && response.statusCode == "400") {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = 'La categoría tiene subcategorias, no se puede eliminar'
                return snk
            })
        }
        else {
            snackbar.update(snk => {
                snk.type = 'dismiss'
                snk.open = true;
                snk.message = 'Error al eliminar la categoría'
                return snk
            })
        }

    }

    const handleScroll = () => {
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
            offset = offset + limit;
            // getCompanies()
        }
    }

    const changeCompany = (id) => {
        company_id = id;
        offset = 0;
        count = 0;
        getCategories(0)
    }

    onMount(async () => {

        window.addEventListener('scroll', handleScroll)
    })

    onDestroy(() => {
        window.removeEventListener('scroll', handleScroll)
    })



    $: if(companySelect != 0) changeCompany($companySelect)

</script>

<Snackbar 
    bind:open={ openSnackbar }
    type="confirm"
    message={messageSnackbar}
    on:confirm={ deleteCategory(categoryDelete) }
/>

<div class="mobile-only" style="position: fixed; bottom: 10px; right: 10px; z-index: 10">
    <Fab on:click={ () => createCategory(0) } disabled={ $user.profile_id == 2 } />
</div>
<div style="position: relative">
    <div class="header-content" style="position: sticky; top: 40px; z-index: 3; background-color: #f0f0f0; padding: 34px 0 10px">
        <div class="flex-row gap-8 space-between">
            <div class="desktop-only">
                <Button label="Nueva categoria" custom on:click={ () => createCategory(0) } />
            </div>
        </div>
        
    </div>

    <div class="flex-column gap-8 mt-8" style="padding: 44px 0 10px;">
        <Lists 
            disabledOptions={ $user.profile_id == 2 }
            actions
            customClass="list-categories"
            options={ categories }
            on:select={ (event) => getCategories(event.detail) }
            on:edit={ (event) => editCategories(event.detail) }
            on:add={ (event) => createCategory(event.detail.id) }
            on:delete={ (event) => {
                
                categoryDelete = event.detail;
                messageSnackbar = '¿Eliminar la categoria ' + event.detail.description + '?'
                openSnackbar = true;

            } }
        />
    </div>
</div>

<SheetHandler
    {props}
    {modalTitle}
    {backButton}
    {modalContent}
    {bottomShettHeight}
    bind:openModal={openModal}
/>

<style>

</style>