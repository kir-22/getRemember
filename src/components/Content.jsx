import React, { Component } from 'react';
import MonacoEditor, {MonacoDiffEditor} from 'react-monaco-editor'; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import qs from 'querystring';
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';
import { Link } from 'react-router-dom';
import LanguageList from '../static/language.json';
import Forms from '../static/Forms.jsx';
import FormsEn from '../static/FormsEn.jsx';


class Content extends Component {
  constructor(props){
    super(props);
    this.state = {
      text: '',
      language: 'javascript',
      password: '',
      languageData: LanguageList.language,
    }
    this.options = {
        selectOnLineNumbers: true,
        roundedSelection: true,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: false,
        theme: 'vs-light',
        colorDecorators: true,

    }
  };

  componentDidUpdate(nextProps, nextState) {
    console.log('----->',nextProps, this.props);
    // !!this.props.findData ? 
    // this.setState({
    //   text: JSON.parse(this.props.findData.text).text,
    //   language: JSON.parse(this.props.findData.text).lang,
    // }) : false;
  }
  shouldComponentUpdate(nextProps, nextState){
    console.log('should----->',nextProps, this.props);
    return true;
  }
  componentDidMount() {
    console.warn('Helllo');
    !!this.props.findData ? 
    this.setState({
      text: JSON.parse(this.props.findData.text).text,
      language: JSON.parse(this.props.findData.text).lang,
      message: `Фраза для получения: <b>${this.props.findData.code}</b><br/> Ссылка: <a target="_blank" href='https://getremember.com/view/${this.props.findData.t_code}'>https://getremember.com/view/${this.props.findData.t_code}</a>`,
      // <div>
      //   Фраза для получения: <b>${this.props.findData.code}</b><br/> Ссылка: 
      //     {/* <a href={`https://getremember.com/view/${this.props.findData.t_code}`} target='_blank'>
      //       https://getremember.com/view/${this.props.findData['t_code']}
      //     </a> */}
      //     <Link to={`/views/${this.props.findData.t_code}`}>
      //       https://getremember.com/view/${this.props.findData['t_code']}
      //     </Link>
      //   </div>
    }) : false;
  }
  
  // editorDidMount(editor, monaco){
  //   console.log('Mounted editor', editor);//Можно здесь обновить стейт для значений если пришли найденные данные
  //   editor.focus();
  //   // this.checkFindData();
  // }
  checkFindData = ()=>{
    console.log('CHECK');
  };
  onChange = (id, value)=>{
    console.log('value: ',id, value);
    this.setState({
      [id]: value
    });
  };

  render() {
    console.log('props', this.props.findData);
    console.log('parentId', this.props.parentId);
    console.log("this.props.historyCode ", this.props.historyCode );
    const code1 = "// your original code...";
    const code2 = "// a different version...";
    const options = {
      //renderSideBySide: false
    };
    let rus = this.props.lang === 'rus';
    let alert = !!this.props.error 
      ? <Alert variant='danger'>
          {this.props.error}
            <div className="md-form form-sm m-2">
              <Form.Control
                id='password'
                as='input'
                type={'password'}
                placeholder={(rus ? Forms : FormsEn).password}
                onChange={(e)=>{this.onChange(e.target.id, e.target.value)}}
                value={this.state.password}
              />
            </div>
            <Button 
              variant="primary" 
              onClick={()=>{
                this.props.onSearch(
                  {
                    password: this.state.password,
                  }
                )
              }}
            >
              {(rus ? Forms : FormsEn).search}
            </Button>
        </Alert> 
      : !!this.props.message 
        ? <Alert variant='success'>
            <div dangerouslySetInnerHTML={{__html: this.props.message}} />
            {/* {this.props.message} */}
          </Alert>
        : false;
    return (
      <React.Fragment>
        <Form className='formChoose-container'>
          { alert }
          <div className="main-choose">
            <Button
              variant='primary'
              onClick={()=>{
                this.props.onSaveAll(
                  {
                    text: this.state.text,
                    password: this.state.password,
                    lang: this.state.language,
                    parent_code: this.props.parentId,
                  }
                )
              }}
            >
              {(rus ? Forms : FormsEn).save}
            </Button>
            <Form.Control
              id='language'
              as="select"
              className="select_choose"
              size='lg'
              style={{ width: '400px', textAlign: 'center' }}
              value={ this.state.language}
              onChange={(e)=>{this.onChange(e.target.id, e.target.value)}}
            >
              {
                this.state.languageData.map((el, i) => (
                  <option key={i+el} value={el}>
                    {el}
                  </option>
                ))
              }
            </Form.Control>
          </div>
          <Form.Group className="main-choose_col editor">
                {/* <MonacoEditor
                  width="100%"
                  height="348px"
                  language={this.props.language}
                  theme="vs-light"
                  value= {this.state.text}
                  options={this.options}
                  onChange={(value)=>{this.onChange('text', value)}}
                  editorDidMount={this.editorDidMount}
                />  */}

            { 
              !this.props.historyData.text
              ? <MonacoEditor
                  width="100%"
                  height="348px"
                  language={this.props.language}
                  theme="vs-light"
                  value= {this.state.text}
                  options={this.options}
                  onChange={(value)=>{this.onChange('text', value)}}
                  editorDidMount={this.editorDidMount}
                /> 
              : <MonacoDiffEditor
                  width="100%"
                  height="348px"
                  language={this.props.language}
                  originalLanguage={this.props.historyData.language}
                  original={this.props.historyData.text}
                  value={this.state.text}
                  options={options}
                />
            }
          </Form.Group>
          <Form.Text>{(rus ? Forms : FormsEn).yourText}</Form.Text>
          {
            !!this.props.historyCode 
            ? !this.props.historyData.text  
                ? <Form.Group className="main-choose_col">
                    <Button 
                      variant='primary'  
                      onClick={()=>{
                        this.props.showhistoryCode(
                          {
                            code: this.props.historyCode,
                            password: '',
                          }
                      )}}
                    >
                      {(rus ? Forms : FormsEn).showHistory}
                    </Button>
                  </Form.Group>
                : <Form.Group className="main-choose_col">
                    <Button 
                    variant='primary'  
                    onClick={() => this.props.hideHistoryCode()}
                  >
                    {(rus ? Forms : FormsEn).hideHistory}
                  </Button>
                </Form.Group>
            : null
          }
          <Form.Group className="main-choose_col">
            <div className="md-form form-lg mt-2 mb-2 w-100">
              <Form.Control
                id='password'
                as='input'
                type={'password'}
                placeholder={(rus ? Forms : FormsEn).password}
                onChange={(e)=>{this.onChange(e.target.id, e.target.value)}}
                value={this.state.password}
              />
            </div>
            <Form.Text>
              {(rus ? Forms : FormsEn).passwordLabel}
              </Form.Text>
          </Form.Group>
          <Form.Group className="main-choose_col">
            <Button 
              variant='primary'  
              onClick={()=>{
                this.props.onSaveAll(
                  {
                    text: this.state.text,
                    password: this.state.password,
                    lang: this.state.language,
                  }
              )}}
            >
              {(rus ? Forms : FormsEn).saveAsNew}
            </Button>
          </Form.Group>
        </Form>
      </React.Fragment>
    );
  }
}

export default Content;
