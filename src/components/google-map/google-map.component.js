import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';

export default function GoogleMap() {

    const history = useHistory();
    useEffect(() => {
        const googleMapsScript = document.getElementById('google-maps-script');
        if(!googleMapsScript){
            const script1 = document.createElement('script');
            script1.src = "./initMap.js";
            document.body.appendChild(script1);

            script1.onload = () => {
                const script2 = document.createElement('script');
                script2.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&callback=initMap&libraries=places&v=weekly`;
                //script2.async = 'async';
                //script2.defer = 'defer';
                script2.id = 'google-maps-script';
                document.body.appendChild(script2);
            }
        }else{
            //WHEN MAP IS ALREADY LOADED IT WONT SHOW UNTIL REFRESH ???
            history.go(0);
        }
    // eslint-disable-next-line    
    }, []);
    return (
    <div style={{height:'100vh', width:'100vw'}} id="map-container">
    </div>);
};