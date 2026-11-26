//
// Cat-JPG-Menu loading screen additions.
//
// Loaded at the end of the stock html/loading.html. Garry's Mod calls these globals while
// connecting: GameDetails, SetFilesTotal, SetFilesNeeded, DownloadingFile, SetStatusChanged.
// The stock versions are wrapped, not replaced, so stock behaviour is kept.
//
// The accent colour and colour grading come from the main menu settings (localStorage,
// written by html/js/menu/catjpg.js). Without them the defaults are used.
//

( function()
{
	var WALLPAPERS = ["GravyExplosion.jpg", "army-soviet-union.jpg", "army.jpg", "bite.jpg", "bumbumchao.jpg", "catangrywtf.jpg", "cathappy.jpg", "cathappygay.jpg", "catjpgcry.jpg", "cool.jpg", "gop.jpg", "gopnik.jpg", "grabe.jpg", "intelegent.jpg", "legacy.jpg", "look.jpg", "lookwtf.jpg", "newyearcatjpg.jpg", "ongry_bumbum.jpg", "ptb.jpg", "rorchik.jpg", "sniff_cat.jpg", "soviet.jpg", "standardcatjpg.jpg", "succat.jpg", "suitcat.jpg", "wewewe.jpg", "wowo.jpg", "yes.jpg", "yogogo.jpg", "young-1.jpg", "young.jpg"];
	var WALLPAPER_DIR = "../gamemodes/sandbox/backgrounds/";
	var SLIDE_SECONDS = 7;

	var ACCENTS =
	{
		yellow: [ "#f3b112", "rgba(243, 177, 18, 0.6)" ],
		orange: [ "#ff8a1f", "rgba(255, 138, 31, 0.6)" ],
		pink:   [ "#ff5fa2", "rgba(255, 95, 162, 0.6)" ],
		purple: [ "#a970ff", "rgba(169, 112, 255, 0.6)" ],
		blue:   [ "#3fa7ff", "rgba(63, 167, 255, 0.6)" ],
		green:  [ "#4cd964", "rgba(76, 217, 100, 0.6)" ]
	};

	var TIPS =
	{
		en: [
			"cat.jpg is watching you load.",
			"Tip: press Q to open the spawn menu.",
			"Tip: hold E while holding a prop with the Physics Gun to rotate it.",
			"Tip: the paw button in the main menu changes the theme colour.",
			"Tip: right click with the Physics Gun freezes a prop.",
			"Tip: type \"kill\" in the console if you get stuck.",
			"Tip: the cat button in the main menu rolls a new wallpaper.",
			"Loading... the cat is doing its best."
		],
		ru: [
			"cat.jpg \u0441\u043b\u0435\u0434\u0438\u0442 \u0437\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u043e\u0439.",
			"\u0421\u043e\u0432\u0435\u0442: Q \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442 \u043c\u0435\u043d\u044e \u0441\u043f\u0430\u0432\u043d\u0430.",
			"\u0421\u043e\u0432\u0435\u0442: \u0434\u0435\u0440\u0436\u0430 \u043f\u0440\u043e\u043f \u0444\u0438\u0437\u0433\u0430\u043d\u043e\u043c, \u0437\u0430\u0436\u043c\u0438 E, \u0447\u0442\u043e\u0431\u044b \u0432\u0440\u0430\u0449\u0430\u0442\u044c \u0435\u0433\u043e.",
			"\u0421\u043e\u0432\u0435\u0442: \u043a\u043d\u043e\u043f\u043a\u0430 \u0441 \u043b\u0430\u043f\u043a\u043e\u0439 \u0432 \u0433\u043b\u0430\u0432\u043d\u043e\u043c \u043c\u0435\u043d\u044e \u043c\u0435\u043d\u044f\u0435\u0442 \u0446\u0432\u0435\u0442 \u0442\u0435\u043c\u044b.",
			"\u0421\u043e\u0432\u0435\u0442: \u043f\u0440\u0430\u0432\u044b\u0439 \u043a\u043b\u0438\u043a \u0444\u0438\u0437\u0433\u0430\u043d\u043e\u043c \u0437\u0430\u043c\u043e\u0440\u0430\u0436\u0438\u0432\u0430\u0435\u0442 \u043f\u0440\u043e\u043f.",
			"\u0421\u043e\u0432\u0435\u0442: \u0437\u0430\u0441\u0442\u0440\u044f\u043b \u2014 \u043d\u0430\u043f\u0438\u0448\u0438 \"kill\" \u0432 \u043a\u043e\u043d\u0441\u043e\u043b\u0438.",
			"\u0421\u043e\u0432\u0435\u0442: \u043a\u043d\u043e\u043f\u043a\u0430 \u0441 \u043a\u043e\u0442\u043e\u043c \u0432 \u0433\u043b\u0430\u0432\u043d\u043e\u043c \u043c\u0435\u043d\u044e \u043c\u0435\u043d\u044f\u0435\u0442 \u043e\u0431\u043e\u0438.",
			"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430... \u043a\u043e\u0442 \u0441\u0442\u0430\u0440\u0430\u0435\u0442\u0441\u044f \u0438\u0437\u043e \u0432\u0441\u0435\u0445 \u0441\u0438\u043b."
		]
	};

	//
	// Settings from the main menu
	//
	var settings = { accent: "yellow", grade: 60, animations: true };
	try
	{
		var saved = JSON.parse( window.localStorage.getItem( "catjpg_menu" ) || "null" );
		if ( saved && typeof saved === "object" )
		{
			if ( ACCENTS[ saved.accent ] ) settings.accent = saved.accent;
			if ( typeof saved.grade === "number" ) settings.grade = Math.max( 0, Math.min( 100, saved.grade ) );
			if ( typeof saved.animations === "boolean" ) settings.animations = saved.animations;
		}
	}
	catch ( e ) {}

	var root = document.documentElement.style;
	root.setProperty( "--cat-accent", ACCENTS[ settings.accent ][ 0 ] );
	root.setProperty( "--cat-accent-glow", ACCENTS[ settings.accent ][ 1 ] );
	root.setProperty( "--cat-grade", String( settings.grade / 100 ) );
	if ( !settings.animations ) document.body.classList.add( "catjpg-noanim" );

	var lang = ( navigator.language || "en" ).toLowerCase().split( "-" )[ 0 ];
	var filesTotal = 0;
	var filesNeeded = 0;
	var tipIndex = Math.floor( Math.random() * 100 );
	var tipTimer = null;
	var slideTimer = null;

	function el( tag, id, parent, before )
	{
		var e = document.createElement( tag );
		if ( id ) e.id = id;
		if ( parent ) parent.insertBefore( e, before || null );
		return e;
	}

	//
	// Background: two layers that crossfade, each with a slow Ken Burns move
	//
	var layers = [ el( "div", "catjpg_bg_a", document.body, document.body.firstChild ), null ];
	layers[ 1 ] = el( "div", "catjpg_bg_b", document.body, layers[ 0 ].nextSibling );
	el( "div", "catjpg_grade", document.body, layers[ 1 ].nextSibling );

	var front = 0;
	var lastCat = null;

	function showImage( url )
	{
		var next = layers[ 1 - front ];
		var cur = layers[ front ];

		next.style.backgroundImage = "url('" + url + "')";

		// Restart the Ken Burns animation with a random direction
		next.className = "";
		void next.offsetWidth;
		next.className = "kb" + Math.floor( Math.random() * 4 ) + " visible";
		cur.classList.remove( "visible" );

		front = 1 - front;
	}

	function randomCat()
	{
		if ( WALLPAPERS.length == 0 ) return null;

		var cat = WALLPAPERS[ Math.floor( Math.random() * WALLPAPERS.length ) ];
		if ( cat == lastCat && WALLPAPERS.length > 1 ) return randomCat();

		lastCat = cat;
		return WALLPAPER_DIR + cat;
	}

	function nextCat()
	{
		var url = randomCat();
		if ( !url ) return;

		// Preload so the crossfade never shows a half-loaded image
		var img = new Image();
		img.onload = function() { showImage( url ); };
		img.src = url;
	}

	function startSlideshow()
	{
		nextCat();
		slideTimer = setInterval( nextCat, SLIDE_SECONDS * 1000 );
	}

	function stopSlideshow()
	{
		if ( slideTimer ) clearInterval( slideTimer );
		slideTimer = null;
	}

	//
	// Status, progress bar, current file, tips
	//
	var container = document.getElementById( "container" ) || document.body;
	var panel     = el( "div", "catjpg_loading", container );
	var status    = el( "div", "catjpg_status", panel );
	var bar       = el( "div", "catjpg_progress", panel );
	var barInner  = el( "div", "catjpg_progress_inner", bar );
	var fileLine  = el( "div", "catjpg_file", panel );
	var tipLine   = el( "div", "catjpg_tip", panel );

	function showTip()
	{
		var list = TIPS[ lang ] || TIPS.en;
		tipLine.classList.remove( "show" );

		setTimeout( function()
		{
			tipLine.textContent = list[ tipIndex++ % list.length ];
			tipLine.classList.add( "show" );
		}, 250 );
	}

	function startTips()
	{
		if ( tipTimer ) clearInterval( tipTimer );
		showTip();
		tipTimer = setInterval( showTip, 7000 );
	}

	function updateProgress()
	{
		if ( filesTotal <= 0 )
		{
			bar.classList.remove( "visible" );
			return;
		}

		var done = Math.max( 0, filesTotal - filesNeeded );
		var pct = Math.min( 100, Math.round( done / filesTotal * 100 ) );

		bar.classList.add( "visible" );
		bar.classList.toggle( "done", pct >= 100 );
		barInner.style.width = pct + "%";
		bar.setAttribute( "data-label", done + " / " + filesTotal + "  (" + pct + "%)" );
	}

	function wrap( name, fn )
	{
		var base = window[ name ];
		window[ name ] = function()
		{
			if ( typeof base === "function" )
			{
				try { base.apply( this, arguments ); } catch ( e ) {}
			}
			fn.apply( this, arguments );
		};
	}

	wrap( "GameDetails", function( servername, serverurl, mapname, maxplayers, steamid, gamemode, volume, language )
	{
		if ( typeof language === "string" && language.length > 0 )
		{
			lang = language.toLowerCase().split( "-" )[ 0 ];
			startTips();
		}

		// Swap the cats for the map image once it actually loads; keep the cats if it doesn't
		if ( mapname )
		{
			var url = "asset://mapimage/" + mapname;
			var img = new Image();
			img.onload = function()
			{
				if ( img.naturalWidth < 2 ) return;
				stopSlideshow();
				showImage( url );
			};
			img.src = url;
		}
	} );

	wrap( "SetFilesTotal", function( total )
	{
		filesTotal = Number( total ) || 0;
		updateProgress();
	} );

	wrap( "SetFilesNeeded", function( needed )
	{
		filesNeeded = Number( needed ) || 0;
		updateProgress();
	} );

	wrap( "DownloadingFile", function( file )
	{
		fileLine.textContent = String( file || "" );
		fileLine.classList.add( "visible" );
	} );

	wrap( "SetStatusChanged", function( text )
	{
		status.textContent = String( text || "" );
		status.classList.add( "visible" );
		status.classList.remove( "pulse" );
		void status.offsetWidth;
		status.classList.add( "pulse" );
	} );

	startSlideshow();
	startTips();
} )();
