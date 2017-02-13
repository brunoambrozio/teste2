jQuery.sap.declare("br.com.oggettiva.Component");

sap.ui.core.UIComponent.extend("br.com.oggettiva.Component", {

	onInit: function() {


	},

	createContent : function() {

		// create root view
		var oView = sap.ui.view({
			id : "app",
			viewName : "br.com.oggettiva.view.App",
			type : "JS",
			viewData : { component : this }
		});

		// set i18n model
		var locale = sap.ui.getCore().getConfiguration().getLanguage();
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/i18n.properties",
			locale: locale
		});
		
		oView.setModel(i18nModel, "i18n");

		//Invoca o ODATA de requisições
		/*var url1 = "http://192.168.100.163:8081/DemoService2/DemoService.svc"; 
		var oModel = new sap.ui.model.odata.ODataModel(url1, true);
		var json = new sap.ui.model.json.JSONModel();	
		oModel.read("/Products", null, null, true, function (oData, response) {
			json.setData(oData);
		});*/

		/*var oModel = new sap.ui.model.odata.ODataModel("http://localhost:8081/ZOGG_ESO_CENSO/ZOGG_ESO_CENSO_LOGIN_SRV.svc", true);
		oModel.read("/ZOGT_ESO_LOGINSet(Pernr='123')",
          null,
          null,
          false,
          function(oData, oResponse){

          var oODataJSONModel =  new sap.ui.model.json.JSONModel();
           
          // set the odata JSON as data of JSON model
          oODataJSONModel.setData(oData);
         
          }          
         );*/

		
		//Invoca o ODATA de requisições
		//this.invokeRequisicoesODATA(oView);
		/*var url = "http://177.21.159.195:8000/sap/opu/odata/SAP/ZOGG_REQUISICOES_SRV_01"; 
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		var json = new sap.ui.model.json.JSONModel();	
		oModel.read("/RequisicoesSet?$expand=FluxoSet,HistoricoSet,MovColabAtual,MovColabProp", null, null, true, function (oData, response) {
			json.setData(oData);
		});
		
		oView.setModel(json);*/
		
		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isPhone : jQuery.device.is.phone,
			listMode : (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
			listItemType : (jQuery.device.is.phone) ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		oView.setModel(deviceModel, "device");

		// done
		return oView;
	}
	

});