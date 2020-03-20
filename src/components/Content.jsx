import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import qs from 'querystring';
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';
import LanguageList from '../static/language.json';
import Forms from '../static/Forms.jsx';
import FormsEn from '../static/FormsEn.jsx';


class Content extends Component {
  constructor(props){
    super(props);
    this.state = {
      code: '',
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

  editorDidMount(editor, monaco){
    editor.focus();
    
  }
  onChange = (value)=>{
    // console.log('value: ', value);
    this.setState({
      code: value
    });
  };
  selectChange = (id, value) => {
    // console.log('id - value: ', id, value);
    this.setState({
      [id]: value,
    });
  }
  saveAll = ()=>{
    axios.post(
      // // `${MAIN_URL}api/notes`,
      'http://getremember.com/api/notes',
      qs.stringify(
        {
          text: this.state.code,
          password:  this.state.password || '',
          lang:  this.state.language,
        },
      ),
    ).then((res) => {console.log(res.data, '2222');
        this.responseParser(res);
    }).catch((error) => {
      console.log(error.response.data);
      this.responseParser(error.response.data);
    })
  };
  responseParser = res => {
    if(res.status === 'error'){
      this.setState({
        error: res.message,  
      });
    }
    if(res.status === 200){
      this.setState({
        message: res.data.message,
      });
    }
  }

  render() {console.log('props', this.props);
    let rus = this.props.lang === 'rus';
    return (
      <React.Fragment>
        <Form className='formChoose-container'>
            {
              this.state.message ?
              <Alert variant='success'>
                <div dangerouslySetInnerHTML={{__html: this.state.message}} />
              </Alert>
               : false
            }
            {
              !!this.state.error ?
              <Alert variant='danger'>
                {this.state.error}
              </Alert>
               : false
            }
          <div className="main-choose">
            <Button
              variant='primary'
              onClick={()=>{this.saveAll()}}
            >
              {(rus ? Forms : FormsEn).save}
            </Button>
            <Form.Control
              id='language'
              as="select"
              className="select_choose"
              size='lg'
              style={{ width: '400px', textAlign: 'center' }}
              value={this.state.language}
              onChange={(e)=>{this.selectChange(e.target.id, e.target.value)}}
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
            <MonacoEditor
              width="100%"
              height="348px"
              language={this.state.language}
              theme="vs-light"
              value={this.state.code}
              options={this.options}
              onChange={(value)=>{this.onChange(value)}}
              editorDidMount={this.editorDidMount}
            />
          </Form.Group>
            <Form.Text>{(rus ? Forms : FormsEn).yourText}</Form.Text>
          <Form.Group className="main-choose_col">
            <div className="md-form form-lg mt-2 mb-2 w-100">
              <Form.Control
                id='password'
                as='input'
                type={'password'}
                placeholder={(rus ? Forms : FormsEn).password}
                onChange={(e)=>{this.selectChange(e.target.id, e.target.value)}}
              />
            </div>
            <Form.Text>
              {(rus ? Forms : FormsEn).passwordLabel}
              </Form.Text>
          </Form.Group>
          <Form.Group className="main-choose_col">
            <Button variant='primary' onClick={()=>{this.saveAll()}}>
              {(rus ? Forms : FormsEn).save}
            </Button>
          </Form.Group>
        </Form>
      </React.Fragment>
    );
  }
}

export default Content;
