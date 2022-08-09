import axios from "axios";
import CONSTANTS from "../../constants";


//[endereço]/webpages/v1/callpage.jsp?pageid=[código da página]

//const pageid = 'SAS_CONECTOR_SQL';
const url = "webpages/v1/callpage.jsp?pageid=SAS_CONECTOR_SQL";
const urlAuthorized = "webpages/v1/callpage.jsp?pageid=SCHEDULE_VALID_USER";
const QueryExec = {

    exec: (sql: string) => {        
        return axios.get(CONSTANTS.IP + url + `&sql=${sql}`)
        .then(
            retorno => retorno.data
        )
    },

    authorized: () => {
        return axios.get(CONSTANTS.IP + urlAuthorized)
        .then(
            retorno => retorno.data.trim() === 'Authorized'
        )
    }
}

export default QueryExec;