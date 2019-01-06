//Import react and react dom Libraries
    import React from 'react';
    import ReactDom from 'react-dom';

//Create a react component

const App = ()=> {
    return <div>Hi there!!</div>
};

// Take the ract component and show it on the screen

ReactDom.render(

    <App />,
    document.querySelector('#root')

);