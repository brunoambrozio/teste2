sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("br.com.oggettiva.controller.App", {
		
		REQUISICOES_ODATA: 'http://177.21.159.195:8000/sap/opu/odata/SAP/ZOGG_REQUISICOES_SRV_01',
		REQUISICOES_GET_EXPAND_ENTITIES: '/RequisicoesSet?$expand=FluxoSet,HistoricoSet,MovColabAtual,MovColabProp,DesligamentoSet',
		
		/** 
		 * Navigates to another page
		 * @param {string} pageId The id of the next page
		 * @param {sap.ui.model.Context} context The data context to be applied to the next page (optional)
		 */
		to : function (pageId, context) {
			
			var app = this.getView().app;
			
			// load page on demand
			var master = ("Master" === pageId);
			if (app.getPage(pageId, master) === null) {
				var page = sap.ui.view({
					id : pageId,
					viewName : "br.com.oggettiva.view." + pageId,
					type : "XML"
				});
				page.getController().nav = this;
				app.addPage(page, master);
				jQuery.sap.log.info("app controller > loaded page: " + pageId);
			}
			
			// show the page
			app.to(pageId);
			
			// set data context on the page
			if (context) {
				
				//Redireciona para a tela de movimentaçÕes
				var page = app.getPage(pageId);
				page.setBindingContext(context);
				
				this.setVisibility(page, context);
			}
		},

		/**
		 * Seta a visibilidade da view
		 */		
		setVisibility : function (page, context) {
			
			var visibilityFieldsMovModel;
			
			//Movimentação
			if (context.getObject().Requisicao == '001') {
				
				//Promoção
				if (context.getObject().TipoReq == '001' ) {
					
					visibilityFieldsMovModel = new sap.ui.model.json.JSONModel({
						SalarioAtual : true,
						FaixaMinima: true,
						FaixaReferencia: true,
						FaixaMaxima: true,
						SalarioProposto: true,
						NumeroParcelas: true,
						PorcReajuste: true,
						ReajusteTotal: true,
					});
				
				//Transferencia
				} else 	if (context.getObject().TipoReq == '006' ) {

					visibilityFieldsMovModel = new sap.ui.model.json.JSONModel({
						SalarioAtual : false,
						FaixaMinima: false,
						FaixaReferencia: false,
						FaixaMaxima: false,
						SalarioProposto: false,
						NumeroParcelas: false,
						PorcReajuste: false,
						ReajusteTotal: false,
					});
				
				//Reajuste salarial
				} else 	if (context.getObject().TipoReq == '008' ) {

					visibilityFieldsMovModel = new sap.ui.model.json.JSONModel({
						SalarioAtual : false,
						FaixaMinima: false,
						FaixaReferencia: false,
						FaixaMaxima: false,
						SalarioProposto: false,
						NumeroParcelas: false,
						PorcReajuste: false,
						ReajusteTotal: false,
					});
					
				}
				
			}
			
			if (visibilityFieldsMovModel != null) {
				visibilityFieldsMovModel.setDefaultBindingMode("OneWay");
				page.setModel(visibilityFieldsMovModel, "visibilityFieldsMov");
			}
		},
		
		/**
		 * Navigates back to a previous page
		 * @param {string} pageId The id of the next page
		 */
		back : function (pageId) {
			this.getView().app.backToPage(pageId);
		},
		
		/**
		 * Invoca o ODATA de requisições
		 **/
		invokeODATARequisicoes: function() {
			
			var oModel = new sap.ui.model.odata.ODataModel(this.REQUISICOES_ODATA, true);
			var json = new sap.ui.model.json.JSONModel();	
			oModel.read(this.REQUISICOES_GET_EXPAND_ENTITIES, null, null, true, function (oData, response) {
				json.setData(oData);
			});
			
			this.getView().setModel(json);
		}		

	});

});