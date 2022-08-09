import { AxiosResponse } from "axios";
import CONSTANTS from "../../constants";
import HttpObjectModel from "../../Models/http";
import PeopleModel from "../../Models/people";
import api from "../api/api";

const PROCESSO = 'WC_FORNECEDOR';
const PeopleService = {

    getAll: async (navpage: number = 0, maxreg: number = 1000) => {
        let usr = CONSTANTS.USR;
        let psw = CONSTANTS.PSW;

        let url = `api?type=data&processo=${PROCESSO}&filbrw=null&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<PeopleModel>}>) => {

                    if(retorno.data && retorno.data.dados) {
                        return retorno.data.dados.consulta

                    }

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    }


}


export default PeopleService;