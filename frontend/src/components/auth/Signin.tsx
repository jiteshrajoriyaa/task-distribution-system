import { Auth } from "./Auth";

export const Signin = ()=>{

    return (<div className="flex justify-center">
        <div className="grid grid-cols-1 justify-items-center">
            <Auth type = "signin"/>
        </div>
        </div>
    )
}