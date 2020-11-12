import React, { Component } from 'react';
import { ButtonGroup, Container, Table, Alert,Spinner } from 'reactstrap';
import NavigationBar from './NavigationBar';
import { Link, withRouter } from 'react-router-dom';
import { allMoviesData } from '../Model/imdb.js';
import { Button, Card, Grid, Image, Icon, Header,Input, Item } from 'semantic-ui-react';
import MovieAddEditComponent from './MovieAddEditComponent';
import MovieDataService from '../Services/MovieService';

class MovieComponent extends Component {

  movieService;
  constructor(props) {
    super(props);
    this.state = {
      allMovies: [],
      isLoading: true,
      showAddMoviePage: false,
      showUpdateMoviePage: false,
      showAllMoviesPage: true,
      gridSize: 4,
      selectedMovie: undefined,
      topGenres: [],
      genreColorList: ['red','orange','yellow','olive','cyan','teal','blue','violet','purple'
      ,'pink','brown','grey','black'],
      isMobileScreen: false,
      searchCriteria:undefined,
      searchValue:undefined,
    }
    this.movieService = new MovieDataService();
  }

  componentDidMount() {
    this.setState({isLoading: true});

    // retrieve user acount from session 
    let userInfoDetails = JSON.parse(window.sessionStorage.getItem('userAccount'));
    console.log("user infor from session --", userInfoDetails);
    this.setState({
      userInfo: userInfoDetails,
    });


    // resize event to check size of screen
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    // reteieve all movies data from backedn
    this.retrieveAllMoviesData();

    if(this.state.allMovies && this.state.allMovies.length === 0) {
      setTimeout(() => {
        this.setState({
          isLoading: false,
        });
      }, 2000);
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  retrieveAllMoviesData = () => {

    this.movieService.retrieveAllMovies().then(
          response => {
              
              console.log('getAllMoviesData api length -', response.data.length);
              const allMoviesResponse = [] = response.data;
              
              this.setState({
                allMovies: this.sortAsPerImdbrating(allMoviesResponse),
                topGenres: this.fetchAvailableGenres(allMoviesResponse),
              });
          }
      )
    
  }

  fetchAvailableGenres = (allMoviesResponse) => {
    let topGenres = [];
    allMoviesResponse.map((movie) => {
      movie.genre.map((genre) => {
        topGenres.push(genre.name);
      });
    });

    topGenres = topGenres.filter((genre,index,self) => {
      return self.indexOf(genre) === index;
    });
    
    console.log('Top Genres',topGenres.length);
    return topGenres;
  }
  sortAsPerImdbrating = (allMoviesData) => {
    return allMoviesData.sort((a, b) => {return a.popularity > b.popularity ? -1 : 1});
  }


  resize() {
      this.setState({
        isMobileScreen: window.innerWidth <= 760 ? true : false,
      });
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.resize.bind(this));
  }

  showAddMoviePage = () => {
    this.setState({
      showAddMoviePage: true,
      showUpdateMoviePage: false,
      showAllMoviesPage: false,
    });
  }

  editMovie(movie) {
    console.log('movie to edit', movie);
    this.setState({
      movieToEdit: movie,
      showUpdateMoviePage: true,
      showAddMoviePage: false,
      showAllMoviesPage:false,
    });
  }
  deleteMovie(movie) {
    // clearing other common errors if any before submit again
    this.setState({
      apiError: false,
    });
    console.log('movie to delete', movie);

    this.movieService.deleteMovie(movie.name, movie.movie_id).then(
      response => {
          console.log('delete movie api successful for id  -' + movie.movie_id, response);
          this.setState({
            deletedMovie: movie,
            isSuccessfulResponse: true, 
            successResponseMessage: response.data,
            isDeleteSuccess: true,
          }, () => {
            // After Deletion, call the retrieve api again to fetch Movies list from DB
            this.retrieveAllMoviesData();
            window.scrollTo(0, 0);
          });
      }
    ).catch((err) => {
      this.setState({ 
        apiError: true,
        apiErrorMessage: 'Sorry , error in backend api . Please try again',
      });
      return Promise.reject(err);
    });
  }
  showGenreSearchButtons = () => {

    if(!this.state.isMobileScreen) {
      return this.state.genreColorList.map((color,i) => {
        return (
          <Button color={color} onClick={(e) => {
                                                  this.setState({
                                                    searchValue: e.target.innerText,
                                                    searchCriteria: 'genre',
                                                  });
                                                  console.log('selected genre -',e.target.innerText);
                                                }
                                        }
          >
            {this.state.topGenres[i]}
          </Button>
        )
      });
    }
    
  }

  getCommaSeperatedGenreList = (genreArr) => {
  
    return genreArr.map((item,i) => {
      return (i === genreArr.length - 1) ? item.name : item.name + ',' ;
    
    });
  }

  searchByGenre(movie) {
    let isGenrePresent = false;
    if(this.state.searchValue && this.state.searchCriteria && this.state.searchCriteria === 'genre'){
      for(let i=0;i<movie.genre.length;i++) {
        if(movie.genre[i].name.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) > -1) {
          isGenrePresent = true;
          break;
        }
      }
    }
    return isGenrePresent;
  }
  showMoviesGrid() {

      const movieList = this.state.allMovies.filter((movie) => { 
          if((this.state.searchValue && this.state.searchCriteria && this.state.searchValue.length >= 2
              && this.state.searchCriteria === 'byMuvieAndDirectorName'
              && (movie.name.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) > -1 || 
              movie.director.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) > -1))
            || this.searchByGenre(movie)
            || this.state.searchValue === undefined
            || this.state.searchValue === '') {

              return movie;
          }
      }).map((fmovie) => {

            return(
              <tr key={fmovie.name}>
                  <td style={{whiteSpace: 'nowrap'}}>{fmovie.name}</td>
                  <td>{fmovie.director}</td>
                  <td>{this.getCommaSeperatedGenreList(fmovie.genre)}</td>
                  <td>{fmovie.popularity}{'%'}</td>

                  {/* // allow to edit/delete only if admin */}
                  {this.state.userInfo && this.state.userInfo.admin &&
                    <td>
                      <ButtonGroup>
                        <Button size="sm" color="grey" onClick={(e) => this.editMovie(fmovie)}> Edit</Button>
                        <Button size="sm" color="red" onClick={(e) => this.deleteMovie(fmovie)}> Delete</Button>
                      </ButtonGroup>
                    </td>
                  }
                </tr>
              )
      });
      return movieList;
  }

  searchMoviesByNameAndDirector(event) {
    console.log('Search item -',event.target.value);
    this.setState({
      searchValue: event.target.value,
      searchCriteria: 'byMuvieAndDirectorName',
    });
  }

  handleAddEditCallback = (responseData) => {
    console.log('call back from add/edit api with response data', responseData);
    this.setState({
      showAddMoviePage:false,
      showUpdateMoviePage:false,
      showAllMoviesPage: responseData.isEditResponse || responseData.isAddResponse || true,
      isSuccessfulResponse: responseData.isSuccess || false,
      successResponseMessage: responseData.isEditResponse 
                    ? 'Movie Edited Successfully with name :' + responseData.addEditResponseData.name
                    : !responseData.isEditResponse  && responseData.addEditResponseData
                      ? 'Movie Added Successfully with name :' + responseData.addedMovieName
                      : 'Movie Eited/Added Successfully'
    });
    // Finally call the retrieve api again to fetch the Updated/Added Movies list from DB 
    this.retrieveAllMoviesData();
  }

  backToMoviesPage = () => {
    this.setState({
      showAddMoviePage:false,
      showUpdateMoviePage:false,
      showAllMoviesPage: true,
    });
  }
  render() {
    
    if (this.state.isLoading) {
      return <div 
              style={{align:"center"}}>
                <Spinner style={{ width: '3rem', height: '3rem' }} />{' '}
                <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" />
             </div>;
    }

    return (
      <div>
        <NavigationBar/>
       
        {this.state.showAllMoviesPage && this.state.allMovies &&

        <Container fluid>
            {this.state.isSuccessfulResponse && this.state.successResponseMessage &&
              <Alert color="success">
                {this.state.successResponseMessage}
              </Alert>
            }
            {this.state.isFailureResponse && this.state.failureResponseMessage &&
              <Alert color="danger">
                {this.state.failureResponseMessage}
              </Alert>
            }
            {/* common api error */}
            {this.state.apiError && this.state.apiErrorMessage &&
                  <Alert color="danger">
                    {this.state.apiErrorMessage}
                  </Alert>
            }

            {/* allow user to add movies= only is its a admin */}
            {this.state.userInfo && this.state.userInfo.admin &&
                <div className="float-right">
                  <Button color='green' onClick={(e) => this.showAddMoviePage()}> 
                  {/* to="/muvies/new" */}
                    Add New Movie 
                    
                  </Button>
                
                </div>
            }
            
          
            <Header size='large'>
              All Movies
              
            </Header>
            
            {this.state.allMovies && this.state.allMovies.length === 0 &&
                  <Header size='small'>Data not available , please login as ADMIN to add new Movie</Header>                  
            }
            {this.state.allMovies && this.state.allMovies.length > 0 &&
                <Header size='small'>Choose your favourite genre</Header>
            }
            
            
            {this.state.topGenres && this.state.topGenres.length > 0 && 
              <div> {this.showGenreSearchButtons()}</div>
            }
            
            <Table className="mt-4">
              <thead>
              <tr>
                <th width="20%">Name</th>
                <th width="20%">Director</th>
                <th width="20%">Genre</th>
                <th width="20%">Popularity <Icon color='red' name='heart' /></th>
               
                <th width="20%">
                    <Input
                      icon={<Icon name='search' inverted circular link />}
                      placeholder='Search...'
                      onChange={(e) => {this.searchMoviesByNameAndDirector(e)}}
                    />
                </th>
              </tr>
              </thead>
              <tbody>
              {this.showMoviesGrid()}
              </tbody>
            </Table>
        </Container>
        }

        {/* Add page */}
        {this.state.showAddMoviePage &&
          <Container fluid>
              <MovieAddEditComponent 
                page='add' isEditPage={false} 
                responseCallback={this.handleAddEditCallback}
                backToMoviesCallback={this.backToMoviesPage}
              >
              </MovieAddEditComponent>     
          </Container>
        }

        {/* Edit Page */}
        {this.state.showUpdateMoviePage &&
          <Container fluid>
            <MovieAddEditComponent 
              page='edit' isEditPage={true} 
              movieToEdit={this.state.movieToEdit}
              responseCallback={this.handleAddEditCallback}
              backToMoviesCallback={this.backToMoviesPage}
            >
            </MovieAddEditComponent>   
          </Container>
        }
        
      </div>
    );
  }
}

export default withRouter(MovieComponent);