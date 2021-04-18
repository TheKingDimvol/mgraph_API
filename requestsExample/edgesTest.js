function getEdgeFunc() {
    fetch("http://localhost:5000/api/edges?desk=1057")
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
function postEdgeFunc() {
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
                //community: 0,
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

function deleteEdgeFunc() {
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

function putEdgeFunc() {
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