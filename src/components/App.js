import React, { Component } from "react";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { createBrowserHistory } from "history";
import qs from 'querystring';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
        code: null,
        historyCode: null,
        historyData: {},
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
                findData: null, 
            });
        }
        if(res.status === 200){
            switch(name){
                case 'saveNote': {
                    this.setState({
                        findData: null,
                        error: null,
                        message: res.data.message,
                    });
                    break;
                }
                case 'searchNote': {
                    console.log('searchNote', res.data);
                    this.setState({
                        findData: res.data.data,
                        error: null,
                        message: `Фраза для получения: <b>${res.data.data.code}</b><br/> Ссылка: <a target="_blank" href='https://getremember.com/view/${res.data.data.t_code}'>https://getremember.com/view/${res.data.data.t_code}</a>`,
                        historyCode: res.data.data.parent_code,
                        // message: <div>
                        //             Фраза для получения: <b>{res.data.data.code}</b><br/> Ссылка: 
                        //             <Link to={`/views/${res.data.data.t_code}`}>
                        //                 {`https://getremember.com/view/${ res.data.data['t_code']}`}
                        //             </Link>
                        //         </div>
                    });
                    break;
                }
                case 'historyCode': {
                    console.log('historyCode', res.data.data);
                    this.state.historyData['text'] = JSON.parse(res.data.data.text).text;
                    this.state.historyData['language'] = JSON.parse(res.data.data.text).lang;
                    this.setState({
                        historyData: this.state.historyData,
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
        this.setState({
            code: data.code,
        },()=>{
            this.makeRequest(
                `${MAIN_URL}api/notes/find`,
                'post',
                data,
                'searchNote'
                );
        });
    }
    onSearchAgain = (data) => {
        this.makeRequest(
            `${MAIN_URL}api/notes/find`,
            'post',
            {
                code: this.state.code, 
                ...data
            },
            'searchNote'
        );
    }
    onChange = (id, value) => {
        console.log(id, value, '<---------');
        this.setState({
          [id]: value
        });
    };
    newTick = () => {
        this.setState({
            findData: false,
            message: null,
            error: null,
            parentId: null,
        });
    };

    showhistoryCode = data => {
        this.makeRequest(
            `${MAIN_URL}api/notes/find`,
            'post',
            data,
            'historyCode'
        );
    }
    hideHistoryCode = () => {
        this.setState({
            historyData: {},
        });
    };

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
                    newTick={() => {this.newTick()}}
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
                                    onSearch={data => {this.onSearchAgain(data)}}
                                    parentId={this.state.code}
                                    historyCode={this.state.historyCode}
                                    showhistoryCode={data => this.showhistoryCode(data)}
                                    historyData={this.state.historyData}
                                    hideHistoryCode = {this.hideHistoryCode}
                                /> 
                            }
                        />
                        <Route 
                            path={'/about'} 
                            component={()=> <Aboute lang={this.state.lang} history={hist}/>}
                        />
                        <Route 
                            path={'/views/'+`${this.state.findData ? this.state.findData.t_code : ''}`}
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
                    </Switch>
                </main>
                {/* <Content /> */}
                <Footer history={hist} lang={this.state.lang}/>
            </BrowserRouter>
        );
    }
}

export default App;
