(function() {

"use strict";

var prepare_dom = function() {
	prepare_dom_box.call(this,"white");
	prepare_dom_box.call(this,"black");
	this.element.appendChild(this.white.box);
	this.element.appendChild(this.black.box);
}

var prepare_dom_box = function(type) {
	this[type] = {};
	var t = this[type];
	t.box = document.createElement("div");
	t.box.className = "wgo-box-wrapper wgo-player-wrapper wgo-"+type;

	t.name = document.createElement("div");
	t.name.className = "wgo-box-title";
	t.name.innerHTML = type;
	t.box.appendChild(t.name);
	
	var info_wrapper;
	info_wrapper = document.createElement("div");
	info_wrapper.className = "wgo-player-info";
	t.box.appendChild(info_wrapper);
	
	t.info = {};
	t.info.caps = prepare_dom_info("Jeńców");
	t.info.caps.val.innerHTML = "0";
	info_wrapper.appendChild(t.info.caps.wrapper);
}

var prepare_dom_info = function(type) {
	var res = {};
	res.wrapper = document.createElement("div");
	res.wrapper.className = "wgo-player-info-box-wrapper";
	
	res.box = document.createElement("div");
	res.box.className = "wgo-player-info-box";
	res.wrapper.appendChild(res.box);
	
	res.title = document.createElement("div");
	res.title.className = "wgo-player-info-title";
	res.title.innerHTML = WGo.t(type);
	res.box.appendChild(res.title);
	
	res.val = document.createElement("div");
	res.val.className = "wgo-player-info-value";
	res.box.appendChild(res.val);
	
	return res;
}

var kifu_loaded = function(e) {
	var info = e.kifu.info || {};
	
	if(info.black) {
		this.black.name.innerHTML = WGo.filterHTML(info.black.name) || WGo.t("black");
	}
	else {
		this.black.name.innerHTML = WGo.t("black");
	}
	if(info.white) {
		this.white.name.innerHTML = WGo.filterHTML(info.white.name) || WGo.t("white");
	}
	else {
		this.white.name.innerHTML = WGo.t("white");
	}
	
	this.black.info.caps.val.innerHTML = "0";
	this.white.info.caps.val.innerHTML = "0";
	
	this.updateDimensions();
}

var modify_font_size = function(elem) {
	var css, max, size;
	
	if(elem.style.fontSize) {
		var size = parseInt(elem.style.fontSize);
		elem.style.fontSize = "";
		css = window.getComputedStyle(elem);
		max = parseInt(css.fontSize);
		elem.style.fontSize = size+"px";
	}
	else {	
		css = window.getComputedStyle(elem);
		max = size = parseInt(css.fontSize);
	}
	
	if(size == max && elem.scrollHeight <= elem.offsetHeight) return;
	else if(elem.scrollHeight > elem.offsetHeight) {
		size -= 2;
		while(elem.scrollHeight > elem.offsetHeight && size > 1) {
			elem.style.fontSize = size+"px";
			size -= 2;
		}
	}
	else if(size < max) {
		size += 2;
		while(elem.scrollHeight <= elem.offsetHeight && size <= max) {
			elem.style.fontSize = size+"px";
			size += 2;
		}
		if(elem.scrollHeight > elem.offsetHeight) {
			elem.style.fontSize = (size-4)+"px";
		}
	}
}

var update = function(e) {
	if(e.position.capCount.black !== undefined) this.black.info.caps.val.innerHTML = e.position.capCount.black;
	if(e.position.capCount.white !== undefined) this.white.info.caps.val.innerHTML = e.position.capCount.white;
}

/**
 * Implements box with basic informations about go players.
 */

var InfoBox = WGo.extendClass(WGo.BasicPlayer.component.Component, function(player) {
	this.super(player);
	this.element.className = "wgo-infobox";
	
	prepare_dom.call(this);

	player.addEventListener("kifuLoaded", kifu_loaded.bind(this));
	player.addEventListener("update", update.bind(this));

});

InfoBox.prototype.updateDimensions = function() {
	modify_font_size(this.black.name);
	modify_font_size(this.white.name);
};

var bp_layouts = WGo.BasicPlayer.layouts;
bp_layouts["right_top"].right.push("InfoBox");
bp_layouts["right"].right.push("InfoBox");
bp_layouts["one_column"].top.push("InfoBox");
bp_layouts["no_comment"].top.push("InfoBox");

WGo.i18n.en["rank"] = "Rank";
WGo.i18n.en["caps"] = "Caps";
WGo.i18n.en["time"] = "Time";

WGo.BasicPlayer.component.InfoBox = InfoBox;

})(WGo);
