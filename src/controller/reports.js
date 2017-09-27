var squel = require('squel');
var db = require('../core/db');
var httpMsg = require('../core/httpMsg');
var helper = require('../core/helper');
var settings = require('../settings');
var util = require('util');

exports.getShipments = function(req, resp, period) {
  try {

    if (!period) throw new Error("Input not valid");

    var sql = squel.select()
        .from("CTI_API_REPORT_SHIPMENTS")
        .field("PRD AS Period")
        .field("CAST(RIGHT(PRD,2) AS INT) AS Month")
        .field("FirstFlightDate")
        .field("DocChargeWeight")
        .field("DestCode")
        .field("ShipmentType")
        .field("FirstbyAirlineID")
        .where("LEFT(PRD,4) = ?", period)
        .toString();

    helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);

  }catch(err) {

  }

}

exports.getAirline = function(req, resp, period) {
  try {

    if (!period) throw new Error("Input not valid");

    var sql = squel.select()
      .from("CTI_API_REPORT_SHIPMENTS")
      .field("FirstbyAirlineID")
      .where("LEFT(PRD,4) = ?", period)
      .group("FirstbyAirlineID")
      .toString();

    helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);

  }catch(err){}
}

exports.getPivotAirline = function(req, resp, period) {
  try{

    if (!period) throw new Error("Input not valid");

    var sql = `WITH TBLGROUP AS (
    	SELECT CAST(RIGHT(PRD,2) AS INT) AS THEMONTH, FirstbyAirlineID, TOTAL FROM(
    	SELECT PRD, FirstbyAirlineID,SUM(DocChargeWeight) AS TOTAL FROM CTI_API_REPORT_SHIPMENTS
      WHERE LEFT(PRD,4)='%s' GROUP BY PRD, FirstbyAirlineID)M),
      TBLPRIVOT AS (
    	SELECT * FROM TBLGROUP
    	PIVOT (SUM(TOTAL) FOR THEMONTH IN ([1],[2],[3],[4], [5], [6],[7],[8],[9],[10],[11],[12])) AS THEPIVOT)

      SELECT * FROM (
      SELECT *, (JAN + FEB + MAR + APR + MAY + JUN + JUL + AUG + SEP + OCT + NOV + [DEC]) AS TOTAL FROM (
      SELECT FirstbyAirlineID AS AirlineCode,
      ISNULL((SELECT TOP 1 AirlineName FROM RCAL1 R WHERE R.AirlineID=TBLPRIVOT.FirstbyAirlineID),'') AS AirlineName,
      (ISNULL([1],0)/1000) AS JAN,
      (ISNULL([2],0)/1000) AS FEB,
      (ISNULL([3],0)/1000) AS MAR,
      (ISNULL([4],0)/1000) AS APR,
      (ISNULL([5],0)/1000) AS MAY,
      (ISNULL([6],0)/1000) AS JUN,
      (ISNULL([7],0)/1000) AS JUL,
      (ISNULL([8],0)/1000) AS AUG,
      (ISNULL([9],0)/1000) AS SEP,
      (ISNULL([10],0)/1000) AS OCT,
      (ISNULL([11],0)/1000) AS NOV,
      (ISNULL([12],0)/1000) AS [DEC] FROM TBLPRIVOT
      WHERE FirstbyAirlineID IN (
      	SELECT TOP 10 FirstbyAirlineID FROM(
      	SELECT FirstbyAirlineID, SUM(DocChargeWeight) AS TOTAL FROM CTI_API_REPORT_SHIPMENTS
      	WHERE LEFT(PRD,4)='%s'
      	GROUP BY FirstbyAirlineID)T ORDER BY TOTAL DESC
      ))N)M ORDER BY M.TOTAL DESC`

      sql = util.format(sql, period, period);
      console.log(sql);
      helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);

  }catch(err){
    console.log(err);
  }
}
