import React, { Component } from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { createBrowserHistory } from "history";
import qs from 'querystring';
import axios from 'axios';
import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';
import {Aboute} from './Aboute.jsx';
import '../styles/App.css';

const hist = createBrowserHistory();

class App extends Component {
    state={
        lang: localStorage.getItem('lang'),
        message: '',
        error: '',
        findData: null,
    };
    changeLang = ()=>{
        this.state.lang === 'rus' 
            ? localStorage.setItem('lang', 'eng')
            : localStorage.setItem('lang', 'rus');
        this.setState({
            lang: localStorage.getItem('lang')
        });
    };
    makeRequest = (url, type, data, name)=>{
        axios[type](url, qs.stringify(data)).then( res => {
            this.responseParser(res, name);
        }).catch(error=>{
            this.responseParser(error.response.data);
        })
    }
    responseParser = (res, name) => {
        if(res.status === 'error'){console.error(res);
          this.setState({
            error: res.message,  
          });
        }
        if(res.status === 'not_found'){console.error(res);
            this.setState({
                error: res.message,  
            });
        }
        if(res.status === 200){
            switch(name){
                case 'saveNote': {
                    this.setState({
                        message: res.data.message,
                    });
                    break;
                }
                case 'searchNote':{
                    console.log('searchNote', res.data);
                    this.setState({
                        findData: res.data.data,
                    });
                    break;
                }
            }
        }
    }
    onSaveAll = data => {
        console.log('data: ', data);
        this.makeRequest(
            `${MAIN_URL}api/notes`,
            'post',
            data,
            'saveNote'
        );
    };
    onSearch = data => {
        console.log('search: ', data);
        this.makeRequest(
            `${MAIN_URL}api/notes/find`,
            'post',
            data,
            'searchNote'
        );
        // axios.post(
        //   // // `${MAIN_URL}api/notes`,
        //   'http://getremember.com/api/notes/find',
        //   qs.stringify(
        //     {
        //       code: data,
        //       password:  this.state.password || '',
        //       // lang:  this.state.language,
        //     },
        //   )
        // ).then((res) => {console.log(res.data, 'Find');
        //     // this.responseParser(res);
        // }).catch((error) => {
        //   console.log(error.response.data);
        //   // this.responseParser(error.response.data);
        // })
    }
    onChange = (id, value) => {
        console.log(id, value, '<---------');
        this.setState({
          [id]: value
        });
    }
    render() {
        return (
            <BrowserRouter>
                <Header 
                    changeLang={this.changeLang} 
                    lang={this.state.lang}
                    history={hist}
                    code={this.state.code}
                    onChange={(id, value)=>{this.onChange(id, value)}}
                    onSearch={data => {this.onSearch(data)}}
                />
                <main className='container justify-content-center body-content'>
                    <Switch>
                        <Route 
                            path={'/'} 
                            exact 
                            component={() => 
                                <Content 
                                    lang={this.state.lang} 
                                    history={hist}
                                    onSaveAll={data => {this.onSaveAll(data)}}
                                    message={this.state.message}
                                    error={this.state.error}
                                    findData={this.state.findData}
                                /> 
                            }
                        />
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
