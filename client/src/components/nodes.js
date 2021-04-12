import React, { Component } from 'react'
import ReactDOM from 'react-dom'


export default class Nodes extends Component{
    constructor() {
        super()
        this.state = {

        }
    }

    componentDidMount() {
        this.fetchNodes()
            .then(res => {
                this.res = res
            })
    }

    fetchNodes = async () => {
        let test = await fetch('/api/nodes/1')
        let body = await test.json()
        return body
    }

    render() {
        let list

        async function fetchNodes() {
            let test = await fetch('/api/nodes/1', {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    }
                })
                .then(data => {
                    console.log(data)
                    data.json()
                })
                .then(res => {
                    ReactDOM.render(<li>1</li>, document.getElementById('list'))
                })
                .catch(e => {
                    console.log(e)
                })
            console.log(test)
        }

        console.log(this.res)
        
        return (
            <div>
                <h1>Nodes:</h1>
                <ul id="list">
                    {list}
                </ul>
                <button className="btn" onClick={fetchNodes}>
                    Fetch
                </button>
            </div>
        )
    }
}
