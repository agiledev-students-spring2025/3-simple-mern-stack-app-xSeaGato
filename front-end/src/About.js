import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import './loading.gif';


const About = () => {
  const [abtDt, setDt] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    fetch('http://localhost:5002/aboutme')
      .then((res) => {
        if (res.ok === false) {
          throw new Error('HTTP error!');
        }
        return res.json();
      })
      .then((data) => {
        setDt(data);
      })
      .catch((error) => {
        console.error(error);

      });
  }, []);


  if (err) {
    return <p>Error</p>;
  }

  if (!abtDt) {
    return <img src="/loading.gif"/>;
  }

  return (
    <div >
      <h1>About Me</h1>
      <img src={abtDt.image} className='image'/>
      <div className='textSize'>
        <p>{abtDt.description}</p>
        <br></br>
        <p>{abtDt.hobbies[0].description}</p>
        <br></br>
        <p>{abtDt.hobbies[1].description}</p>
       
      </div>

    </div>
  );
};

export default About;
