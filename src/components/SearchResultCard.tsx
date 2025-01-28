"use client";

function SearchResultCard(props) {
  // console.log(props, "line 2")

  const { id, name, age, breed, city, gender, photo } = props;

  return (
    <div data-petid={id} className="border">
      <img src={photo ? photo : "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt=""/>
      
      <div className="text-container">
        <h2>{name}</h2>
        <p>{age} {gender}</p>
        <p>{breed}</p>
        <p>{city}</p>
      </div>
      

    </div>
  );
}

export default SearchResultCard;
