import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,
   NavbarText,DropdownToggle, DropdownItem,UncontrolledDropdown, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Button, Card, Grid, Image, Icon, Header } from 'semantic-ui-react';

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  componentDidMount() {
    // retrieve user acount from session 
    let userInfoDetails = JSON.parse(window.sessionStorage.getItem('userAccount'));
    console.log("user infor from session --", userInfoDetails);
    this.setState({
      userInfo: userInfoDetails,
    });
  }
  render() {
    return <div>
              <Navbar color="dark" dark expand="md">
                <NavbarBrand color="red" tag={Link} to="#">Muvies App</NavbarBrand>

                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="mr-auto" navbar>
                 
                    <NavItem>
                      <NavLink tag={Link} to={this.state.userInfo ? "#" : "/"}>Home</NavLink>
                    </NavItem>
                  
                    <NavItem>
                      <NavLink  tag={Link} to="/movies">Muvies</NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Options
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          Option 1
                        </DropdownItem>
                        <DropdownItem>
                          Option 2
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                          Reset
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Nav>
                  {/* <NavbarText>Simple Text</NavbarText> */}

                  {/* Sign in Buttons */}
                  {/* <Button.Group floated='right'> */}
                  {this.state.userInfo &&
                      <div>
                      <NavbarText color="red">Welcome {this.state.userInfo.name}</NavbarText>
                      <Button color='blue' floated='right'>
                        <NavbarBrand tag={Link} to="/" onClick={() => {
                          window.sessionStorage.removeItem('userAccount');
                        }}>Sign Out</NavbarBrand>
                      </Button>
                      </div>
                  }

                  {!this.state.userInfo &&
                    
                      <Button color='blue' floated='right'>
                        <NavbarBrand tag={Link} to="/">Sign In</NavbarBrand>
                      </Button> 
                  }
                {/* </Button.Group> */}
                </Collapse>
              </Navbar>
        
      
      {/* <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
        <NavbarToggler onClick={this.toggle}/>
        <NavbarBrand tag={Link} to="/movies">Movies</NavbarBrand>
        <NavbarBrand tag={Link} to="#">More</NavbarBrand> */}
      </div>
  }
}