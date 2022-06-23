import { AxiosResponse } from "axios";
import CONSTANTS from "../../constants";
import HttpObjectModel from "../../Models/http";
import ChangeTeamModel from "../../Models/change-team";


import api from "../api/api";

const PROCESSO = 'SAS_CHANGE_TEAM';
const ChangeTeamService = {

    getAll: async (date = new Date(), teamId: number = 0, navpage: number = 0, maxreg: number = 1000) => {
        let usr = 'admin';
        let psw = 'admin';

        let dateWeek =  new Date(date.getTime());


        let formatedDate = `${dateWeek.getFullYear()}${("00" + (dateWeek.getMonth() + 1)).slice(-2)}${("00" + dateWeek.getDate()).slice(-2)}`;
        let expressionOfRange = `(${formatedDate}) between SAS_TROCA_EQUIPE_DTINI and SAS_TROCA_EQUIPE_DTFI or`;
        

        for (let i = 0; i < 5; i++) {
            dateWeek.setDate(dateWeek.getDate() + 1);
            let formatedDate = `${dateWeek.getFullYear()}${("00" + (dateWeek.getMonth() + 1)).slice(-2)}${("00" + dateWeek.getDate()).slice(-2)}`;
            expressionOfRange += `(${formatedDate}) between SAS_TROCA_EQUIPE_DTINI and SAS_TROCA_EQUIPE_DTFI or`;
        }
        
        expressionOfRange = expressionOfRange.substring(0, expressionOfRange.length - 3);

        if ( teamId ) {
            expressionOfRange += ` and SAS_EQUIPE_ID = ${teamId}`;
        }


        let url = `api?type=data&processo=${PROCESSO}&filbrw=${expressionOfRange}&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<ChangeTeamModel>}>) => {

                    if(retorno.data.dados.totalreg === 0) return [];

                    if(retorno.data && retorno.data.dados) {
                        return retorno.data.dados.consulta

                    }
                    

                    throw new Error("erro ao buscar dados");

                }
            ).catch( (err: any) => {

                throw new Error(err)
            })
    },
}


export default ChangeTeamService;