(function($, f) {
	var Unslider = function() {
		var _ = this;
		_.o = {
			speed : 500,
			delay : 3e3,
			init : 0,
			pause : !f,
			loop : !f,
			keys : f,
			dots : f,
			arrows : f,
			prev : "&larr;",
			next : "&rarr;",
			fluid : f,
			starting : f,
			complete : f,
			items : ">ul",
			item : ">li",
			easing : "swing",
			autoplay : true
		};
		_.init = function(el, o) {
			_.o = $.extend(_.o, o);
			_.el = el;
			_.ul = el.find(_.o.items);
			_.max = [ el.outerWidth() | 0, el.outerHeight() | 0 ];
			_.li = _.ul.find(_.o.item).each(
					function(index) {
						var me = $(this), width = me.outerWidth(), height = me
								.outerHeight();
						if (width > _.max[0])
							_.max[0] = width;
						if (height > _.max[1])
							_.max[1] = height
					});
			var o = _.o, ul = _.ul, li = _.li, len = li.length;
			_.i = 0;
			el.css({
				width : _.max[0],
				height : li.first().outerHeight(),
				overflow : "hidden"
			});
			ul.css({
				position : "relative",
				left : 0,
				width : len * 100 + "%"
			});
			if (o.fluid) {
				li.css({
					"float" : "left",
					width : 100 / len + "%"
				})
			} else {
				li.css({
					"float" : "left",
					width : _.max[0] + "px"
				})
			}
			o.autoplay && setTimeout(function() {
				if (o.delay | 0) {
					_.play();
					if (o.pause) {
						el.on("mouseover mouseout", function(e) {
							_.stop();
							e.type == "mouseout" && _.play()
						})
					}
				}
			}, o.init | 0);
			if (o.keys) {
				$(document).keydown(function(e) {
					var key = e.which;
					if (key == 37)
						_.prev();
					else if (key == 39)
						_.next();
					else if (key == 27)
						_.stop()
				})
			}
			o.dots && nav("dot");
			o.arrows && nav("arrow");
			if (o.fluid) {
				$(window).resize(
						function() {
							_.r && clearTimeout(_.r);
							_.r = setTimeout(function() {
								var styl = {
									height : li.eq(_.i).outerHeight()
								}, width = el.outerWidth();
								ul.css(styl);
								styl["width"] = Math.min(Math.round(width
										/ el.parent().width() * 100), 100)
										+ "%";
								el.css(styl);
								li.css({
									width : width + "px"
								})
							}, 50)
						}).resize()
			}
			if ($.event.special["move"] || $.Event("move")) {
				el
						.on(
								"movestart",
								function(e) {
									if (e.distX > e.distY && e.distX < -e.distY
											|| e.distX < e.distY
											&& e.distX > -e.distY) {
										e.preventDefault()
									} else {
										el.data("left", _.ul.offset().left
												/ el.width() * 100)
									}
								}).on("move", function(e) {
							var left = 100 * e.distX / el.width();
							_.ul.css("left", el.data("left") + left + "%");
							_.ul.data("left", left)
						}).on("moveend", function(e) {
							var left = _.ul.data("left");
							if (Math.abs(left) > 30) {
								var i = left > 0 ? _.i - 1 : _.i + 1;
								if (i < 0 || i >= len)
									i = _.i;
								_.to(i)
							} else {
								_.to(_.i)
							}
						})
			}
			return _
		};
		_.to = function(index, callback) {
			if (_.t) {
				_.stop();
				_.play()
			}
			var o = _.o, el = _.el, ul = _.ul, li = _.li, current = _.i, target = li
					.eq(index);
			$.isFunction(o.starting) && !callback
					&& o.starting(el, li.eq(current));
			if ((!target.length || index < 0) && o.loop == f)
				return;
			if (!target.length)
				index = 0;
			if (index < 0)
				index = li.length - 1;
			target = li.eq(index);
			var speed = callback ? 5 : o.speed | 0, easing = o.easing, obj = {
				height : target.outerHeight()
			};
			if (!ul.queue("fx").length) {
				el.find(".dot").eq(index).addClass("active").siblings()
						.removeClass("active");
				el.animate(obj, speed, easing)
						&& ul.animate($.extend({
							left : "-" + index + "00%"
						}, obj), speed, easing, function(data) {
							_.i = index;
							$.isFunction(o.complete) && !callback
									&& o.complete(el, target)
						})
			}
		};
		_.play = function() {
			_.t = setInterval(function() {
				_.to(_.i + 1)
			}, _.o.delay | 0)
		};
		_.stop = function() {
			_.t = clearInterval(_.t);
			return _
		};
		_.next = function() {
			return _.stop().to(_.i + 1)
		};
		_.prev = function() {
			return _.stop().to(_.i - 1)
		};
		function nav(name, html) {
			if (name == "dot") {
				html = '<ol class="dots">';
				$.each(_.li, function(index) {
					html += '<li class="'
							+ (index == _.i ? name + " active" : name) + '">'
							+ ++index + "</li>"
				});
				html += "</ol>"
			} else {
				html = '<div class="';
				html = html + name + 's">' + html + name + ' prev">' + _.o.prev
						+ "</div>" + html + name + ' next">' + _.o.next
						+ "</div></div>"
			}
			_.el.addClass("has-" + name + "s").append(html).find("." + name)
					.click(
							function() {
								var me = $(this);
								me.hasClass("dot") ? _.stop().to(me.index())
										: me.hasClass("prev") ? _.prev() : _
												.next()
							})
		}
	};
	$.fn.unslider = function(o) {
		var len = this.length;
		return this
				.each(function(index) {
					var me = $(this), key = "unslider"
							+ (len > 1 ? "-" + ++index : ""), instance = (new Unslider)
							.init(me, o);
					me.data(key, instance).data("key", key)
				})
	};
	Unslider.version = "1.0.0"
})(jQuery, false);
(function($) {
	var h = $.scrollTo = function(a, b, c) {
		$(window).scrollTo(a, b, c)
	};
	h.defaults = {
		axis : "xy",
		duration : parseFloat($.fn.jquery) >= 1.3 ? 0 : 1,
		limit : true
	};
	h.window = function(a) {
		return $(window)._scrollable()
	};
	$.fn._scrollable = function() {
		return this.map(function() {
			var a = this, isWin = !a.nodeName
					|| $.inArray(a.nodeName.toLowerCase(), [ "iframe",
							"#document", "html", "body" ]) != -1;
			if (!isWin)
				return a;
			var b = (a.contentWindow || a).document || a.ownerDocument || a;
			return /webkit/i.test(navigator.userAgent)
					|| b.compatMode == "BackCompat" ? b.body
					: b.documentElement
		})
	};
	$.fn.scrollTo = function(e, f, g) {
		if (typeof f == "object") {
			g = f;
			f = 0
		}
		if (typeof g == "function")
			g = {
				onAfter : g
			};
		if (e == "max")
			e = 9e9;
		g = $.extend({}, h.defaults, g);
		f = f || g.duration;
		g.queue = g.queue && g.axis.length > 1;
		if (g.queue)
			f /= 2;
		g.offset = both(g.offset);
		g.over = both(g.over);
		return this
				._scrollable()
				.each(
						function() {
							if (e == null)
								return;
							var d = this, $elem = $(d), targ = e, toff, attr = {}, win = $elem
									.is("html,body");
							switch (typeof targ) {
							case "number":
							case "string":
								if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
									targ = both(targ);
									break
								}
								targ = $(targ, this);
								if (!targ.length)
									return;
							case "object":
								if (targ.is || targ.style)
									toff = (targ = $(targ)).offset()
							}
							$
									.each(
											g.axis.split(""),
											function(i, a) {
												var b = a == "x" ? "Left"
														: "Top", pos = b
														.toLowerCase(), key = "scroll"
														+ b, old = d[key], max = h
														.max(d, a);
												if (toff) {
													attr[key] = toff[pos]
															+ (win ? 0
																	: old
																			- $elem
																					.offset()[pos]);
													if (g.margin) {
														attr[key] -= parseInt(targ
																.css("margin"
																		+ b)) || 0;
														attr[key] -= parseInt(targ
																.css("border"
																		+ b
																		+ "Width")) || 0
													}
													attr[key] += g.offset[pos] || 0;
													if (g.over[pos])
														attr[key] += targ[a == "x" ? "width"
																: "height"]()
																* g.over[pos]
												} else {
													var c = targ[pos];
													attr[key] = c.slice
															&& c.slice(-1) == "%" ? parseFloat(c)
															/ 100 * max
															: c
												}
												if (g.limit
														&& /^\d+$/
																.test(attr[key]))
													attr[key] = attr[key] <= 0 ? 0
															: Math.min(
																	attr[key],
																	max);
												if (!i && g.queue) {
													if (old != attr[key])
														animate(g.onAfterFirst);
													delete attr[key]
												}
											});
							animate(g.onAfter);
							function animate(a) {
								$elem.animate(attr, f, g.easing, a
										&& function() {
											a.call(this, e, g)
										})
							}
						}).end()
	};
	h.max = function(a, b) {
		var c = b == "x" ? "Width" : "Height", scroll = "scroll" + c;
		if (!$(a).is("html,body"))
			return a[scroll] - $(a)[c.toLowerCase()]();
		var d = "client" + c, html = a.ownerDocument.documentElement, body = a.ownerDocument.body;
		return Math.max(html[scroll], body[scroll])
				- Math.min(html[d], body[d])
	};
	function both(a) {
		return typeof a == "object" ? a : {
			top : a,
			left : a
		}
	}
})(jQuery);
(function($) {
	$.fn.anystretch = function(src, options, callback) {
		var isBody = this.selector.length ? false : true;
		return this
				.each(function(i) {
					var defaultSettings = {
						positionX : "center",
						positionY : "center",
						speed : 0,
						elPosition : "relative"
					}, el = $(this), container = isBody ? $(".anystretch") : el
							.children(".anystretch"), settings = container
							.data("settings")
							|| defaultSettings, existingSettings = container
							.data("settings"), imgRatio, bgImg, bgWidth, bgHeight, bgOffset, bgCSS;
					if (options && typeof options == "object")
						$.extend(settings, options);
					if (options && typeof options == "function")
						callback = options;
					$(document).ready(_init);
					return this;
					function _init() {
						if (src) {
							var img;
							if (!isBody) {
								el.css({
									position : settings.elPosition,
									background : "none"
								})
							}
							if (container.length == 0) {
								container = $("<div />").attr("class",
										"anystretch").css({
									left : 0,
									top : 0,
									position : isBody ? "fixed" : "absolute",
									overflow : "hidden",
									zIndex : isBody ? -999999 : -999998,
									margin : 0,
									padding : 0,
									height : "100%",
									width : "100%"
								})
							} else {
								container.find("img").addClass("deleteable")
							}
							img = $("<img />")
									.css({
										position : "absolute",
										display : "none",
										margin : 0,
										padding : 0,
										border : "none",
										zIndex : -999999
									})
									.bind(
											"load",
											function(e) {
												var self = $(this), imgWidth, imgHeight;
												self.css({
													width : "auto",
													height : "auto"
												});
												imgWidth = this.width
														|| $(e.target).width();
												imgHeight = this.height
														|| $(e.target).height();
												imgRatio = imgWidth / imgHeight;
												_adjustBG(function() {
													self
															.fadeIn(
																	settings.speed,
																	function() {
																		container
																				.find(
																						".deleteable")
																				.remove();
																		if (typeof callback == "function")
																			callback()
																	})
												})
											}).appendTo(container);
							if (el.children(".anystretch").length == 0) {
								if (isBody) {
									$("body").append(container)
								} else {
									el.append(container)
								}
							}
							container.data("settings", settings);
							img.attr("src", src);
							$(window).resize(_adjustBG)
						}
					}
					function _adjustBG(fn) {
						try {
							bgCSS = {
								left : 0,
								top : 0
							};
							bgWidth = _width();
							bgHeight = bgWidth / imgRatio;
							if (bgHeight >= _height()) {
								bgOffset = (bgHeight - _height()) / 2;
								if (settings.positionY == "center"
										|| settings.centeredY) {
									$.extend(bgCSS, {
										top : "-" + bgOffset + "px"
									})
								} else if (settings.positionY == "bottom") {
									$.extend(bgCSS, {
										top : "auto",
										bottom : "0px"
									})
								}
							} else {
								bgHeight = _height();
								bgWidth = bgHeight * imgRatio;
								bgOffset = (bgWidth - _width()) / 2;
								if (settings.positionX == "center"
										|| settings.centeredX) {
									$.extend(bgCSS, {
										left : "-" + bgOffset + "px"
									})
								} else if (settings.positionX == "right") {
									$.extend(bgCSS, {
										left : "auto",
										right : "0px"
									})
								}
							}
							container.children("img:not(.deleteable)").width(
									bgWidth).height(bgHeight).filter("img")
									.css(bgCSS)
						} catch (err) {
						}
						if (typeof fn == "function")
							fn()
					}
					function _width() {
						return isBody ? el.width() : el.innerWidth()
					}
					function _height() {
						return isBody ? el.height() : el.innerHeight()
					}
				})
	};
	$.anystretch = function(src, options, callback) {
		var el = "onorientationchange" in window ? $(document) : $(window);
		el.anystretch(src, options, callback)
	}
})(jQuery);