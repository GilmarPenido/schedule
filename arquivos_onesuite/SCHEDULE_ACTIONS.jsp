<%@ page import="java.util.Date"%>
<%@ page import="java.util.Calendar"%>
<%@ page import="java.text.DateFormat"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.net.*"%>
<%@ page import="java.io.*"%>
<%@ page import="org.json.JSONArray"%>
<%@ page import="org.json.JSONException"%>
<%@ page import="org.json.JSONObject"%>
<%

String[] schedules = request.getParameterValues("schedules[]");
String type = request.getParameter("type");

String groupId = framework.CreateIdProc("SAS_SCHEDULE");

String queryBatchSchedule = "insert into SAS_SCHEDULE (" + 
    "SAS_SCHEDULE_ID,"+
    "WC_CLIENTE_COD,"+
    "SAS_EQUIPE_ID,"+
    "SAS_SCHEDULE_DATA,"+
    "SAS_SCHEDULE_HRINICIO,"+
    "SAS_SCHEDULE_HRFIM,"+
    "SAS_SCHEDULE_OBSERVA,"+
    "SAS_SCHEDULE_STATUS,"+
    "SAS_EQUIPE_INICIAL_ID,"+
    "WC_PRODUTO_COD,"+
    "SAS_PROP_ID,"+
    "SAS_SINALIZADOR,"+
    "WF_OPORTUNI_ID,"+
    "SAS_SCHEDULE_START_DATE,"+
    "SAS_SCHEDULE_END_DATE,"+
    "SAS_SCHEDULE_EVERY,"+
    "SAS_SCHEDULE_FREQUENCY,"+
    "SAS_SCHEDULE_WEEK_DAY," + 
  	"SAS_SCHEDULE_GROUP" +
    ") VALUES";


    JSONObject obj = null;

for ( int i = 0; i < schedules.length; i++) {
    obj = new JSONObject(schedules[i]);
  	//String id = framework.CreateIdProc("SAS_SCHEDULE");
    queryBatchSchedule += " (" +
        "'" + obj.getString("SAS_SCHEDULE_ID") + "'," +
        "'" + obj.getInt("WC_CLIENTE_COD") + "'," +
        "'" + obj.getInt("SAS_EQUIPE_ID") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_DATA") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_HRINICIO") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_HRFIM") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_OBSERVA") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_STATUS") + "'," +
        "'" + obj.getInt("SAS_EQUIPE_INICIAL_ID") + "'," +
        "'" + obj.getInt("WC_PRODUTO_COD") + "'," +
        "'" + obj.getInt("SAS_PROP_ID") + "'," +
        "'" + obj.getString("SAS_SINALIZADOR") + "'," +
        "'" + obj.getString("WF_OPORTUNI_ID") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_START_DATE") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_END_DATE") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_EVERY") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_FREQUENCY") + "'," +
        "'" + obj.getString("SAS_SCHEDULE_WEEK_DAY") + "'," +
      	"'" + groupId + "'" +      
    "),";
}


    queryBatchSchedule = queryBatchSchedule.substring(0, queryBatchSchedule.length() - 1);

    framework.ExecSQL(queryBatchSchedule);

    String procedure = "EXEC [dbo].[inclui_invoice_massa] '"+obj.getInt("WC_CLIENTE_COD")+"', '"+obj.getInt("WC_PRODUTO_COD")+"', '"+obj.getInt("SAS_PROP_ID")+"', '"+obj.getString("SAS_SCHEDULE_START_DATE")+"', '"+obj.getString("SAS_SCHEDULE_END_DATE")+"'";

    framework.ExecSQL(procedure);

%>