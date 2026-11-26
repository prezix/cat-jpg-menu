//
// Cat-JPG-Menu additions.
//
// Loaded after the stock menu scripts and before Angular bootstraps, so wrapping
// MenuController here is picked up by $controllerProvider.register in menuApp.js.
// Everything else stays stock, so Garry's Mod updates to control.*.js keep working.
//
// Settings are stored in garrysmod/data/catjpg_menu.txt (in game) or localStorage (in a browser).
//

( function()
{
	if ( typeof MenuController !== "function" ) return;

	var IN_GAME_ENGINE = ( typeof IN_ENGINE !== "undefined" ) && IN_ENGINE;

	var ACCENTS =
	{
		//         main       hover      active     glow
		yellow: [ "#f3b112", "#ffc800", "#e9b600", "rgba(243, 177, 18, 0.6)" ],
		orange: [ "#ff8a1f", "#ffa24d", "#e67100", "rgba(255, 138, 31, 0.6)" ],
		pink:   [ "#ff5fa2", "#ff85b8", "#e0448a", "rgba(255, 95, 162, 0.6)" ],
		purple: [ "#a970ff", "#c099ff", "#8c4fe8", "rgba(169, 112, 255, 0.6)" ],
		blue:   [ "#3fa7ff", "#6dbcff", "#2b8de0", "rgba(63, 167, 255, 0.6)" ],
		green:  [ "#4cd964", "#72e586", "#36b94e", "rgba(76, 217, 100, 0.6)" ]
	};

	var DEFAULTS =
	{
		accent: "yellow",
		grade: 60,
		animations: true,
		seasonal: true,
		allGamemodes: true
	};

	var STRINGS =
	{
		en:
		{
			settings: "Cat-JPG settings",
			grade: "Colour grading",
			accent: "Accent colour",
			animations: "Animations",
			seasonal: "Seasonal effects (snow, Halloween)",
			allgm: "Cat wallpapers in every gamemode",
			next: "Next wallpaper",
			reset: "Reset"
		},
		ru:
		{
			settings: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 Cat-JPG",
			grade: "\u0426\u0432\u0435\u0442\u043e\u043a\u043e\u0440\u0440\u0435\u043a\u0446\u0438\u044f",
			accent: "\u0426\u0432\u0435\u0442 \u0430\u043a\u0446\u0435\u043d\u0442\u0430",
			animations: "\u0410\u043d\u0438\u043c\u0430\u0446\u0438\u0438",
			seasonal: "\u041f\u0440\u0430\u0437\u0434\u043d\u0438\u0447\u043d\u044b\u0435 \u044d\u0444\u0444\u0435\u043a\u0442\u044b (\u0441\u043d\u0435\u0433, \u0425\u044d\u043b\u043b\u043e\u0443\u0438\u043d)",
			allgm: "\u041a\u043e\u0442\u044b \u0432\u043e \u0432\u0441\u0435\u0445 \u0440\u0435\u0436\u0438\u043c\u0430\u0445",
			next: "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u043e\u0431\u043e\u0438",
			reset: "\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c"
		}
	};

	var LUA_BOOTSTRAP = [
		"CatJpgMenu = CatJpgMenu or {}",
		"if CatJpgMenu.AllGamemodes == nil then CatJpgMenu.AllGamemodes = true end",
		"function CatJpgMenu.Save( json )",
		"	file.Write( 'catjpg_menu.txt', json )",
		"	local tbl = util.JSONToTable( json )",
		"	if tbl and tbl.allGamemodes != nil then CatJpgMenu.SetAllGamemodes( tbl.allGamemodes ) end",
		"end",
		"function CatJpgMenu.SetAllGamemodes( b )",
		"	b = tobool( b )",
		"	if CatJpgMenu.AllGamemodes == b then return end",
		"	CatJpgMenu.AllGamemodes = b",
		"	if IsValid( pnlMainMenu ) and pnlMainMenu.UpdateBackgroundImages then",
		"		pnlMainMenu:UpdateBackgroundImages()",
		"		ChangeBackground()",
		"	end",
		"end",
		"function CatJpgMenu.Patch()",
		"	if not IsValid( pnlMainMenu ) then timer.Simple( 0.25, CatJpgMenu.Patch ) return end",
		"	if not pnlMainMenu.CatJpgOriginalUpdateBackgroundImages then",
		"		pnlMainMenu.CatJpgOriginalUpdateBackgroundImages = pnlMainMenu.UpdateBackgroundImages",
		"		pnlMainMenu.UpdateBackgroundImages = function( self )",
		"			if not CatJpgMenu.AllGamemodes then return self:CatJpgOriginalUpdateBackgroundImages() end",
		"			ClearBackgroundImages()",
		"			if not self:ScreenshotScan( 'gamemodes/' .. engine.ActiveGamemode() .. '/backgrounds/' ) then",
		"				if not self:ScreenshotScan( 'gamemodes/sandbox/backgrounds/' ) then",
		"					self:ScreenshotScan( 'backgrounds/' )",
		"				end",
		"			end",
		"			ChangeBackground( engine.ActiveGamemode() )",
		"		end",
		"	end",
		"	local tbl = util.JSONToTable( file.Read( 'catjpg_menu.txt', 'DATA' ) or '' ) or {}",
		"	if tbl.allGamemodes != nil then CatJpgMenu.AllGamemodes = tobool( tbl.allGamemodes ) end",
		"	pnlMainMenu:UpdateBackgroundImages()",
		"	ChangeBackground()",
		"	pnlMainMenu:Call( 'CatJpgApplySettings(' .. util.TableToJSON( tbl ) .. ')' )",
		"end",
		"CatJpgMenu.Patch()"
	].join( "\n" );

	var settings = {};
	var currentScope = null;

	function copyDefaults()
	{
		var s = {};
		for ( var k in DEFAULTS ) s[ k ] = DEFAULTS[ k ];
		return s;
	}

	function sanitize( obj )
	{
		var s = copyDefaults();
		if ( !obj || typeof obj !== "object" ) return s;

		if ( typeof obj.accent === "string" && ACCENTS[ obj.accent ] ) s.accent = obj.accent;
		var grade = Number( obj.grade );
		if ( obj.grade !== undefined && obj.grade !== null && !isNaN( grade ) ) s.grade = Math.max( 0, Math.min( 100, Math.round( grade ) ) );
		if ( typeof obj.animations === "boolean" ) s.animations = obj.animations;
		if ( typeof obj.seasonal === "boolean" ) s.seasonal = obj.seasonal;
		if ( typeof obj.allGamemodes === "boolean" ) s.allGamemodes = obj.allGamemodes;
		return s;
	}

	function applyAccent()
	{
		var c = ACCENTS[ settings.accent ] || ACCENTS.yellow;
		var root = document.documentElement.style;
		root.setProperty( "--cat-accent", c[ 0 ] );
		root.setProperty( "--cat-accent-hi", c[ 1 ] );
		root.setProperty( "--cat-accent-lo", c[ 2 ] );
		root.setProperty( "--cat-accent-glow", c[ 3 ] );
		root.setProperty( "--cat-grade", String( settings.grade / 100 ) );
	}

	//
	// Seasonal particles (snow in winter, falling leaves on Halloween)
	//
	function currentSeason()
	{
		var d = new Date();
		var m = d.getMonth(), day = d.getDate();

		if ( ( m == 11 && day >= 15 ) || ( m == 0 && day <= 15 ) ) return "winter";
		if ( ( m == 9 && day >= 15 ) || ( m == 10 && day <= 5 ) ) return "halloween";
		return null;
	}

	function updateParticles()
	{
		var old = document.getElementById( "catjpg_particles" );
		if ( old ) old.parentNode.removeChild( old );

		var season = currentSeason();
		if ( !season || !settings.seasonal || !settings.animations || !document.body ) return;

		var box = document.createElement( "div" );
		box.id = "catjpg_particles";
		box.className = "catjpg_season_" + season;

		for ( var i = 0; i < 45; i++ )
		{
			var p = document.createElement( "i" );
			var size = 3 + Math.random() * 5;
			p.style.left = ( Math.random() * 100 ) + "%";
			p.style.width = size + "px";
			p.style.height = size + "px";
			p.style.opacity = ( 0.4 + Math.random() * 0.6 ).toFixed( 2 );
			p.style.animationDuration = ( 8 + Math.random() * 10 ).toFixed( 1 ) + "s, " + ( 2 + Math.random() * 3 ).toFixed( 1 ) + "s";
			p.style.animationDelay = ( -Math.random() * 18 ).toFixed( 1 ) + "s, 0s";
			box.appendChild( p );
		}

		document.body.appendChild( box );
	}

	function applyAll()
	{
		applyAccent();

		if ( document.body )
		{
			document.body.classList.toggle( "catjpg-noanim", !settings.animations );
			document.body.classList.toggle( "catjpg-grade", settings.grade > 0 );
		}

		updateParticles();
	}

	function save()
	{
		var json = JSON.stringify( settings );

		// localStorage is shared with html/loading.html (same asset:// origin), the loading
		// screen reads the accent colour and grading from it
		try { window.localStorage.setItem( "catjpg_menu", json ); } catch ( e ) {}

		if ( IN_GAME_ENGINE )
		{
			lua.Run( "if CatJpgMenu and CatJpgMenu.Save then CatJpgMenu.Save( %s ) end", json );
		}
	}

	function loadLocal()
	{
		try { return JSON.parse( window.localStorage.getItem( "catjpg_menu" ) || "null" ); }
		catch ( e ) { return null; }
	}

	// Called from Lua (CatJpgMenu.Patch) with the saved settings table
	window.CatJpgApplySettings = function( obj )
	{
		settings = sanitize( obj );
		applyAll();
		try { window.localStorage.setItem( "catjpg_menu", JSON.stringify( settings ) ); } catch ( e ) {}

		if ( currentScope )
		{
			currentScope.Cat = settings;
			if ( !currentScope.$$phase && !( currentScope.$root && currentScope.$root.$$phase ) ) currentScope.$apply();
		}
	};

	settings = sanitize( IN_GAME_ENGINE ? null : loadLocal() );
	applyAccent();
	document.addEventListener( "DOMContentLoaded", applyAll );

	var BaseMenuController = MenuController;

	MenuController = function( $scope, $rootScope )
	{
		BaseMenuController.apply( this, arguments );

		currentScope = $scope;
		$scope.Cat = settings;
		$scope.CatAccents = ACCENTS;
		$scope.CatAccentNames = Object.keys( ACCENTS );

		$scope.CatT = function( key )
		{
			// UpdateLanguage() (control.Menu.js) writes to this scope, SelectLanguage() to $rootScope
			var lang = String( $scope.Language || $rootScope.Language || "en" ).toLowerCase();
			var table = STRINGS[ lang ] || STRINGS[ lang.split( "-" )[ 0 ] ] || STRINGS.en;
			return table[ key ] || STRINGS.en[ key ] || key;
		};

		// Roll a new cat. ChangeBackground() lives in lua/menu/background.lua and
		// already ignores the call while in-game or loading.
		$scope.CatNextWallpaper = function()
		{
			lua.Run( "ChangeBackground()" );
		};

		$scope.CatSetAccent = function( name )
		{
			if ( !ACCENTS[ name ] ) return;
			settings.accent = name;
			$scope.CatSave();
		};

		$scope.CatSave = function()
		{
			settings = sanitize( $scope.Cat );
			$scope.Cat = settings;
			applyAll();
			save();
		};

		$scope.CatReset = function()
		{
			$scope.Cat = copyDefaults();
			$scope.CatSave();
		};

		// Close our popup with Escape, like a normal dialog
		document.addEventListener( "keydown", function( e )
		{
			if ( e.keyCode == 27 ) $( ".popup" ).hide();
		} );

		if ( IN_GAME_ENGINE ) lua.Run( LUA_BOOTSTRAP );
	};
} )();
