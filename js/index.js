// window.onload=function(){
// }
let movies = []; 
if(localStorage.getItem("movies")!==null){
  movies = JSON.parse(localStorage.getItem("movies"));
}
else{
  localStorage.setItem("movies",JSON.stringify(movies));
}

// for(let i = 0; i<movies.length;i++){
//   movies[i].blocked = false;
// }
// localStorage.setItem("movies",JSON.stringify(movies));

let noOfPages = null;
// current page number
currentPage = 1;
document.getElementById("current_page").innerHTML=currentPage;
let start=null;
let end=null;
let paginate = [];

function setUpPagination(){

  // gettinng the no of pages
  noOfPages = Math.ceil(movies.length/10);
  document.getElementById("totalpages").innerText=noOfPages;

  start=(currentPage-1)*10;
  end=currentPage*10  ;

  // preparing the first 10 data
  paginate=movies.slice(start,end);
  generatePageLinks();  

}


function generatePageLinks(){
  document.getElementById("pages").innerHTML="";
  for(let i=1;i<=noOfPages;i++){
    let link=document.createElement("a");
    link.append(i);
    link.onclick=openPage.bind(this,i);
    document.getElementById("pages").appendChild(link);

  }
}

// function to load page from input
function openPage(pageNumber){
  if(pageNumber!=="" && pageNumber>=1 && pageNumber<=noOfPages){
    currentPage = pageNumber;
    start = (currentPage-1)*10;
    end = (currentPage)*10;
    serial = start+1;
    paginate=movies.slice(start,end);
    displayMoviesTable(paginate);
    document.getElementById("current_page").innerHTML=currentPage;
  }
}

// function to load next page
function nextPage(){
  if(currentPage<noOfPages){
    // document.getElementById("movies").innerHTML="";
    currentPage+=1;
    openPage(currentPage);
    
  }
}

// first time call for onload display
setUpPagination();
displayMoviesTable(paginate);


// function to load previous page
function prevPage(){
  if(currentPage>1){
    currentPage-=1;
    openPage(currentPage);
  }
}


// function to display give movie array
function displayMoviesTable(moviesArr)
{
  document.getElementById("movies").innerHTML="";
  // serial no
  let serial = start+1;
  moviesArr.forEach((movie,index)=>{

    let row = document.createElement("tr");

    let number = document.createElement("td");
    number.append(serial);
    serial++;

    let title = document.createElement("td");
    title.append(movie.title);

    let releaseDate = document.createElement("td");
    releaseDate.append(movie.releaseDate);

    let genres = document.createElement("td");
    movie.genres.forEach((genre,index)=>{
      genres.append(genre+" . ");
    })

    let duration = document.createElement("td");
    duration.append(movie.duration);

    let imbd = document.createElement("td");
    imbd.append(movie.imdbRating);

    let actions = document.createElement("td");
    actions.classList.add("actions");

    let view = document.createElement("i");
    view.classList.add("fa-solid");
    view.classList.add("fa-eye");
    actions.appendChild(view);
    view.onclick = openViewModel.bind(this, movie.id);

    let edit = document.createElement("i");
    edit.classList.add("fa-solid");
    edit.classList.add("fa-pen-to-square");
    actions.appendChild(edit);
    edit.onclick=setUpdate.bind(this,movie.id);

    let trash = document.createElement("i");
    trash.classList.add("fa-solid");
    trash.classList.add("fa-trash");
    actions.appendChild(trash);
    trash.onclick=deleteMovie.bind(this,movie.id);

    if(movie.blocked===true){
      let block = document.createElement("p");
      block.classList.add("fa-solid");
      block.classList.add("fa-lock");
      actions.append(block);
    }


    row.append(number);
    row.append(title);
    row.append(releaseDate);
    row.append(genres);
    row.append(duration);
    row.append(imbd);
    row.append(actions);

    document.getElementById("movies").appendChild(row);
  })
}
function openViewModel(movieId){
  let movie = movies.find((movie)=>{
    return movie.id === movieId;
  })
  document.getElementById("title").innerText=movie.title;
  document.getElementById("poster").src=movie.posterurl;
  document.getElementById("genre").innerText=movie.genres;
  document.getElementById("storyline").innerText=movie.storyline;
  document.getElementById("actors").innerText=movie.actors;
  document.getElementById("releasedate").innerText=movie.releaseDate;
  document.getElementById("duration").innerText=movie.duration;
  document.getElementById("imbd").innerText=movie.imdbRating;
  
  document.getElementById("view_modal").style.display="flex";
}

