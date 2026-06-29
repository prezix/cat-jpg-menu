var CatJpgBaseMenuController = MenuController;
MenuController = function( $scope, $rootScope )
{
	CatJpgBaseMenuController( $scope, $rootScope );

	var runGameUiCommand = function( command )
	{
		lua.Run( "RunGameUICommand( %s )", command );
	};

	$scope.OpenOptions = function()
	{
		runGameUiCommand( "OpenOptionsDialog" );
	};

	$scope.OpenLegacyServerBrowser = function()
	{
		runGameUiCommand( "OpenServerBrowser" );
	};

	$scope.Disconnect = function()
	{
		lua.Run( "RunConsoleCommand( 'disconnect' )" );
	};

	$scope.QuitGame = function()
	{
		runGameUiCommand( "Quit" );
	};

	$scope.BackToGame = function()
	{
		lua.Run( "gui.HideGameUI()" );
	};

	$scope.MenuOption = function( btn, command )
	{
		if ( command == "OpenOptionsDialog" ) return $scope.OpenOptions();
		if ( command == "OpenServerBrowser" ) return $scope.OpenLegacyServerBrowser();
		if ( command == "Quit" || command == "quit" ) return $scope.QuitGame();
		if ( command == "Disconnect" || command == "engine disconnect" ) return $scope.Disconnect();

		runGameUiCommand( command );
	};
};

var CatJpgBaseControllerNewGame = ControllerNewGame;
ControllerNewGame = function( $scope, $element, $rootScope, $location, $filter )
{
	CatJpgBaseControllerNewGame( $scope, $element, $rootScope, $location, $filter );

	$scope.ClickMap = $scope.SelectMap;
};
