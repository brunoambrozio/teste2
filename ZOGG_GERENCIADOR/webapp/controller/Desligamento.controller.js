jQuery.sap.require("br.com.oggettiva.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("br.com.oggettiva.controller.Desligamento", {

	oControllerApp: null,
	
	/**
	 * 
	 */
	onInit: function() {
		
		oControllerApp = sap.ui.getCore().byId("app").getController();
	},


	openAttachment : function (evt) {
		var selectedItem = evt.getSource().getBindingContext().getObject();  
		window.open(selectedItem.Filecontent);
	},

	handleNavButtonPress : function (evt) {
		this.nav.back("Master");
	},

	onBeforeRendering:function(){

	},
	
    onAfterRendering: function() {
    
    },	
	
	onload : function (evt) {
		
	},
	
	onDisplay: function(evt) {


	},   
	
	handleHistoricoPress : function (evt) {
		var context = evt.getSource().getBindingContext();
		this.nav.to("LineHistorico", context);
	},
	
	handleApprove : function (evt) {
		this.processAnalise(evt, 'A');
	},
	
	handleReprove : function (evt) {
		this.processAnalise(evt, 'R');
	},
	
	processAnalise: function (evt, decisao) {

		var bundle = this.getView().getModel("i18n").getResourceBundle();

		var aux = evt.getSource().getBindingContext().getObject();
		var justificativa = this.getView().byId("ta_justificativa").getValue();
		
		var msgJustificativa;
		var msgSucesso;
		var msgErro = bundle.getText("MsgFalhaGravarReq");
		var msgInformacao = bundle.getText("Informacao");
		
		if (decisao == 'A') {
			msgJustificativa = bundle.getText("MsgJustificativaAprovar");
			msgSucesso = bundle.getText("MsgRequisicaoAprovada");
		} else {
			msgJustificativa = bundle.getText("MsgJustificativaReprovar");
			msgSucesso = bundle.getText("MsgRequisicaoReprovada");
		}
		
		if (justificativa == '') {
			
			sap.m.MessageToast.show(msgJustificativa, {
			    duration: 3000,                  // default
			    width: "15em",                   // default
			    my: "center bottom",             // default
			    at: "center bottom",             // default
			    of: window,                      // default
			    offset: "0 0",                   // default
			    collision: "fit fit"             // default
			});
		
		} else {

			jQuery.sap.require("sap.m.MessageBox");	
			
			var thisAux = this;
			var entity = "/AnaliseReqSet('" + aux.NumRequisicao + "')";			
			
			var oData = {
				NumRequisicao: aux.NumRequisicao,
				Justificativa: justificativa, 
				Decisao: decisao,
				Requisicao: aux.Requisicao,
				TipoReq: aux.TipoReq
			};

			var oModel = new sap.ui.model.odata.ODataModel(oControllerApp.REQUISICOES_ODATA, true);
			oModel.update(entity, oData, {
				
				success: function() { 
					
					sap.m.MessageBox.show(
				    	      msgSucesso, {
					          icon: sap.m.MessageBox.Icon.INFORMATION,
					          title: msgInformacao,
					          actions: [sap.m.MessageBox.Action.OK],
					          onClose: function(oAction) { 
					          		
					          		oControllerApp.invokeODATARequisicoes();
					          		thisAux.handleNavButtonPress(evt);
					          }
						}	
				    );
				}, 
				
				error: function() { 
					sap.m.MessageBox.show(
				    		  msgErro, {
					          icon: sap.m.MessageBox.Icon.INFORMATION,
					          title: msgInformacao,
					          actions: [sap.m.MessageBox.Action.OK]
						}
					);
				} 
			});	
		}
	}
});