// function to open create model
function openAddModel(){
  document.getElementById('add_model').style.display="flex";
}

// function to add a movie
function createMovie(){
  var lastId;
  if(movies.length!==0){
    lastId = movies[movies.length-1].id;
  }
  else{
    lastId = 0;
  }
  let movie={
    ratings:[],
    id:lastId+1,
    blocked: false,
  }
  movie.title = document.getElementById("add_title").value;
  movie.genres = document.getElementById("add_genres").value.split(",");
  movie.duration = document.getElementById("add_duration").value;
  movie.releaseDate = document.getElementById("add_releasedate").value;
  movie.actors = document.getElementById("add_actors").value.split(",");
  movie.imdbRating = document.getElementById("add_imbd").value;
  movie.posterurl = document.getElementById("add_posterurl").value;
  movie.storyline = document.getElementById("add_storyline").value;
  
  movies.push(movie);
  alert("Movie Added")
  
  localStorage.setItem("movies",JSON.stringify(movies));
  
  displayMoviesTable(paginate);
  setUpPagination();
  closeModel("add_model");
  
  // document.getElementById("add_form").reset();
  document.getElementById("add_releasedate").type="text";
}
// function to setup data for update
let dataToUpdate=null;

function  setUpdate(id){


  let movie= movies.find((movie,index)=>{
    return movie.id==id;
  })
  
  dataToUpdate=movie;
  
  document.getElementById("update_title").value = movie.title;
  document.getElementById("update_genres").value = convertToCommaString(movie.genres);
  document.getElementById("update_duration").value = movie.duration;
  document.getElementById("update_releasedate").value = movie.releaseDate;
  document.getElementById("update_actors").value = convertToCommaString(movie.actors);
  document.getElementById("update_imbd").value = movie.imdbRating;
  document.getElementById("update_posterurl").value = movie.posterurl;
  document.getElementById("update_storyline").value = movie.storyline;
  
  if(dataToUpdate.blocked===true){
    document.getElementById("update_blocked").checked=true;
  }
  else{
    document.getElementById("update_blocked").checked=false;
  }

  document.getElementById("update_model").style.display="flex";
}


function convertToCommaString(data){
  let stringData="";
  data.forEach((d,index)=>{
    stringData+=d+",";
  })
  return stringData.substring(0,stringData.length-1);
}

function deleteMovie(id){
  let confirmationDelete = confirm("Are you Sure.. You want to delete ? ")
  if(confirmationDelete===true){
    let index=movies.findIndex((movie,index)=>{
      return movie.id===id;
    })
       
    movies.splice(index,1);
    localStorage.setItem("movies",JSON.stringify(movies));
    
    setUpPagination();

    displayMoviesTable(paginate);
  }
}

// function to close any model
function closeModel(model_id,target_id=false){
  if(target_id===model_id || target_id ===true)
  {
    document.getElementById(model_id).style.display="none";
  }
}
// function to convert text to date
function convertToDate(){
  document.getElementById("add_releasedate").type="date";
}

// to delete movies array 
// localStorage.removeItem("movies")

// function to add a movie
function updateMovie(){
  
  dataToUpdate.title = document.getElementById("update_title").value;
  dataToUpdate.genres = document.getElementById("update_genres").value.split(",");
  dataToUpdate.duration = document.getElementById("update_duration").value;
  dataToUpdate.releaseDate = document.getElementById("update_releasedate").value;
  dataToUpdate.actors = document.getElementById("update_actors").value.split(",");
  dataToUpdate.imdbRating = document.getElementById("update_imbd").value;
  dataToUpdate.posterurl = document.getElementById("update_posterurl").value;
  dataToUpdate.storyline = document.getElementById("update_storyline").value;
  // dataToUpdate.blocked = document.getElementById("update_blocked").value;

  if(document.getElementById("update_blocked").checked==true){
    dataToUpdate.blocked=true;
  }
  else{
    dataToUpdate.blocked=false;
  }
  
  console.log(movies);
  
// movies.push(movie);
  localStorage.setItem("movies",JSON.stringify(movies));
  displayMoviesTable(paginate);
  closeModel("update_model",true);
}






