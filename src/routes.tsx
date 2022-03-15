
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Schedule from "./pages/Schedule";

export default function Routes() {

    return(
        
        <BrowserRouter>
            <Switch>
                <Route component={Schedule} path="/"/>
                {/*<Route component={Client} path="/greatjobpro_ccli_uix/" exact/>
                <Route component={Client} path="/greatjobpro_modulo_uix/" exact/>
                <Route component={Services} path="/greatjobpro_modulo_uix/service"/>
                <Route component={Property} path="/greatjobpro_modulo_uix/property"/>
                <Route component={PageNotFound} path="/404" />
                <Redirect to="/404" /> */}
            </Switch>
        </BrowserRouter>


    ) 

}