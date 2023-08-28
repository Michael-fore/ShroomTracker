import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import GoogleMap from 'google-maps-react-markers'
import { useEffect, useMemo, useRef, useState } from 'react';
import { GiMushrooms } from "react-icons/gi";

const onClick = ({
  lat,
  lng,
  setMarkers,
  markers
}: {
  lat: float,
  lng: float,
  setMarkers: React.Dispatch<React.SetStateAction<never[]>>,
  markers: never[]
}) => {
  //create markers
  setMarkers((markers) => [...markers, <GiMushrooms lat={lat} lng={lng} key={markers.length} 
                                        className='h-2 w-2'/>]) 
  console.log(markers)
};


const Map = ({defaultProps,onGoogleApiLoaded,markers}) => {

  return (
    <div style={{ height: "50vh", width: "100%" }}>
      <GoogleMap
        id='map'
        api={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onGoogleApiLoaded={onGoogleApiLoaded}
        
      >
        {markers}
      </GoogleMap>
    </div>
  );
}



export default function Home() {

  const mapRef = useRef(null)
  const [markers, setMarkers] = useState([])
  const [mapReady, setMapReady] = useState(false)

  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map
    setMapReady(true)
    window.google.maps.event.addDomListener(mapRef.current, "click", (e) => {
      console.log(e.latLng.lat(),e.latLng.lng())
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setMarkers((markers) => [...markers, <GiMushrooms lat={lat} lng={lng} key={markers.length} 
        className='h-12 w-12'/>]) 
    })
  }

  const hello = api.example.hello.useQuery({ text: "from tRPC" });


  const defaultProps = {
    center: {
      lat: 40.015,
      lng: -105.2705,
    },
    zoom: 11,
  };
  // https://stackoverflow.com/questions/9356724/google-map-api-zoom-range
  // Zoom level 0 is the most zoomed out zoom level available and each integer step in zoom level halves the X and Y extents of the view and doubles the linear resolution.
  // Google Maps was built on a 256x256 pixel tile system where zoom level 0 was a 256x256 pixel image of the whole earth. A 256x256 tile for zoom level 1 enlarges a 128x128 pixel region from zoom level 0.
  
  
  // meters_per_pixel = 156543.03392 * Math.cos(latLng.lat() * Math.PI / 180) / Math.pow(2, zoom)



  return (
    <>
      <Head>
        <title>Shroom Tracker</title>
        <meta name="description" content="By Michael Watson-Fore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Map defaultProps={defaultProps} onGoogleApiLoaded={onGoogleApiLoaded} markers={markers}/>
        <GiMushrooms className='h-12 w-12'/>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
