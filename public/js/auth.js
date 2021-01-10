/* ----- Auth Api handling ----- */
//get new access token
fetch('/api/auth/accessToken');

//refresh auth token every 4 min
const authTokenInt = setInterval(() => {
    fetch('/api/auth/accessToken')
}, 1000 * 60 * 4)

const user_temp = {
    id: "",
    name: "",
    email: "",
    role: ""
};

const user = {
    id: "",
    name: "",
    email: "",
    role: ""
};

function setUser(newUserValue) {
    if (!newUserValue) {
        newUserValue = user_temp
    }
    for (let k in user_temp) {
        user[k] = newUserValue[k]
    }

    //save user state in localStorage
    localStorage.setItem('user', JSON.stringify(newUserValue));

    document.getElementById('userId').innerText = user.id;
    document.getElementById('userRole').innerText = user.role;

    if (user.role === 'vendor') {
        document.getElementById('vendorSection').style.display = 'block';
    } else {
        document.getElementById('vendorSection').style.display = 'none';
    }
}

//retrive user from storage
const lsUser = JSON.parse(localStorage.getItem('user'));
if (!lsUser || Object.keys(lsUser).length === 4) {
    setUser(lsUser);
}

document.getElementById('userId').innerText = user.id;

let loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {};
    (new FormData(document.forms[0])).forEach(function (value, key) {
        data[key] = value;
    });

    fetch("/api/auth/login", {
        body: JSON.stringify(data),
        headers: {
            //"Content-Type": "application/x-www-form-urlencoded",
            "Content-Type": "application/json",
        },
        method: "post",
    }).then((res) => {
        if (res.status === 200) {
            alert("loged in");
            return res.text()
        } else {
            alert(res.statusText);
            return ""
        }
    })
        .then(text => {
            if (text.length !== 0) {
                const data = JSON.parse(text).user;
                setUser(data);
                //Object.assign(user, data)
            }
        })
        .catch((error) => {
            console.log(error)
            alert(error);
        })


})

let signupForm = document.getElementById('signupform');
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {};
    (new FormData(document.forms[1])).forEach(function (value, key) {
        data[key] = value;
    });
    fetch("/api/auth/signup", {
        body: JSON.stringify(data),
        headers: {
            //"Content-Type": "application/x-www-form-urlencoded",
            "Content-Type": "application/json",
        },
        method: "post",
    }).then((res) => {
        if (res.status === 200 || res.status === 201) {
            alert("user created");

        } else {
            alert("error occured");
        }
    }).catch((error) => {
        alert(error);
    })


})

let logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', (e) => {
    fetch('/api/auth/logout', {
        method: 'post'
    })
    .then((_) => {
        setUser(null);
    })
    .catch(e => {
        alert(e);
    })

})