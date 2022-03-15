import axios from "axios";
import CONSTANTS from "../../constants";


//[endereço]/webpages/v1/callpage.jsp?pageid=[código da página]

//const pageid = 'SAS_CONECTOR_SQL';
const url = "webpages/v1/callpage.jsp?pageid=SAS_CONECTOR_SQL"
const QueryExec = {

    exec: (sql: string) => {        
        return axios.get(CONSTANTS.IP + url + `&sql=${sql}`)
        .then(
            retorno => retorno.data
        )
    }
}

export default QueryExec;