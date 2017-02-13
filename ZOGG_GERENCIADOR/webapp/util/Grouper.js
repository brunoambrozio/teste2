jQuery.sap.declare("br.com.oggettiva.util.Grouper");

br.com.oggettiva.util.Grouper = {

	bundle : null, // somebody has to set this

	RequisicaoTxt : function (oContext) {
		var requisicaoTxt = oContext.getProperty("RequisicaoTxt");
		var text = br.com.oggettiva.util.Grouper.bundle.getText("Req: " + requisicaoTxt, "?");
		return {
			key: requisicaoTxt,
			text: text
		};
	},

	TipoReqTxt : function (oContext) {
		var requisicaoTxt = oContext.getProperty("TipoReqTxt");
		var text = br.com.oggettiva.util.Grouper.bundle.getText("Tipo req: " + requisicaoTxt, "?");
		return {
			key: requisicaoTxt,
			text: text
		};
	},

	GrossAmount : function (oContext) {
		var price = oContext.getProperty("GrossAmount");
		var currency = oContext.getProperty("CurrencyCode");
		var key = null,
			text = null;
		if (price <= 5000) {
			key = "LE10";
			text = "< 5000 " + currency;
		} else if (price > 5000 && price <= 10000) {
			key = "LE100";
			text = "< 10.000  " + currency;
		} else if (price > 10000) {
			key = "GT100";
			text = "> 10.000 " + currency;
		}
		return {
			key: key,
			text: text
		};
	}
};