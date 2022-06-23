import ClientModel from "../../Models/client";
import { v4 as uuidv4 } from 'uuid';
import api from "../api/api";
import CONSTANTS from "../../constants";
import { AxiosResponse } from "axios";
import PropertyModel from "../../Models/property";
import HttpObjectModel from "../../Models/http";

const PROCESS = 'SAS_SCHEDULE_DT_VAL';

const ValidDateSchedule = {

    get: async (navpage: number = 0, maxreg: number = 1000) => {
        let usr = 'admin';
        let psw = 'admin';

        let url = `api?type=data&processo=${PROCESS}&filbrw=null&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        console.log(CONSTANTS.IP + url)
        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<any>}>) => {

                    if(retorno.data && retorno.data.dados && retorno.data.dados.totalreg > 0) {
                        return retorno.data.dados.consulta[0]

                    }

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    },

    

}


export default ValidDateSchedule;