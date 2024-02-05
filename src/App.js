import { useEffect, useState } from "react";
import StarRating from "./Star_rating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY ="fe87fad2"
export default function App() {
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const[isloading,setIsloading]=useState(false)
    const [query, setQuery] = useState("");
    const [error,setError]=useState('')
    const [selected,setSelected]=useState(null)
    


    
    // useEffect(function(){
    // console.log('sfter the initial render')
    // })
       
    // useEffect(function(){
    //   console.log('After every render')
      
    // })
    // console.log('During the render')
    function handleSelected(id){
      setSelected(selecledId=>(id===selecledId?null:id));
      
    }
    function handleClose(){
      setSelected(null)
    }

    function handleAddWatched(movie){
      setWatched(watched=>[...watched,movie])
    }

    function handledelete(id){
      setWatched(watched=>watched.filter((movie)=>movie.imdbID !==id))
     }

    useEffect(function(){

     const controller =new AbortController();

    async function fetchMovie_data(){
     
      try{setIsloading(true)
        setError('')
        const res=await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,{signal:controller.signal})
        

        if(!res.ok)throw new Error("Somthing went worng ! data hasnot fetched")
        
        const data= await res.json();
        if(data.Response==='False') throw new Error('Movie not found')
         setMovies(data.Search);
        setError('')
     }
      catch(err){
        console.error(err.message)
        if(err.message!=="AbortError")setError(err.message)
       
         
      } finally{

        setIsloading(false)
        // 
      }
      }
      if(query.length<3){
        setMovies([])
        setError('')
      }
      handleClose();
      fetchMovie_data(); 
      return function (){
        controller.abort();
      }
    },[query])
    
    
    
    return (
      <>
      {/* Component composition by pasing element  */}
      <Navbar query={query} onsetQuery={setQuery}element={<ResultsMassage movies={movies}/>} />
       
      <Main>
        {/* Component composition by using children props */}
        <Box>
          {isloading && <Loader/>}
          {!isloading&& !error&& <SinglelistForeach onhandleClose={handleClose} onhandleSlected={handleSelected} movies={movies}/>}
          {error&&<ErrorMessage message={error}/>}

         {/*
         {isloading? <Loader/>:}
          */}
        </Box>
        <Box>

        {selected?<MovieDetails
        onhandleClose={handleClose} 
        selected={selected}
        onAddWatched={handleAddWatched}
        watched={watched}

        />:
        <>  
        <WatchedSummery  watched={watched}/>
        <WatchMovieList selected={selected} onHandledelete={handledelete} watched={watched}/>
        </>}
       
         
        </Box>
      </Main>
      </>
    );
  }
  function ErrorMessage({message}){
return<p className="error"><span>⚠️</span>{message}</p>
  }
  function Search({query,onsetQuery}){
  
      return <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) =>onsetQuery(e.target.value)}
    />
    
    }
  function Loader(){
    return<p className="loader">Loading...</p>
  }
  function Logo(){
    return<div className="logo">
    <span role="img">🎬</span>
    <h1>moviews</h1>
  </div>
  }


  function ResultsMassage({movies,queries}){

  return <p className="num-results">
  Found <strong>{}</strong> results
</p>
  }

  function Navbar({element,query,onsetQuery}){
  return <nav className="nav-bar">
  {/* <Logo/>
  <Search />
  <ResultsMassage movies={movies}/>  */}
    <Logo/>
    <Search query={query} onsetQuery={onsetQuery}/>
    {element}
  </nav>
  }

  function SinglelistForeach({movies,onhandleSlected}){
   
    return<ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} onhandleSlected={onhandleSlected} key={movie.imdbID}/>
  
    ))}
  </ul>
  }

  function Movie({movie,onhandleSlected}){
    return<li  onClick={()=>onhandleSlected(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
  }


  function Box({children}){

    const [isOpen, setIsOpen] = useState(true);
    
    
    return <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    
    {/* children used for Component composition */}
    {isOpen && (children
    )}
  
  </div>
  }
  
  function WatchedSummery({watched}){
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));
    
    return<div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{(avgImdbRating).toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{(avgUserRating).toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{Math.round(avgRuntime)} min</span>
      </p>
    </div>
  </div>
  }


function MovieDetails({watched,selected,onhandleClose,onAddWatched}){
const[movie,setMovie]=useState({});
const [isloading,setLoading]=useState(false) ;
const [userRating,setUserRating]=useState('')


const isWatched=watched.map(movie=>(movie.imdbID)).includes(selected)

const watchedMovieRating=watched.find(movie=>movie.imdbID===selected)?.userRating


  const {Title:title,Year:year,Poster:poster,Runtime:runtime,Actors:actors,
  Director:director,
  Plot:plot,Genre:genre,imdbRating}=movie;
  
 
  
  function AddtoListHandler(movie){
   
    const newWatchedMovie={
      imdbID:selected,
      title,
      year,
      poster,
      userRating,
      imdbRating:Number(imdbRating),
      runtime:Number(runtime.split(' ').at(0)),

    }
   
      onAddWatched(newWatchedMovie)
    onhandleClose()
    
  }
  
  useEffect(function(){
    function callback(e){
      
        if(e.code==='Escape'){
          onhandleClose()
        }
      }
    
    document.addEventListener('keydown',callback
    )

    return function(){
      document.removeEventListener('keydown',callback)
    }
   },[onhandleClose])


  useEffect(function(){
    
    async function getmovieDetails(){
       setLoading(true)
       const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selected}`)
       const data= await res.json()
       setMovie(data)
       setLoading(false)

    }
    getmovieDetails() 
  },[selected])

  useEffect(function(){
    if(!title)return
      document.title=`Movie | ${title}`;

      return function(){
        document.title='moviews'
      }
  },[title])

  return<div className="details">
    {isloading?<Loader/>:<>
    <header>
    <button className="btn-back" onClick={onhandleClose} >&larr;</button>
    <img src={poster} alt={title} />
   
    <div className="details-overview">
      <h2>{title}</h2>
      <p>
        {runtime}&bull
      </p> 
      <p>
        {genre}
      </p>
      <p><span>⭐</span>{imdbRating}Imdb Rating</p>
      
    </div>
    </header>
    <section>
     {! isWatched?<><StarRating maxrating={10} size="30" onSetUserRating={setUserRating}/>
      {userRating>0 
      && <>
      <button className="btn-add" onClick={AddtoListHandler}>Add to WatchMovieList</button>
      
      </>
      }
      </>
      
    : <p>You rated with movie ⭐{watchedMovieRating}</p>
    }
      
      <p>
        <em>{plot}</em>
      </p> 
      <p>Starring{actors}</p>
      <p>Directed by {director}</p>
    </section>
    </>
    }
  </div>
   

}

function WatchMovieList({watched,onHandledelete,selected}){

 
return  <ul className="list">
{watched.map((movie) => (
  <li key={movie.imdbID}>
    <img src={movie.poster} alt={`${movie.title} poster`} />
    <h3>{movie.title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
    </div>
    <button className="btn-delete" onClick={()=>onHandledelete(movie.imdbID)}>X</button>
  </li> 
))}
</ul>
}

function Main({children}){
 
  return<main className="main">       
       {children}       
       </main>
}
