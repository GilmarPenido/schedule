
import PeopleTeamModel from "../people-team";

export default interface TeamModel {
    SAS_EQUIPE_ID: number
    SAS_EQUIPE_DESCRI: string
    SAS_EQUIPE_COR: string
    equipePessoas: PeopleTeamModel[]
}