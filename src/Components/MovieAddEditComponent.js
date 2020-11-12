import React, { Component } from 'react';
import NavigationBar from './NavigationBar';
import { Link, withRouter } from 'react-router-dom';
import { Form,Header,Button } from 'semantic-ui-react'
import MovieDataService from '../Services/MovieService';
import { Alert } from 'reactstrap';

class MovieAddEditComponent extends Component {

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
            submittedMovie:{ 
                moviename: '',
                director: '',
                imdbscore: '',
                genre: [],
                popularity: '',
            },
            moviename: this.props.movieToEdit && this.props.movieToEdit.name ? this.props.movieToEdit.name :'',
            director: this.props.movieToEdit && this.props.movieToEdit.director ? this.props.movieToEdit.director : '',
            popularity: this.props.movieToEdit && this.props.movieToEdit.popularity ? this.props.movieToEdit.popularity : '',
            genre: this.props.movieToEdit && this.props.movieToEdit.genre ? this.props.movieToEdit.genre : [],
            genreItem: undefined,
        }
        console.log('Movie received for editing -',  this.props.movieToEdit);
        this.movieService = new MovieDataService();
    }

    
    handleOnBlurForGenre = (e) => {
        let genreList = [];
        let value = e.target && e.target.value;
        console.log('genre - ',value);
        if(value !== '' && value.indexOf(',') > -1) {
            
            value.split(',').map((genreItem) => {
                genreItem = genreItem.trim();
                if(genreItem.trim().length > 0) {
                    genreList.push({name:genreItem})
                }
            });
            console.log('received list and created list ====>',genreList);

            this.setState({ 
                genre: [...genreList],
            });
        } else if(value !== '') {
            this.setState({ 
                genre: [{name:value}],
            });
        }  
        
    }
  handleChange = (e, { name, value }) => {
    
    this.setState({ [name]: value });
  }
  

  handleSubmit = () => {
    // clearing other common errors if any before submit again
    this.setState({
        apiError: false,
    });
    let addEditResponseData = {};
    let submittedMovie = {
        name: this.state.moviename, 
        director: this.state.director,
        imdb_score: (this.state.popularity / 10).toFixed(1),
        genre: this.state.genre,
        popularity: this.state.popularity,
    };

    // edit api
    if(this.props.isEditPage) {
        this.movieService.updateMovie(submittedMovie.name, submittedMovie.movie_id,submittedMovie).then(
            response => {
                console.log('update movie api response -', response.data);
                
                addEditResponseData = {
                    addEditResponseData: response.data,
                    isSuccess: true,
                    isEditResponse: true,
                }

                this.setState({
                    editedMovie: response.data,
                    responseData: addEditResponseData,
                });
                this.props.responseCallback(addEditResponseData);
            }
        ).catch((err) => {
            addEditResponseData = {
                isSuccess: false,
                isEditResponse: true,
            }
          
            this.setState({ 
                responseData: addEditResponseData,
                apiError: true,
                apiErrorMessage: 'Sorry , error in backend api . Please try again',
            });
            return Promise.reject(err);
        });
    } 


    // add api
    if(!this.props.isEditPage) {
        this.movieService.addMovie(submittedMovie.name,submittedMovie).then(
            response => {
                console.log('add movie api response -', response.data);
                addEditResponseData = {
                    addEditResponseData: response.data,
                    isSuccess: true,
                    isEditResponse: false,
                    addedMovieName: submittedMovie.name,
                }

                this.setState({ 
                    addedMovie: response.data,
                    responseData: addEditResponseData,
                });
                this.props.responseCallback(addEditResponseData);
            }
            
        ).catch((err) => {
            addEditResponseData = {
                isSuccess: false,
                isEditResponse: false,
                apiError: true,
                apiErrorMessage: 'Sorry , error in backend api . Please try again',
            }
            this.setState({ 
                apiError: true,
                responseData: addEditResponseData,
            });
            return Promise.reject(err);
        });
    }
   
  }
  getCommaSeperatedGenreList() {
    
        if(this.props.isEditPage && !this.state.genreItem) {
            return this.props.movieToEdit.genre.map((item) => {
                return item.name;
            });
        } else {
            return this.state.genreItem;
        }
  }
  render() {
    

    return (
      <div>

        <div style={{margin: '40px'}}>

        {/* common api error */}
        {this.state.apiError && this.state.apiErrorMessage &&
              <Alert color="danger">
                {this.state.findApiErrorMessage}
              </Alert>
        }

        <Header size='large'>{this.props.page === 'add' ? 'Movie Add' : 'Movie Update'}</Header>
        <Form onSubmit={this.handleSubmit}>

            <Form.Group widths={2}>
                <Form.Input
                    label='Movie Name'
                    placeholder='movie name'
                    name='moviename'
                    value={this.state.moviename}
                    onChange={this.handleChange}
                    required
                    disabled={this.props.isEditPage}
                />
                <Form.Input
                    label='Director Name' 
                    placeholder='directors name'
                    name='director'
                    value={this.state.director}
                    onChange={this.handleChange}
                    required
                    
                />

                
            </Form.Group>
            
            <Form.Group widths={2}>
                
                <Form.Input
                    label='Popularity %'
                    placeholder='ranges from 1 to 100'
                    name='popularity'
                    value={this.state.popularity}
                    onChange={this.handleChange}
                    type='number'
                    min={1}
                    max={100}
                    required
                />
                <Form.Input
                    label='Enter Genre  - [comma sepereted for multiple Genre]'
                    placeholder='comma seperated genre'
                    name='genreItem'
                    value={this.getCommaSeperatedGenreList()}
                    onBlur={this.handleOnBlurForGenre}
                    onChange={this.handleChange}
                    required
                    type='text'
                />

            </Form.Group>
            <Form.Button content='Submit' primary/>
            
            {/* <Button type='submit'>Submit</Button> */}
        </Form>
        <br/><br/>
        <Button floated='right' content='Back To Movies >' 
            secondary onClick={() => {this.props.backToMoviesCallback()}} />
        </div>
    
      </div>
    )
  }
}

export default withRouter(MovieAddEditComponent);