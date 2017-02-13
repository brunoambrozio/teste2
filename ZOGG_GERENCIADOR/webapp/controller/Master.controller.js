jQuery.sap.require("br.com.oggettiva.util.Formatter");
jQuery.sap.require("br.com.oggettiva.util.Grouper");

sap.ui.controller("br.com.oggettiva.controller.Master", {
	
	currentRows: 0,
	listInit: false,
	oControllerApp: null,
	 
	/**
	 * 
	 */
	onInit: function() {
		
		this.bus = sap.ui.getCore().getEventBus();
		
		oControllerApp = sap.ui.getCore().byId("app").getController();
		oControllerApp.invokeODATARequisicoes();
	},

	/**
	 * Handle selection of list item in mobile mode
	 */
	handleListItemPress : function (evt) {
		
		var selectedItem = evt.getSource().getBindingContext().getObject();  
		var context = evt.getSource().getBindingContext();
		
		if (selectedItem.Requisicao == '001') {
			this.nav.to("Movimentacoes", context);	
		} else if (selectedItem.Requisicao == '002') {
			this.nav.to("Desligamento", context);
		}
		
	},

	/**
	 * Handle selection of list item in desktop mode
	 */
	handleListSelect : function (evt) {
		
		var selectedItem = evt.getParameter("listItem").getBindingContext().getObject();  
		var context = evt.getParameter("listItem").getBindingContext();
		
		if (selectedItem.Requisicao == '001') {
			this.nav.to("Movimentacoes", context);	
		} else if (selectedItem.Requisicao == '002') {
			this.nav.to("Desligamento", context);
		}
		
	},

	/**
	 * 
	 */	
	handleSearch : function (evt) {
		
		// create model filter
		var filters = [];
		var query = evt.getParameter("query");
		if (query && query.length > 0) {
			var filter = new sap.ui.model.Filter("NumRequisicao", sap.ui.model.FilterOperator.Contains, query);
			filters.push(filter);
		}
		
		// update list binding
		var list = this.getView().byId("list");
		var binding = list.getBinding("items");
		binding.filter(filters);
	},
	
	/**
	 * sap.m.PulltoRefresh : refresh event handler.
	 * Note that the iScroll library is only used in the mobile scenario. We need to work
	 * with the UI5 scroller in desktop mode.
	 */
	refreshData: function(evt) {
		var pullToRefreshControl = evt.getSource();
		var model = this.getView().getModel();
		
		//xxx
		var url = oControllerApp.REQUISICOES_ODATA;
		var oModel = new sap.ui.model.odata.ODataModel(url, true);
		var json = new sap.ui.model.json.JSONModel();	
		oModel.read(oControllerApp.REQUISICOES_GET_EXPAND_ENTITIES, null, null, true, function (oData, response) {

			// dummy delay to simulate network latency
			setTimeout(function(p) {
				json.setData(oData);
				p.hide();
			}, 1000, pullToRefreshControl);
		});
		
		this.getView().setModel(json);
	},
	
	/**
	 * Fired when the sap.m.List is updated via a data change or binding - set scroll pos to previously viewed list item.
	 * In desktop mode we have to calculate the item offset ourselves as we don't have iScroll available.
	 * The UI team are trying to remove iScroll and rely on native scrolling only...
	 *  - from 1.20: if (android&&version<4.1 || blackberry { iScroll is smoother! } || ios&&version<6) { use iScroll } else { yay! }
	 */
	handleUpdateFinished: function(evt) {
		if (evt.getParameter("reason") === "Change") {
			var actualRows = evt.getParameter("actual");

			if (this.listInit && actualRows > this.currentRows) {
				var diff = actualRows - this.currentRows; // - 1;
				var rowsToScroll = diff < 0 ? 0 : diff;

				// Get scroller
				//var scroller = this.byId("idViewRoot--idViewMaster--idPageMaster").getScrollDelegate();
				var scroller = this.byId("idPageMaster").getScrollDelegate();
				if (scroller._scroller) {
					scroller = scroller._scroller; //using iScroll instead of native
					console.log("*** using iscroll ***");
				} else {
					console.log("*** using native scrolling ***");
				}


				if (scroller) {
					setTimeout(function() {
						var listItemSelector = "#__item0-idViewRoot--idViewMaster--list-" + rowsToScroll;
						var offset;

						if (typeof(scroller.scrollToElement) === "function") {
							scroller.scrollToElement(listItemSelector, 400);
						} else {
							offset = $(listItemSelector).position().top;
							scroller.scrollTo(0, offset, 400);
						}

						//sap.m.MessageToast.show("Scroll up to see new items...");
					}.bind(this), 200);
				}
			}
			this.listInit = true;
			this.currentRows = actualRows;
		}
	},	

	handleGroup : function (evt) {

		// compute sorters
		var sorters = [];
		var item = evt.getParameter("selectedItem");
		var key = (item) ? item.getKey() : null;
		if ("RequisicaoTxt" === key || "TipoReqTxt" === key) {
			br.com.oggettiva.util.Grouper.bundle = this.getView().getModel("i18n").getResourceBundle();
			var grouper = br.com.oggettiva.util.Grouper[key];
			sorters.push(new sap.ui.model.Sorter(key, true, grouper));
		}

		// update binding
		var list = this.getView().byId("list");
		var oBinding = list.getBinding("items");
		oBinding.sort(sorters);
	}
});