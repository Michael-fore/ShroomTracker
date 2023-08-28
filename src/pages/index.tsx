import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import GoogleMapReact from "google-map-react";
import { useState } from 'react';
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
                                        className='h-12 w-12'/>]) 
  console.log(markers)
};



export default function Home() {

  const [markers, setMarkers] = useState([])

  const hello = api.example.hello.useQuery({ text: "from tRPC" });


  const defaultProps = {
    center: {
      lat: 40.015,
      lng: -105.2705,
    },
    zoom: 11,
  };

  const Map = (m:any, setM:any ) => {
   
    console.log(markers)
    console.log(defaultProps)
    return (
      <div style={{ height: "50vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onClick={(e,c) => {
            console.log(e,c)
            onClick({lat: e.lat, lng: e.lng, setMarkers, markers})
          }}
        >
          {markers}
        </GoogleMapReact>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Shroom Tracker</title>
        <meta name="description" content="By Michael Watson-Fore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Map markers={markers} setMarkers={setMarkers} />
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
