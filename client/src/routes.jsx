import App from "./App";
import Game from "./components/generalComponents/Game";
import Error from "./components/generalComponents/Error";

const routes =[
    {
        path:"/",
        element:<App/>,
        errorElement: <Error/>
    },
    {
        path:"/gameboard/:id",
        element: <Game/>
    },
]

export default routes