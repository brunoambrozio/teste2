sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("br.com.oggettiva.controller.LineHistorico", {

		handleNavBack : function (evt) { 
			this.nav.back("Movimentacoes");
		}

	});

});