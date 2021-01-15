/* ----- Product Api Handling ----- */

/* ---- SUBSCRIBE ---- */

function subscribe(partId) {
    fetch('/api/product/subscribe', {
        body: JSON.stringify({
            partId: partId
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "post",
    })
        .then(res => {
            if (res.status === 200) {
                alert("Subscribed");
            } else {
                return res.text();
            }

        })
        .then(txt => {
            alert(txt);
        })
        .catch(error => {
            console.error(error);
        })
}

/* ---- Search ---- */
const searchForm = document.getElementById('searchForm');
const searchGallery = document.getElementById('searchGallery');
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    let data = {};
    (new FormData(document.forms['searchForm'])).forEach(function (value, key) {
        if (value !== "") {
            data[key] = value;
        }
    });

    fetch("/api/product/search", {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        method: "post",
    })
        .then(res => res.text())
        .then(txt => console.log(txt))
        .then(parts => {
            searchGallery.innerHTML ="";
            parts['results'].forEach((part, idx) => {
                let div = `<div class="product">
                                ----------------------
                                <p class="name">${part.name}</p>
                                <p class="price">${part.price}</p>
                                <p class="carBrand">${part.carBrand}</p>
                                <p class="carModel">${part.carModel}</p>
                                <button onclick="javascript:subscribe(${part.id})">Subscribe to changes</button>
                            </div>
                        `;
                
                        searchGallery.insertAdjacentHTML("beforeend", div);
            });
        })
        .catch(error => console.error(error));
});

document.getElementById('clearSearch').onclick = ev => {
    searchGallery.innerHTML ="";
}

const advSearchButton = document.getElementById('advSearchButton');
advSearchButton.onclick = function () {
    const advSearchSection = document.getElementById('advancedSearch');
    advSearchSection.style.display = 'block';
    advSearchButton.style.display = 'none';
}

/*---- SUGGESTIONS ----*/

function refreshSuggestions() {
    console.log("refreshing product suggestions...");

    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = "";
    const productTemplate = document.getElementById('product-template').childNodes[1];

    fetch('/api/product/suggestions')
        .then(res => {
            return res.text();
        })
        .then(text => {
            return JSON.parse(text);
        })
        .then(suggestions => {
            suggestions['parts'].forEach(part => {

                let div = `<div class="product">
                                ----------------------
                                <p class="name">${part.name}</p>
                                <p class="price">${part.price}</p>
                                <p class="carBrand">${part.carBrand}</p>
                                <p class="carModel">${part.carModel}</p>
                                <button onclick="javascript:subscribe(${part.id})">Subscribe to changes</button>
                            </div>
                    `;

                suggestionsContainer.insertAdjacentHTML("beforeend", div);
            })
        })
        .catch()
}

const newProductForm = document.getElementById('newproductForm');
newProductForm.addEventListener('submit', e => {
    e.preventDefault();
    let data = {};
    (new FormData(document.forms['newproductform'])).forEach(function (value, key) {
        data[key] = value;
    });

    fetch("/api/product/vendorProducts", {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        method: "post",
    }).then((res) => {
        if (res.status === 200 || res.status === 201) {
            alert("part added");

        } else {
            alert("error occured");
        }
    }).catch((error) => {
        alert(error);
    })
})

// Update product
const prdGallery = document.getElementById('editPrdShow');
const getVndrPrd = document.getElementById('getVendorProducts');

function deleteProduct(prodId) {
    fetch('/api/product/deleteVendorProducts', {
        body: JSON.stringify({
            id: prodId
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: 'post'
    })
        .then(() => {
            getVndrPrd.click();
        })
        .catch(error => {
            console.log(error);
        })
}

getVndrPrd.onclick = () => {
    prdGallery.innerHTML = "";
    fetch('/api/product/vendorProducts')
        .then(res => {
            return res.text();
        })
        .then(txt => {
            console.log(txt);
            return JSON.parse(txt);
        })
        .then(vendorParts => {
            vendorParts['parts'].forEach((part, idx) => {
                let form = `<form id="editProductForm${idx}">
                                <input type="text" name="name" placeholder="name" value=${part.name}>
                                <input type="text" name="carBrand" placeholder="Car Brand" value=${part.carBrand}>
                                <input type="text" name="carModel" placeholder="Car Model" value=${part.carModel}>
                                <input type="number" name="price" placeholder="Price" value=${part.price} >
                                <input type="number" name="quantity" placeholder="Quantity" value=${part.quantity}>
                                <input type="number" name='makerId' placeholder="Manufacturer Code" value=${part.makerId}>
                                <input type="text" name="ean" placeholder="EAN" value=${part.ean}>
                                <input type="submit">
                            </form>
                            <button type="button" onclick="javascript:deleteProduct(${part.id})">Delete</button>
                        `;
                prdGallery.insertAdjacentHTML("beforeend", form);
                const updateForm = document.getElementById(`editProductForm${idx}`);
                updateForm.addEventListener('submit', e => {
                    e.preventDefault();
                    let data = {};
                    (new FormData(document.forms[`editProductForm${idx}`])).forEach(function (value, key) {
                        data[key] = value;
                    });
                    data.id = part.id;
                    fetch("/api/product/vendorProducts", {
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "put"
                    }).then((res) => {
                        if (res.status === 200 || res.status === 201) {
                            alert("part updated");

                        } else {
                            alert("error occured");
                        }
                    }).catch((error) => {
                        alert(error);
                    })
                })
            })
        })
        .then(() => {
            getVndrPrd.style.display = 'none';
            clrVndrPrd.style.display = 'block'
        })
        .catch(error => {
            console.log(error);
            alert("Something went wrong");

        })


}

const clrVndrPrd = document.getElementById('clearVendorProducts');
clrVndrPrd.onclick = () => {
    prdGallery.innerHTML = "";
    clrVndrPrd.style.display = 'none';
    getVndrPrd.style.display = 'block'
}
