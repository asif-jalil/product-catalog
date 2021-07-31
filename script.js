const searchInput = document.querySelector("#searchInput");
const productContainer = document.querySelector("#product-container");
const productForm = document.querySelector("#product-form");
const nameInput = document.querySelector("#nameInput");
const priceInput = document.querySelector("#priceInput");
const addBtn = document.querySelector("#add-btn");
const editBtn = document.querySelector("#edit-btn");
const emptyProductAlert = document.querySelector("#emptyProductAlert");
const productActionAlert = document.querySelector("#productActionAlert");

let productData = loadFromLocalStorage();



function loadListeners() {
    addBtn.addEventListener("click", addProduct);
    productContainer.addEventListener("click", getAction);
    searchInput.addEventListener("keyup", filterProduct);
    window.addEventListener(
        "DOMContentLoaded",
        getProductData.bind(null, productData)
    );
}

function loadFromLocalStorage() {
    let data = [];
    if (localStorage.getItem("productData")) {
        data = JSON.parse(localStorage.getItem("productData"));
    }
    return data;
}

function displayProduct(product) {
    emptyProductAlert.classList.add("d-none");
    productContainer.classList.remove("d-none");
    let li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between product-item";
    li.id = `product-${product.id}`;
    li.innerHTML = `
            <div><b>${product.name}</b> - $${product.price}</div>
            <div>
                <span class="btn-round product-edit"><i class="fas fa-pencil-alt"></i></span>
                <span class="btn-round product-delete"><i class="fas fa-trash"></i></span>
            </div>
        `;
    productContainer.appendChild(li);
}

function getProductData(data) {
    if (data.length) {
        data.forEach(product => {
            displayProduct(product);
        });
    } else {
        emptyProductAlert.classList.remove("d-none");
        productContainer.classList.add("d-none");
    }
}

function actionMsg(action) {
    if (action === "add") {
        productActionAlert.innerHTML = "Product Added Successfully";
    } else if (action === "delete") {
        productActionAlert.innerHTML = "Product Deleted Successfully";
    } else if (action === "edit") {
        productActionAlert.innerHTML = "Product Updated Successfully";
    }

    productActionAlert.classList.remove("d-none");
    setTimeout(() => {
        productActionAlert.classList.add("d-none");
    }, 1500);
}

function checkValidation(productName, productPrice, callback) {
    if (productName === "" || productPrice === "") {
        callback("Product name and price must be filled");
        return false;
    } else {
        if (isNaN(productPrice)) {
            callback("Product Price Must be a number");
            return false;
        } else {
            return true;
        }
    }
}

function addProduct(e) {
    e.preventDefault();

    const productName = nameInput.value.trim();
    const productPrice = priceInput.value.trim();
    const prevIDs = productData.map(product => product.id);
    const id = productData.length ? Math.max(...prevIDs) + 1 : 0;

    let isValidate = checkValidation(productName, productPrice, payload => {
        payload && alert(payload);
    });

    if (isValidate) {
        const newProduct = {
            id: id,
            name: productName,
            price: productPrice,
        };

        productData.push(newProduct);
        localStorage.setItem("productData", JSON.stringify(productData));
        displayProduct(newProduct);
        productForm.reset();
        actionMsg("add");
    }
}

function deleteProduct(productId) {
    productData = productData.filter(product => product.id !== productId);
    localStorage.setItem("productData", JSON.stringify(productData));
    actionMsg("delete");
}

function editProduct(product) {
    editBtn.addEventListener("click", e => {
        e.preventDefault();

        const productName = nameInput.value.trim();
        const productPrice = priceInput.value.trim();

        let isValidate = checkValidation(productName, productPrice, payload => {
            payload && alert(payload)
        });

        if (isValidate) {
            const updatedProduct = {
                ...product,
                name: productName,
                price: productPrice,
            };

            const restProduct = productData.filter(p => p.id !== product.id);
            productData = [...restProduct, updatedProduct];
            localStorage.setItem("productData", JSON.stringify(productData));
            productContainer.innerHTML = "";
            getProductData(productData);
            productForm.reset();
            actionMsg("edit");
            addBtn.classList.remove("d-none");
            editBtn.classList.add("d-none");
        }
    });
}

function getAction(e) {
    const selectedLi = e.target.closest("li");
    const productId = Number(selectedLi.id.split("-")[1]);

    if (
        (e.target.tagName === "I" || e.target.tagName === "SPAN") &&
        e.target.closest("span").classList.contains("product-delete")
    ) {
        productContainer.removeChild(selectedLi);
        deleteProduct(productId);

        if (productData.length === 0) {
            emptyProductAlert.classList.remove("d-none");
            productContainer.classList.add("d-none");
        }
    } else if (
        (e.target.tagName === "I" || e.target.tagName === "SPAN") &&
        e.target.closest("span").classList.contains("product-edit")
    ) {
        const selectedProduct = productData.find(
            product => product.id === productId
        );
        populateProduct(selectedProduct);
        editProduct(selectedProduct);
    }

}

function populateProduct(selectedProduct) {
    nameInput.value = selectedProduct.name;
    priceInput.value = selectedProduct.price;
    addBtn.classList.add("d-none");
    editBtn.classList.remove("d-none");
}

function filterProduct(e) {
    const searchTerm = e.target.value.toLowerCase();
    emptyProductAlert.classList.add("d-none");
    productContainer.classList.remove("d-none");
    productContainer.innerHTML = "";
    const filteredProduct = productData.filter(product => {
        if (searchTerm === "") {
            return product;
        } else if (product.name.toLowerCase().includes(searchTerm)) {
            return product;
        }
    });
    if (filteredProduct.length) {
        filteredProduct.forEach(product => {
            displayProduct(product);
        });
    } else {
        emptyProductAlert.classList.remove("d-none");
        productContainer.classList.add("d-none");
    }
}

loadListeners();
