import React, { useState } from 'react'
import axios from 'axios'

const Studentmycourses = () => {
    const [data,setdata] = useState([])
    const fetchdata = async()=>{
        try{
        const response = await axios.get("http://localhost:5000/student/mycourses",{
        withCredentials: true,
      });
        setdata(...data,newdata)
        }catch(error){
            console.log(error)
        }
    }
  return (
    <div>
        {data[0].title}
        <button onClick={fetchdata}>Fteh</button>
    </div>
    
  )
}

export default Studentmycourses