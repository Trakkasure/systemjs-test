import React from 'react';
import {autobind} from 'core-decorators';

export default class Test extends React.PureComponent {
    constructor() {
        super();
        this.state={count:0};
    }

    @autobind
    handleClick() {
        SystemJS.import('src/module1/dist/bundle.js').then(module1=>{
            this.module1=module1;
            this.setState({"count":this.state.count+1});
        });
    }
    render() {
        if (this.module1) return React.createElement(this.module1,{});
        else return (
            <div onClick={this.handleClick}><h1>Hello World</h1></div>
        )
    }
}
// This loads the code on-demand as a bundle. But requires that the module be built-in to the webpack bundle as a chunk.
// System.import('src/module1/dist/bundle.js');
