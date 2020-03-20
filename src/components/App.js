import React, { Component } from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { createBrowserHistory } from "history";
import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';
import {Aboute} from './Aboute.jsx';
import '../styles/App.css';

const hist = createBrowserHistory();

class App extends Component {
    state={
        lang: localStorage.getItem('lang'),
    };
    changeLang = ()=>{
        this.state.lang === 'rus' 
            ? localStorage.setItem('lang', 'eng')
            : localStorage.setItem('lang', 'rus');
        this.setState({
            lang: localStorage.getItem('lang')
        });
    }
    render() {
        return (
            <BrowserRouter>
                <Header 
                    changeLang={this.changeLang} 
                    lang={this.state.lang}
                    history={hist}
                />
                <main className='container justify-content-center body-content'>
                    <Switch>
                        <Route path={'/'} exact component={() => <Content lang={this.state.lang} history={hist}/> }/>
                        <Route 
                            path={'/about'} 
                            component={()=> <Aboute lang={this.state.lang} history={hist}/>}
                        />
                    </Switch>
                </main>
                {/* <Content /> */}
                <Footer history={hist} lang={this.state.lang}/>
            </BrowserRouter>
        );
    }
}

export default App;
