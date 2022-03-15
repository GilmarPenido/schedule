import PeopleModel from "../people";

export default interface PeopleTeamModel {
    SAS_EQUIPE_ID: number
    SAS_PESSOAS_ID: number
    SAS_EQUIPE_PESSOAS_TIPO: string
    pessoa: PeopleModel
    WC_FORNECEDOR_COD?: string
    changedColor?: boolean
}