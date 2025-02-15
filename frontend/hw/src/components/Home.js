import { useState, useEffect } from "react";
import axios from "axios";
import {Link } from "react-router-dom"
// import "./App.css";
import { button } from 'react-bootstrap';
import react from "react"
import jwt_decode from "jwt-decode";




function Home (){
const [authorState, setauthorState]=useState([]);
const [authorName, setAuthorName] = useState("");
  const [authorAge, setAuthorAge] = useState();
  const [authorNationality, setAuthorNationality] = useState("");
  const [authorImage, setAuthorImage] = useState("");
  const [authorGender, setAuthorGender] = useState("");
  const [NewAuhtor, setNewAuthor] = useState()

  let decodedData ;
  const storedToken = localStorage.getItem("token");
  if (storedToken){
    decodedData = jwt_decode(storedToken, { payload: true });
     console.log(decodedData);
     let expirationDate = decodedData.exp;
      var current_time = Date.now() / 1000;
      if(expirationDate < current_time)
      {
          localStorage.removeItem("token");
      }
   }

    useEffect(()=>{
        axios.get("http://localhost:8080/api/Author/getAll").then((res)=>{
            console.log(res);
            setauthorState(res.data)
        })
    },[NewAuhtor])

    function addAuthor(e){
        e.preventDefault()
        axios.post("http://localhost:8080/api/Author/add",{
        name: authorName,
        age :authorAge,
        nationality:authorNationality,
        image : authorImage,
        gender:authorGender
        })
        .then(
            (response) => {
              console.log("jhg");
              console.log(response);
              setNewAuthor(response);
            },
            (error) => {
              setNewAuthor("response");
              console.log(error);
            }
          );
        
        
        };

    const findByIdAndDelete = (e,id) => {
        e.preventDefault()
        console.log(id)

        axios.delete(`http://localhost:8080/api/Author/Author/${id}`)
        .then((response) => {
        console.log(" deleted: ", response.data)
        setauthorState(response.data);
    })
    // window.location.reload()
   }

   function updateAuthor(id){
    // e.preventDefault()
    axios.put(`http://localhost:8080/api/update/${id}`,{
    name: authorName,
    age :authorAge,
    nationality:authorNationality,
    image : authorImage,
    gender:authorGender
    })
    .then((response) => {
          
          console.log(response);
          setNewAuthor(response);
        });
    };

return(
    <div className="cardStyle">
{authorState.map((element)=>{
    return(
        <div>
       <Link to={`/moreInfo/${element._id}`}> <h2> {element.name }</h2>
        <img className="imgStyle" height="150px" width="200px" src={element.image}/></Link>
        {(function (){
            if(decodedData!= undefined){
                return (
                    <>
                    <button variant="secondary" onClick={(e)=>findByIdAndDelete(e,element._id)}>   Delete</button> 
        <button variant="secondary" onClick={(e)=>updateAuthor(element._id)}> Edite</button>
                    </>
                )
            }
        })()}
        
        </div>
    )
})}



<div className="CardStyle">
    {(function(){
        if(decodedData!=undefined){
            return(
                <>
                      
<input placeholder="Name" onChange={(e) => setAuthorName(e.target.value)}
 id="fname" name="fname"></input>
<input placeholder="age" onChange={(e) => setAuthorAge(e.target.value)}
 name="age"></input>
<input placeholder="nationality" onChange={(e) => setAuthorNationality(e.target.value)}
 id="nationality" name="nationality"></input>
<input placeholder="image" onChange={(e) => setAuthorImage(e.target.value)}
 id="image" name="image"></input>
<input placeholder="gender" onChange={(e) => setAuthorGender(e.target.value)}
 id="gender" name="gender"></input>
<button type="submit" form="form1" value="Submit" onClick={(e)=>{addAuthor(e)}} >Submit</button>

                </>
            )
        }
    })()}

</div>

    </div>
)

}



export default Home 
