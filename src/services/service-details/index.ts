import { AxiosResponse } from "axios";
import CONSTANTS from "../../constants";
import HttpObjectModel from "../../Models/http";
import ServiceDetailsModel from "../../Models/service-details";
import api from "../api/api";


const PROCESSO = 'WC_PRODUTO';
const ServiceDetailsService= {

    save: async (serviceDetails: ServiceDetailsModel, tipo: string = 'INCLUIR') => {

        let usr = 'admin';
        let psw = 'admin';

        let url = `api/transaction/?processo=${PROCESSO}` +
            `&opcao=${tipo}` +
            `&WC_PRODUTO_DESC=${serviceDetails.WC_PRODUTO_DESC}` +
            `&WC_CLI_PRODUTOS_DET_TEXT=${serviceDetails.WC_CLI_PRODUTOS_DET_TEXT}` +
            `&SAS_SERVICE_DURACAO=${serviceDetails.SAS_SERVICE_DURACAO}` +
            `&idproc=0` +
            `&VALIDA_INI=true` +
            `&bsaved=false` + 
            `&usr=${usr}` +
            `&psw=${psw}`;

        console.log(CONSTANTS.IP + url);

        return api.get(CONSTANTS.IP + url)
            .then((result: AxiosResponse<any>) => {
                console.log(result.data)
            })

    },


    getAll: async (navpage: number = 0, maxreg: number = 1000) => {
        let usr = 'admin';
        let psw = 'admin';

        let url = `api?type=data&processo=${PROCESSO}&filbrw=WC_FAMILIA_PROD_COD=%SERVICE%&navpage=${navpage}&maxreg=${maxreg}&pesqui=&format=json&usr=${usr}&psw=${psw}`;

        return api.get(CONSTANTS.IP + url).then(
                (retorno: AxiosResponse<{ dados: HttpObjectModel<ServiceDetailsModel>}>) => {

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


export default ServiceDetailsService 