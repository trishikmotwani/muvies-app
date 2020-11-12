import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import { Link, withRouter } from 'react-router-dom';
import { Form,Header,Button } from 'semantic-ui-react'
import MovieDataService from '../Services/MovieService';
import { Alert } from 'reactstrap';


class SignUpIn extends Component {

    movieService;
    constructor(props) {
        super(props);
        this.state = {
            signupContainerDivStyle: {
                margin: '20px',
            },
            signupFormDivStyle: {
                margin: '20px',
            },
            submittedUser:{ 
                    name: '', 
                    email: '', 
                    password: '' 
            },
            name: '', 
            email: '', 
            password: '',
        }
        this.movieService = new MovieDataService();
    }

  componentDidMount() {

     // retrieve user acount from session 
     let userInfoDetails = JSON.parse(window.sessionStorage.getItem('userAccount'));
     console.log("user infor from session --", userInfoDetails);
     this.setState({
       userInfo: userInfoDetails,
     });
  }  

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    
   
    let submittedUser = {
        name: this.state.name, 
        email: this.state.email,
        password: this.state.password,
    };
    console.log('Submitted uder for sign in ---', submittedUser);
    this.movieService.retrieveUserByEmail(submittedUser.email,submittedUser.password).then(
        response => {
            console.log('response for search user id ---', response.data);
            if(response.data[0]) {
                // user present in db
                this.setState({
                    findUserResponse: response.data[0],
                    isAdmin: response.data[0] && response.data[0].admin === true ? true : false,
                });


                // is sign is successfull ---> encrypt password and store in session
                let userAccount = response.data[0];
                window.sessionStorage.setItem('userAccount',JSON.stringify(userAccount));

                // navigate mo movies page
                this.props.history.push('/movies');
            } else {
                // user not present in Db
                this.setState({
                    findUserResponse: response.data,
                    findApiError: true,
                    findApiErrorMessage: 'Could not find your details, please SIGN UP',
                });
            }
            
        }
    ).catch((err) => {
        
        this.setState({ 
            
            apiError: true,
            apiErrorMessage: 'Sorry , error in backend api . Please try again',
            
        });
        return Promise.reject(err);
    });
       
    // this.movieService.saveAndSignUpUser(this.state.submittedUser);
   
  }

  render() {
    

    return (
      <div>
        <NavigationBar></NavigationBar>

        <div style={{margin: '40px'}}>
        {/* No user found */}
        {this.state.findApiError && this.state.findApiErrorMessage &&
              <Alert color="danger">
                {this.state.findApiErrorMessage}
              </Alert>
        }

        {/* common api error */}
        {this.state.apiError && this.state.apiErrorMessage &&
              <Alert color="danger">
                {this.state.apiErrorMessage}
              </Alert>
        }
        <Header size='large'>{this.props.page === 'add' ? 'Sign In' : 'Sign IN'}</Header>
        <Form onSubmit={this.handleSubmit}>

            <Form.Group widths={2}>
                <Form.Input
                    label='Enter Email'
                    placeholder='Email'
                    name='email'
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                    type='email'
                    for='email'
            
                />
                {/* <Form.Input
                    label='Enter Name' 
                    placeholder='Name'
                    name='name'
                    value={this.state.name}
                    onChange={this.handleChange}
                    required
                    
                /> */}

                
            </Form.Group>
            
            <Form.Group widths={2}>
                
                <Form.Input
                    label='Enter Password'
                    placeholder='password'
                    name='password'
                    value={this.state.password}
                    onChange={this.handleChange}
                    type='password'
                    required
                />
            

            </Form.Group>
            <Form.Button content='Submit' primary/>
            {/* <Button type='submit'>Submit</Button> */}
            <Button floated='right' content='Explore Movies Page >'
                    secondary primary href="/movies" />
        </Form>
        </div>
    
      </div>
    )
  }
}

export default withRouter(SignUpIn);