function getNodeFunc() {
    fetch("http://localhost:5000/api/nodes?desk=1057")
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data && data.error) {
                console.warn(data.error)
            } else {
                console.log(data)
            }
        })
}
// Пример запроса, который добовляет одну вершину в список
function postNodeFunc() {
    fetch("http://localhost:5000/api/nodes", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            deskID: 1057,
            typeID: 1078,
            properties: {
                title: 'Тестовая кампания',
                description: '',
                sources: '',
                timesize: '',
                size: ''
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json()
        }
    })
    .then(data => {
        if (data && data.error) {
            console.warn(data.error)
        }
    })
}

function deleteNodeFunc() {
    fetch("http://localhost:5000/api/nodes/gdffd", {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json()
        }
    })
    .then(data => {
        if (data && data.error) {
            console.warn(data.error)
        }
    })
}

function putNodeFunc() {
    fetch("http://localhost:5000/api/nodes/1162", {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            //title: '1',
            description: 'new',
            size: 20
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json()
        }
    })
    .then(data => {
        if (data && data.error) {
            console.warn(data.error)
        }
    })
}