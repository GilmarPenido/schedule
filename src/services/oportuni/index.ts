import api from "../api/api";
import CONSTANTS from "../../constants";
import { AxiosResponse } from "axios";
import HttpObjectModel from "../../Models/http";

const PROCESS = 'WF_OPORTUNI';

const OportuniService = {

    getByLead: async (solContId: string, navpage: number = 0, maxreg: number = 1000) => {
        let usr = 'admin';
        let psw = 'admin';

        let url = `api?type=data&processo=${PROCESS}&filbrw=WF_OPORTUNI_ID=(${solContId})&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<any>}>) => {

                    if(retorno.data && retorno.data.dados) {
                        return retorno.data.dados

                    }

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    }

}


export default OportuniService;