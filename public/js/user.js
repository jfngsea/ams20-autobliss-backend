const newcard = document.getElementById('newcard');
newcard.addEventListener('submit', e => {
    e.preventDefault()
    let data = {};
    (new FormData(document.forms['newcard'])).forEach(function (value, key) {
        if (value !== "") {
            data[key] = value;
        }
    });

    fetch("/api/user/card", {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        method: "post",
    })
    .then( res => res.text())
    .then( txt =>  console.log(txt))
})

const newAdr = document.getElementById('newadr');
newAdr.addEventListener('submit', e => {
    e.preventDefault()
    let data = {};
    (new FormData(document.forms['newadr'])).forEach(function (value, key) {
        if (value !== "") {
            data[key] = value;
        }
    });

    fetch("/api/user/address", {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
        method: "post",
    })
    .then( res => res.text())
    .then( txt =>  console.log(txt))
})