import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav'
import Forms from '../static/Forms.jsx';
import FormsEn from '../static/FormsEn.jsx';
import { Link } from 'react-router-dom';
import RU from '../assets/ru.svg';
import Eng from '../assets/gb.svg';


class Header extends Component {
  constructor(props){
    super(props);
    this.state={
      text: '',
      lang: this.props.lang
    }
  }
  componentDidMount() {
    !!this.props.lang ? null 
      : localStorage.setItem('lang', 'rus');
  }

  onChange = e => {
    this.setState({
      text: e.target.value
    });
  }
  render() {
    let rus = (this.props.lang === 'rus');
    return (
      <>
        <Navbar expand="lg" className="my-container" >
          <div className="container justify-content-space-between">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Form inline>
              <Button 
                variant="success" 
                className='d-none d-lg-block mr-sm-20'>
                  {(rus ? Forms : FormsEn).newTick}
              </Button>
              <div className="md-form form-sm m-2">
                <FormControl 
                  type="text" 
                  placeholder={(rus ? Forms : FormsEn).codeName} 
                  value={this.state.text} 
                  onChange={this.onChange}
                />
              </div>
              <Button variant="primary">{(rus ? Forms : FormsEn).search}</Button>
            </Form>
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Link to='/' className="ml-4 link">
                  {(rus ? Forms : FormsEn).home}
              </Link>
              <Link to='/about' className="ml-4 link">
                  {(rus ? Forms : FormsEn).about}
              </Link>
              <Image
                src={this.props.lang === 'rus' ? Eng : RU} 
                rounded
                onClick={()=>{this.props.changeLang()}}
                className='ml-4 customImg'
                alt={this.props.lang === 'rus' ? 'Английский' : 'Russian'}
                width={34} 
                height={40}
              />
            </Navbar.Collapse>
          </div>
        </Navbar>
        <button 
          className='d-block d-lg-none customRound'
        >
          +
        </button>
      </>
    );
  }
}

export default Header;
