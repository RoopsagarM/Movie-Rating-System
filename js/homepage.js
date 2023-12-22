
// loading of movies 

let movies = [];

if(localStorage.getItem("movies")!==null)
{
    let allData=JSON.parse(localStorage.getItem("movies"));
    movies = allData.filter((movie,index)=>{
        return movie.blocked===false;
    })
}
else {
  localStorage.setItem("movies",JSON.stringify(movies));
}


console.log(movies);





// movies card generation functionality 


function displayMovies(arr){

    document.getElementById('all_movies').innerHTML="";

    arr.forEach((movie, index) => {

        let card = document.createElement('div');
        card.classList.add('card');
        
        // to generate the poster 
          let imgContainer = document.createElement('div');
          imgContainer.classList.add('img_container');
            let img = document.createElement('img');
            img.setAttribute('src', movie.posterurl)
          imgContainer.appendChild(img);
      
          let content = document.createElement('div');
          content.classList.add('content')
            let title = document.createElement('h2');
            title.append(movie.title);
            let infoContainer = document.createElement('div');
            infoContainer.classList.add('info_container');
      
              let rating = document.createElement('div');
              rating.classList.add('rating')

              let ratingStars=document.createElement("div");
              ratingStars.classList.add("rating_stars");

            // to generate white stars 
              let whitestars = document.createElement('span');
              whitestars.classList.add('whitestars')
    
              for (let i = 0; i < 5; i++) {
                  let icon = document.createElement('i');
                  icon.classList.add('fa-solid');
                  icon.classList.add('fa-star');
                  whitestars.appendChild(icon);
              }

              ratingStars.appendChild(whitestars);

               // to generate yellow stars 
               let yellowstars = document.createElement('span');
               yellowstars.classList.add('yellowstars')
     
               for (let i = 0; i < 5; i++) {
                   let icon = document.createElement('i');
                   icon.classList.add('fa-solid');
                   icon.classList.add('fa-star');
                   yellowstars.appendChild(icon);
               }

               let h3 = document.createElement('h3');    
                if(movie.ratings.length===0)
                {
                    h3.append('( 0 )');
                    yellowstars.style.width="0px";
                }
                else 
                {
                    let avgrating=avgRating(movie.ratings);
                    h3.append(`( ${avgrating} )`);
                    yellowstars.style.width=avgrating*20+"%";
                }

               
               

                ratingStars.appendChild(yellowstars);

              rating.append(ratingStars, h3);

              let ratinglink=document.createElement("p");
              ratinglink.append("Rate Now");
              ratinglink.onclick=function(){
                  openModal();
                  movieToRate=movie;
              }
            
              let btn = document.createElement('button');
              btn.classList.add('btn');
              btn.append('Details')
            
            infoContainer.append(rating, ratinglink,btn);
              
      
      
          content.append(title, infoContainer);
      
        card.append(imgContainer, content);
      
        document.getElementById('all_movies').appendChild(card);
      });



}


displayMovies(movies);


function avgRating(arr){

    let sum=0;
    arr.forEach((num,index)=>{
        sum+=num;
    })

    return sum/arr.length;
}


let isSubmitting=false;

let movieToRate=null;

let rating=null;

function selectRate(event){

    let selectedRating=event.target.getAttribute("data-num");

    let stars=document.getElementsByClassName('rate_star');

    for(let i=0;i<selectedRating;i++)
    {
        stars[i].style.color="gold";
    }



}


function confirmRating(event){

    if(isSubmitting===true)
    {
        isSubmitting=false;
        clearUp();
    }

    isSubmitting=true;
    rating=event.target.getAttribute("data-num");

    let stars=document.getElementsByClassName('rate_star');

    for(let i=0;i<rating;i++)
    {
        stars[i].style.color="gold";
    }



    

}


function clearUp(){

    if(isSubmitting===false)
    {
        let stars=document.getElementsByClassName('rate_star');

        for(let i=0;i<5;i++)
        {
            stars[i].style.color="#dedede";
        }

    }
    

}


function submitRating(){


    movieToRate.ratings.push(Number(rating));
    localStorage.setItem("movies",JSON.stringify(movies));
    closeModal();
    displayMovies(movies);
    isSubmitting=false;
    clearUp();


}


function openModal()
{
    document.getElementById("modal").style.display="flex";
}


function closeModal()
{
    document.getElementById("modal").style.display="none";
}