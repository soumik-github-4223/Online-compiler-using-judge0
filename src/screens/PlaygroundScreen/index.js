import { useParams } from "react-router-dom"

export const PlaygroundScreen=()=>{
    const params=useParams();
    console.log(params);
    return <h1 className="child">Playy</h1>
}