window.defineGetterSetter = function(variableParent, variableName, getterFunction, setterFunction){
	if (Object.defineProperty)
		{
			try
			{
				Object.defineProperty(variableParent, variableName, { 
					get: getterFunction, 
					set: setterFunction 
				});
			}
			catch(e)
			{
				DOMonly = true;
			}	
		}
		else if (document.__defineGetter__)
		{
			// Use the legacy syntax
			variableParent.__defineGetter__(variableName, getterFunction);
			variableParent.__defineSetter__(variableName, setterFunction);
		}
		else
		{
			// If neither defineProperty or __defineGetter__ is supported
			Console.log("Your browser do not support any getters/setters technique");
		}
}
