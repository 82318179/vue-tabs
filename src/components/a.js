let abc = [{
        label: "google",
        key: "google"
    },
    {
        label: "facebook",
        key: "facebook"
    },
    {
        label: "New Tab",
        key: "costomKey"
    }
]

function a(...arg) {
    for (let item of arg) {
        console.log(item);
    }
}

a(abc)